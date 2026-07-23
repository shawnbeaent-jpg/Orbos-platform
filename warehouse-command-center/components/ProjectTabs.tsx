'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function ProjectTabs({ projectId }: { projectId: string }) {
  const pathname = usePathname();
  const base = `/projects/${projectId}`;
  const tabs = [
    { href: base, label: 'Overview' },
    { href: `${base}/materials`, label: 'Materials' },
    { href: `${base}/deliveries`, label: 'Deliveries' },
    { href: `${base}/claims`, label: 'Claims' },
    { href: `${base}/readiness`, label: 'Readiness' },
  ];
  return (
    <div className="mb-6 flex gap-1 overflow-x-auto border-b border-steel-200">
      {tabs.map((t) => {
        const active = pathname === t.href;
        return (
          <Link
            key={t.href}
            href={t.href}
            aria-current={active ? 'page' : undefined}
            className={`whitespace-nowrap border-b-2 px-4 py-2 text-sm font-medium ${
              active
                ? 'border-steel-700 text-steel-900'
                : 'border-transparent text-steel-500 hover:border-steel-300 hover:text-steel-700'
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
