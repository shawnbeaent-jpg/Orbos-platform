"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Logo } from "@/components/Logo";
import { Icon } from "@/components/Icon";

function LoginForm() {
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/admin";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const res = await signIn("credentials", { username, password, redirect: false, callbackUrl });
    if (res?.error) {
      setError("Invalid username or password.");
      setBusy(false);
    } else {
      window.location.href = res?.url || callbackUrl;
    }
  }

  return (
    <form onSubmit={onSubmit} className="card w-full max-w-sm p-7">
      <div className="mb-6 flex justify-center">
        <Logo variant="stacked" theme="dark" />
      </div>
      <h1 className="text-center text-xl font-bold text-midnight">Admin sign in</h1>
      <p className="mt-1 text-center text-sm text-brandslate">Internal lead dashboard</p>

      <label className="mt-6 block text-sm font-semibold text-midnight">
        Username
        <input
          className="mt-1 w-full rounded-lg border border-midnight/15 px-3 py-2.5"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          required
        />
      </label>
      <label className="mt-4 block text-sm font-semibold text-midnight">
        Password
        <input
          type="password"
          className="mt-1 w-full rounded-lg border border-midnight/15 px-3 py-2.5"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
      </label>

      {error && <p className="mt-4 rounded-lg bg-error/10 px-3 py-2 text-sm font-medium text-error">{error}</p>}

      <button type="submit" disabled={busy} className="btn-primary mt-6 w-full">
        {busy ? "Signing in…" : (<>Sign in <Icon name="arrow" className="h-4 w-4" /></>)}
      </button>
    </form>
  );
}

export default function AdminLogin() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-sand px-5 py-16">
      <Suspense fallback={<div className="card w-full max-w-sm p-7 text-center text-brandslate">Loading…</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
