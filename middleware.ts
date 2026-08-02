import { withAuth } from "next-auth/middleware";

// Protect the admin dashboard and admin APIs. If admin credentials are NOT
// configured (ADMIN_USERNAME / ADMIN_PASSWORD unset), access is allowed as a
// local/dev fallback so the app is never locked out of its own dashboard — the
// dashboard shows a warning banner in that state. Once creds are set, a valid
// session is required.
export default withAuth({
  pages: { signIn: "/admin/login" },
  callbacks: {
    authorized: ({ token }) => {
      if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) return true;
      return Boolean(token);
    },
  },
});

// Note: /admin/login is intentionally excluded so the sign-in page is reachable.
export const config = {
  matcher: ["/admin", "/admin/leads/:path*", "/api/admin/:path*"],
};
