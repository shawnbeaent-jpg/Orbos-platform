'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { StatusBadge } from '@/components/ui';
import { projectStatusView } from '@/lib/status';
import { formatDate } from '@/lib/format';
import type { ProjectRow } from '@/lib/supabase/database.types';

type Row = ProjectRow & { preapproval_ready: boolean; required_material_lines: number };

export function ProjectTable({ projects }: { projects: Row[] }) {
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return projects;
    return projects.filter((p) =>
      [p.project_number, p.client_name, p.project_address, p.remodel_type]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(term)),
    );
  }, [projects, q]);

  return (
    <div>
      <label htmlFor="project-search" className="sr-only">
        Search projects
      </label>
      <input
        id="project-search"
        type="search"
        placeholder="Search by project #, client, address…"
        className="input mb-4 max-w-md"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      {filtered.length === 0 ? (
        <p className="card p-6 text-center text-sm text-steel-500">No projects match “{q}”.</p>
      ) : (
        <div className="card overflow-x-auto">
          <table className="min-w-full divide-y divide-steel-200 text-sm">
            <thead className="bg-steel-50 text-left text-xs uppercase tracking-wide text-steel-500">
              <tr>
                <th className="px-4 py-3">Project</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Planned Start</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Readiness</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-steel-100">
              {filtered.map((p) => {
                const view = projectStatusView(p.status);
                return (
                  <tr key={p.id} className="hover:bg-steel-50">
                    <td className="px-4 py-3">
                      <Link href={`/projects/${p.id}`} className="font-semibold text-steel-800 hover:underline">
                        {p.project_number}
                      </Link>
                      <div className="text-xs text-steel-500">{p.remodel_type.replace(/_/g, ' ')}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div>{p.client_name}</div>
                      <div className="text-xs text-steel-500">{p.project_address}</div>
                    </td>
                    <td className="px-4 py-3">{formatDate(p.planned_start_date)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge kind={view.kind} label={view.label} />
                    </td>
                    <td className="px-4 py-3">
                      {p.readiness_approved ? (
                        <StatusBadge kind="ready" label="Ready to Start" />
                      ) : p.preapproval_ready ? (
                        <StatusBadge kind="awaiting" label="Eligible — awaiting approval" />
                      ) : (
                        <Link href={`/projects/${p.id}/readiness`} className="text-status-blocked hover:underline">
                          Blocked — view why
                        </Link>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
