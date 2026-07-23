'use client';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

export function SignOutButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function signOut() {
    startTransition(async () => {
      await getSupabaseBrowserClient().auth.signOut();
      router.replace('/login');
      router.refresh();
    });
  }

  return (
    <button type="button" onClick={signOut} disabled={pending} className="btn-secondary text-sm">
      {pending ? 'Signing out…' : 'Sign out'}
    </button>
  );
}
