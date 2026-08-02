"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button onClick={() => signOut({ callbackUrl: "/" })} className="btn-ghost !py-2.5" type="button">
      Sign out
    </button>
  );
}
