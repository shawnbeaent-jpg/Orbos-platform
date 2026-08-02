import { NextRequest, NextResponse } from "next/server";
import { createSignedDownload, isStorageConfigured } from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Redirects an admin to a short-lived signed download URL for an uploaded file.
// Protected by middleware (matcher includes /api/admin/*).
export async function GET(req: NextRequest) {
  if (!isStorageConfigured()) {
    return NextResponse.json({ ok: false, error: "Storage not configured." }, { status: 503 });
  }
  const path = req.nextUrl.searchParams.get("path");
  if (!path) {
    return NextResponse.json({ ok: false, error: "Missing path." }, { status: 400 });
  }
  const url = await createSignedDownload(path, 300);
  if (!url) {
    return NextResponse.json({ ok: false, error: "Could not sign download." }, { status: 502 });
  }
  return NextResponse.redirect(url);
}
