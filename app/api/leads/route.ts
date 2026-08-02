import { NextRequest, NextResponse } from "next/server";
import { leadSchema } from "@/lib/leadSchema";
import { scoreLead } from "@/lib/leadScore";
import { rateLimit } from "@/lib/rateLimit";
import { counties, cities } from "@/lib/locations";
import { sendLeadEmails, sendLeadSms } from "@/lib/notify";
import { prisma } from "@/lib/prisma";
import type { LeadCategory as PrismaLeadCategory } from "@prisma/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function publicId() {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `GLC-${s}`;
}

// Best-effort distance lookup from HQ based on provided city/county text.
function milesFromHQ(city?: string, county?: string): number | null {
  const norm = (v?: string) => (v ?? "").toLowerCase().replace(/\s+county$/i, "").trim();
  if (city) {
    const c = cities.find((x) => x.name.toLowerCase() === norm(city));
    if (c) return c.approxMilesFromHQ;
  }
  if (county) {
    const co = counties.find((x) => x.name.toLowerCase().replace(/\s+county$/i, "") === norm(county));
    if (co) return co.approxMilesFromHQ;
  }
  return null;
}

const categoryToEnum: Record<string, PrismaLeadCategory> = {
  priority: "PRIORITY",
  qualified: "QUALIFIED",
  "needs-review": "NEEDS_REVIEW",
  "low-quality": "LOW_QUALITY",
};

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const limited = rateLimit(`lead:${ip}`, 5, 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please wait a moment and try again." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Please check the form and try again.", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }
  const data = parsed.data;

  // Honeypot: a filled hidden field means a bot. Pretend success, store nothing.
  if (data.company_website) {
    return NextResponse.json({ ok: true, id: publicId(), score: 0, category: "low-quality" });
  }

  const miles = milesFromHQ(data.city, data.county);
  const { score, category, factors } = scoreLead({
    propertyType: data.propertyType,
    acreage: data.acreage,
    services: data.services,
    timeline: data.timeline,
    budget: data.budget,
    ownership: data.ownership,
    hasUploads: (data.uploadKeys?.length ?? 0) > 0,
    address: data.address || undefined,
    siteConditions: data.siteConditions || undefined,
    milesFromHQ: miles,
  });

  const id = publicId();
  const summary = {
    publicId: id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    score,
    category,
    services: data.services,
    city: data.city || null,
    smsConsent: data.smsConsent,
  };

  // Persist. Degrades gracefully if DATABASE_URL is not configured (e.g. preview
  // env) — the prospect still gets a lead ID and confirmation rather than an error.
  let persisted = false;
  try {
    await prisma.lead.create({
      data: {
        publicId: id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        smsConsent: data.smsConsent,
        address: data.address || null,
        city: data.city || null,
        county: data.county || null,
        propertyType: data.propertyType || null,
        acreage: data.acreage || null,
        access: data.access || null,
        services: JSON.stringify(data.services),
        siteConditions: data.siteConditions || null,
        timeline: data.timeline || null,
        budget: data.budget || null,
        ownership: data.ownership || null,
        uploadKeys: JSON.stringify(data.uploadKeys ?? []),
        source: data.source,
        utmSource: data.utmSource || null,
        utmMedium: data.utmMedium || null,
        utmCampaign: data.utmCampaign || null,
        referrer: data.referrer || null,
        score,
        category: categoryToEnum[category],
        scoreFactors: JSON.stringify(factors),
        tasks: {
          // Immediate follow-up task (spec §10 workflow).
          create: { title: `Follow up with ${data.name} (${category})` },
        },
      },
    });
    persisted = true;
  } catch (err) {
    console.error("[leads] DB write failed (continuing gracefully):", (err as Error).message);
  }

  // Fire notifications (no-op without provider keys / consent).
  await Promise.allSettled([sendLeadEmails(summary), sendLeadSms(summary)]);

  return NextResponse.json({ ok: true, id, score, category, persisted });
}
