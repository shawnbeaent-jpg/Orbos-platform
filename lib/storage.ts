// Secure file uploads via Supabase Storage (spec §10 secure file storage, §23).
// Uses signed upload URLs so files go browser -> storage directly (they never
// pass through the serverless function). Everything is env-gated: with no
// Supabase config the app degrades to recording file names only, exactly as
// before — the quote form never breaks for a missing key.

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
  "application/pdf",
]);

export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024; // 15 MB per file

export function isStorageConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function bucket(): string {
  return process.env.SUPABASE_UPLOAD_BUCKET || "lead-uploads";
}

export function isAllowedMime(mime: string): boolean {
  return ALLOWED_MIME.has(mime);
}

function safeName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-80) || "file";
}

function randomId(): string {
  const c = "abcdefghijklmnopqrstuvwxyz0123456789";
  let s = "";
  for (let i = 0; i < 12; i++) s += c[Math.floor(Math.random() * c.length)];
  return s;
}

type SignedUpload = { path: string; uploadUrl: string };

// Create a one-time signed upload URL for a single object.
export async function createSignedUpload(filename: string): Promise<SignedUpload> {
  const base = process.env.SUPABASE_URL!.replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const b = bucket();
  const date = new Date().toISOString().slice(0, 10);
  const path = `${date}/${randomId()}-${safeName(filename)}`;

  const res = await fetch(`${base}/storage/v1/object/upload/sign/${b}/${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, apikey: key, "Content-Type": "application/json" },
  });
  if (!res.ok) {
    throw new Error(`Supabase sign failed (${res.status})`);
  }
  const json = (await res.json()) as { url: string };
  // json.url is a relative path beginning with /object/upload/sign/...
  return { path: `${b}/${path}`, uploadUrl: `${base}/storage/v1${json.url}` };
}

// Create a short-lived signed download URL for the admin to view an uploaded file.
export async function createSignedDownload(fullPath: string, expiresInSec = 300): Promise<string | null> {
  if (!isStorageConfigured()) return null;
  const base = process.env.SUPABASE_URL!.replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const slash = fullPath.indexOf("/");
  if (slash < 0) return null;
  const b = fullPath.slice(0, slash);
  const objectPath = fullPath.slice(slash + 1);

  const res = await fetch(`${base}/storage/v1/object/sign/${b}/${objectPath}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, apikey: key, "Content-Type": "application/json" },
    body: JSON.stringify({ expiresIn: expiresInSec }),
  });
  if (!res.ok) return null;
  const json = (await res.json()) as { signedURL: string };
  return `${base}/storage/v1${json.signedURL}`;
}
