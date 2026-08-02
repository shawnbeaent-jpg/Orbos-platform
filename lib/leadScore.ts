// Lead scoring engine (spec §11). Pure function — deterministic, testable,
// no side effects. Produces a 0–100 score plus a category and the factor
// breakdown so the admin UI and internal team can see WHY a lead scored as it did.
// A human can always override the score (see admin), consistent with the ORBOS
// "no unconfirmed changes" rule.

import { z } from "zod";

// Shared enums used by both the API validator and the scorer.
export const propertyTypes = ["residential", "commercial", "agricultural", "municipal"] as const;
export const timelines = ["asap", "1-3-months", "3-6-months", "planning", "unsure"] as const;
export const budgetBands = ["under-5k", "5k-15k", "15k-50k", "50k-plus", "unsure"] as const;
export const acreageBands = ["under-1", "1-3", "3-10", "10-plus", "unsure"] as const;
export const ownershipOptions = ["owner", "under-contract", "agent-representative", "other"] as const;

export type LeadScoreInput = {
  propertyType?: (typeof propertyTypes)[number];
  acreage?: (typeof acreageBands)[number];
  services?: string[];
  timeline?: (typeof timelines)[number];
  budget?: (typeof budgetBands)[number];
  ownership?: (typeof ownershipOptions)[number];
  hasUploads?: boolean;
  // Completeness signals
  address?: string;
  siteConditions?: string;
  milesFromHQ?: number | null;
};

export type LeadCategory = "priority" | "qualified" | "needs-review" | "low-quality";

export type LeadScoreResult = {
  score: number; // 0–100
  category: LeadCategory;
  factors: { label: string; points: number }[];
};

function clampFrom(miles: number | null | undefined): number {
  // Location factor: closer to Marietta HQ scores higher (serviceability),
  // but statewide work is still valued — never zeroes out.
  if (miles == null) return 3;
  if (miles <= 20) return 8;
  if (miles <= 40) return 6;
  if (miles <= 75) return 4;
  return 2;
}

export function scoreLead(input: LeadScoreInput): LeadScoreResult {
  const factors: { label: string; points: number }[] = [];
  const add = (label: string, points: number) => {
    if (points > 0) factors.push({ label, points });
  };

  // Project size / acreage (max 20)
  const acreagePts =
    { "under-1": 6, "1-3": 12, "3-10": 18, "10-plus": 20, unsure: 6 }[
      input.acreage ?? "unsure"
    ] ?? 6;
  add("Project size", acreagePts);

  // Commercial vs residential (max 15) — commercial/municipal skew higher value
  const typePts =
    { residential: 8, agricultural: 11, commercial: 15, municipal: 15 }[
      input.propertyType ?? "residential"
    ] ?? 8;
  add("Property type", typePts);

  // Service type (max 12) — development/grading/site work higher intent
  const highIntent = new Set([
    "site-development",
    "grading-leveling",
    "excavation",
    "commercial-clearing",
    "right-of-way-clearing",
    "land-clearing",
  ]);
  const svc = input.services ?? [];
  let servicePts = Math.min(12, svc.length * 3);
  if (svc.some((s) => highIntent.has(s))) servicePts = Math.min(12, servicePts + 3);
  add("Services requested", servicePts);

  // Timeline urgency (max 18)
  const timelinePts =
    { asap: 18, "1-3-months": 14, "3-6-months": 9, planning: 5, unsure: 4 }[
      input.timeline ?? "unsure"
    ] ?? 4;
  add("Timeline", timelinePts);

  // Budget readiness (max 15)
  const budgetPts =
    { "under-5k": 5, "5k-15k": 9, "15k-50k": 13, "50k-plus": 15, unsure: 4 }[
      input.budget ?? "unsure"
    ] ?? 4;
  add("Budget readiness", budgetPts);

  // Ownership / authority (max 7)
  const ownerPts =
    { owner: 7, "under-contract": 6, "agent-representative": 5, other: 2 }[
      input.ownership ?? "other"
    ] ?? 2;
  add("Decision authority", ownerPts);

  // Location / serviceability (max 8)
  add("Location", clampFrom(input.milesFromHQ));

  // Data completeness + uploads (max 5)
  let completeness = 0;
  if (input.address && input.address.trim().length > 4) completeness += 2;
  if (input.siteConditions && input.siteConditions.trim().length > 10) completeness += 1;
  if (input.hasUploads) completeness += 2;
  add("Completeness & uploads", completeness);

  const raw = factors.reduce((sum, f) => sum + f.points, 0);
  const score = Math.max(0, Math.min(100, Math.round(raw)));

  const category: LeadCategory =
    score >= 80 ? "priority" : score >= 60 ? "qualified" : score >= 40 ? "needs-review" : "low-quality";

  return { score, category, factors };
}

export const categoryLabel: Record<LeadCategory, string> = {
  priority: "Priority (80–100)",
  qualified: "Qualified (60–79)",
  "needs-review": "Needs review (40–59)",
  "low-quality": "Low quality (0–39)",
};
