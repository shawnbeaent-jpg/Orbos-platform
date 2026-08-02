import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import crypto from "crypto";

// Constant-time string comparison to avoid leaking credential length/content
// via timing. Returns false immediately on length mismatch.
function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

/** Whether admin credentials are configured. When false, /admin is left open
 *  as a local/dev fallback (a banner warns) rather than locking everyone out. */
export function adminAuthConfigured(): boolean {
  return Boolean(process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD);
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  providers: [
    CredentialsProvider({
      name: "Admin",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize(credentials) {
        const u = process.env.ADMIN_USERNAME;
        const p = process.env.ADMIN_PASSWORD;
        if (!u || !p) return null; // not configured — no login possible
        if (
          credentials &&
          safeEqual(credentials.username ?? "", u) &&
          safeEqual(credentials.password ?? "", p)
        ) {
          return { id: "admin", name: "Admin", email: "admin@galandclearing.com" };
        }
        return null;
      },
    }),
  ],
};
