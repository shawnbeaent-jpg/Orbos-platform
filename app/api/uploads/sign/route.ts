import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit } from "@/lib/rateLimit";
import { isStorageConfigured, isAllowedMime, createSignedUpload, MAX_UPLOAD_BYTES } from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  filename: z.string().min(1).max(200),
  contentType: z.string().min(1).max(120),
  size: z.number().int().nonnegative().max(MAX_UPLOAD_BYTES, "File too large"),
});

// Issues a signed upload URL for the quote-form file step. When storage is not
// configured, returns { configured: false } so the client falls back to
// recording file names only (no error, form still submits).
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const limited = rateLimit(`upload:${ip}`, 40, 60_000);
  if (!limited.ok) {
    return NextResponse.json({ ok: false, error: "Too many upload requests." }, { status: 429 });
  }

  if (!isStorageConfigured()) {
    return NextResponse.json({ ok: true, configured: false });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid file." }, { status: 422 });
  }
  if (!isAllowedMime(parsed.data.contentType)) {
    return NextResponse.json({ ok: false, error: "Unsupported file type." }, { status: 415 });
  }

  try {
    const { path, uploadUrl } = await createSignedUpload(parsed.data.filename);
    return NextResponse.json({ ok: true, configured: true, path, uploadUrl });
  } catch (err) {
    console.error("[uploads] sign error", (err as Error).message);
    return NextResponse.json({ ok: false, error: "Could not prepare upload." }, { status: 502 });
  }
}
