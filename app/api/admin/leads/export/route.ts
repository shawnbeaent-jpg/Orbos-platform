import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { effectiveScore } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// CSV export of leads (spec §12). NOTE: this endpoint is unauthenticated in this
// build — gate it behind admin auth before production (see /admin banner).
function csvCell(v: unknown): string {
  const s = v == null ? "" : String(v);
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET() {
  let leads;
  try {
    leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 5000 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: (err as Error).message }, { status: 503 });
  }

  const headers = [
    "publicId", "createdAt", "name", "email", "phone", "smsConsent", "city", "county",
    "propertyType", "acreage", "services", "timeline", "budget", "ownership", "stage",
    "category", "score", "source", "utmSource", "utmMedium", "utmCampaign",
  ];

  const rows = leads.map((l) =>
    [
      l.publicId, l.createdAt.toISOString(), l.name, l.email, l.phone, l.smsConsent, l.city, l.county,
      l.propertyType, l.acreage, l.services, l.timeline, l.budget, l.ownership, l.stage,
      l.category, effectiveScore(l), l.source, l.utmSource, l.utmMedium, l.utmCampaign,
    ]
      .map(csvCell)
      .join(",")
  );

  const csv = [headers.map(csvCell).join(","), ...rows].join("\n");
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="galandclearing-leads-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
