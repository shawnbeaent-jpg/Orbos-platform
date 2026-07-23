import Link from 'next/link';
import { requireSession } from '@/lib/auth/session';
import { ROLE_LABELS } from '@/lib/auth/rbac';
import { AppNav } from '@/components/AppNav';
import { SignOutButton } from '@/components/SignOutButton';
import { ServiceWorkerRegister } from '@/components/ServiceWorkerRegister';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession();

  return (
    <div className="min-h-screen">
      <ServiceWorkerRegister />
      <header className="sticky top-0 z-20 bg-steel-800 text-white shadow">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-base font-bold tracking-tight">Warehouse Command Center</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="hidden text-right text-xs leading-tight sm:block">
              <p className="font-semibold">{session.fullName}</p>
              <p className="text-steel-200">{ROLE_LABELS[session.role]}</p>
            </div>
            <SignOutButton />
          </div>
        </div>
        <div className="mx-auto max-w-7xl border-t border-steel-700">
          <AppNav role={session.role} />
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  );
}
