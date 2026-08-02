import { prisma } from "./prisma";
import type { Lead } from "@prisma/client";

export const LEAD_STAGES = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "SITE_VISIT",
  "PROPOSAL",
  "WON",
  "SCHEDULED",
  "COMPLETED",
  "LOST",
  "NURTURE",
] as const;

export type LeadStageKey = (typeof LEAD_STAGES)[number];

export const stageLabel: Record<string, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  QUALIFIED: "Qualified",
  SITE_VISIT: "Site Visit",
  PROPOSAL: "Proposal",
  WON: "Won",
  SCHEDULED: "Scheduled",
  COMPLETED: "Completed",
  LOST: "Lost",
  NURTURE: "Nurture",
};

export const categoryStyle: Record<string, string> = {
  PRIORITY: "bg-emerald/15 text-forest border-emerald/30",
  QUALIFIED: "bg-gold/15 text-[#8a6d20] border-gold/30",
  NEEDS_REVIEW: "bg-brandslate/10 text-brandslate border-brandslate/25",
  LOW_QUALITY: "bg-error/10 text-error border-error/25",
};

export type AdminData = {
  ok: boolean;
  reason?: string;
  leads: Lead[];
  metrics: {
    total: number;
    priority: number;
    won: number;
    conversionRate: number; // won / total
    newThisWeek: number;
  };
};

// Reads leads with a graceful fallback so the dashboard renders (empty) even
// when DATABASE_URL is not configured — no crash, clear reason shown.
export async function getAdminData(): Promise<AdminData> {
  try {
    const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 500 });
    const total = leads.length;
    const won = leads.filter((l) => l.stage === "WON" || l.stage === "COMPLETED").length;
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return {
      ok: true,
      leads,
      metrics: {
        total,
        priority: leads.filter((l) => l.category === "PRIORITY").length,
        won,
        conversionRate: total ? Math.round((won / total) * 100) : 0,
        newThisWeek: leads.filter((l) => l.createdAt.getTime() > weekAgo).length,
      },
    };
  } catch (err) {
    return {
      ok: false,
      reason: (err as Error).message,
      leads: [],
      metrics: { total: 0, priority: 0, won: 0, conversionRate: 0, newThisWeek: 0 },
    };
  }
}

export function effectiveScore(l: { score: number; scoreOverride: number | null }) {
  return l.scoreOverride ?? l.score;
}
