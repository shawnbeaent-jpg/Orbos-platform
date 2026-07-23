'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { AppRole } from '@/lib/supabase/database.types';

interface NavItem {
  href: string;
  label: string;
  /** When set, only these roles see the item. UI-only; RLS remains the real boundary. */
  roles?: AppRole[];
}

const NAV: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/projects', label: 'Projects' },
  { href: '/receiving/new', label: 'Receive', roles: ['admin', 'warehouse_manager', 'receiver'] },
  { href: '/deliveries', label: 'Deliveries' },
  { href: '/requests', label: 'Requests' },
  { href: '/claims', label: 'Claims' },
  { href: '/inventory', label: 'Inventory' },
  { href: '/reports/daily', label: 'Daily Report' },
  { href: '/reports/weekly', label: 'Weekly Report' },
  { href: '/audit', label: 'Audit' },
  { href: '/settings/users', label: 'Users', roles: ['admin'] },
  { href: '/settings/readiness', label: 'Readiness Rules', roles: ['admin', 'warehouse_manager'] },
];

export function AppNav({ role }: { role: AppRole }) {
  const pathname = usePathname();
  const items = NAV.filter((i) => !i.roles || i.roles.includes(role));
  return (
    <nav aria-label="Primary" className="flex gap-1 overflow-x-auto p-2">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={`whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition ${
              active ? 'bg-steel-700 text-white' : 'text-steel-200 hover:bg-steel-700/40 hover:text-white'
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
