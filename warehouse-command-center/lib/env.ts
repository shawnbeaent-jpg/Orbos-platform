import { z } from 'zod';

/**
 * Centralized, validated environment access.
 *
 * Public variables (NEXT_PUBLIC_*) are safe in the browser. Server-only secrets
 * are read lazily and must never be imported into a client component — importing
 * `serverEnv` from client code will throw at runtime because the values are absent.
 */

const publicSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(20),
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),
});

const serverSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(20),
  UPLOAD_ALLOWED_MIME: z
    .string()
    .default('image/jpeg,image/png,image/webp,application/pdf')
    .transform((v) => v.split(',').map((s) => s.trim()).filter(Boolean)),
  UPLOAD_MAX_BYTES: z
    .string()
    .default('15728640')
    .transform((v) => Number.parseInt(v, 10))
    .pipe(z.number().int().positive()),
});

function readPublicEnv() {
  const parsed = publicSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  });
  if (!parsed.success) {
    throw new Error(
      `Invalid public environment configuration:\n${parsed.error.issues
        .map((i) => `  - ${i.path.join('.')}: ${i.message}`)
        .join('\n')}`,
    );
  }
  return parsed.data;
}

export const publicEnv = readPublicEnv();

let cachedServerEnv: z.infer<typeof serverSchema> | null = null;

export function serverEnv(): z.infer<typeof serverSchema> {
  if (cachedServerEnv) return cachedServerEnv;
  const parsed = serverSchema.safeParse({
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    UPLOAD_ALLOWED_MIME: process.env.UPLOAD_ALLOWED_MIME,
    UPLOAD_MAX_BYTES: process.env.UPLOAD_MAX_BYTES,
  });
  if (!parsed.success) {
    throw new Error(
      `Invalid server environment configuration:\n${parsed.error.issues
        .map((i) => `  - ${i.path.join('.')}: ${i.message}`)
        .join('\n')}`,
    );
  }
  cachedServerEnv = parsed.data;
  return cachedServerEnv;
}
