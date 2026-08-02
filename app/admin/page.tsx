import Link from "next/link";
import type { Metadata } from "next";
import { getAdminData, LEAD_STAGES, stageLabel, categoryStyle, effectiveScore } from "@/lib/admin";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin — Lead Pipeline", robots: { index: false, follow: false } };

export default async function AdminDashboard() {
  const data = await getAdminData();
  const byStage = LEAD_STAGES.map((stage) => ({
    stage,
    leads: data.leads.filter((l) => l.stage === stage),
  }));

  return (
    <div className="min-h-screen bg-sand">
      <div className="container-page py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-midnight">Lead Pipeline</h1>
            <p className="text-brandslate">GA Land Clearing — internal dashboard</p>
          </div>
          <div className="flex gap-3">
            <a href="/api/admin/leads/export" className="btn-ghost !py-2.5">Export CSV</a>
            <Link href="/request-quote" className="btn-primary !py-2.5">New test lead</Link>
          </div>
        </div>

        {/* Auth reminder — real auth is required before production (escalation item). */}
        <div className="mt-6 rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-midnight">
          <strong>Access control not yet enabled.</strong> This dashboard is unauthenticated. Add authentication
          (Auth.js is already a dependency) and restrict <code>/admin</code> before exposing it publicly.
        </div>

        {!data.ok && (
          <div className="mt-4 rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
            Database not reachable ({data.reason}). Configure <code>DATABASE_URL</code> and run migrations to see live
            leads. The dashboard renders empty until then.
          </div>
        )}

        {/* Metrics */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Metric label="Total leads" value={data.metrics.total} />
          <Metric label="Priority" value={data.metrics.priority} accent="emerald" />
          <Metric label="New (7 days)" value={data.metrics.newThisWeek} />
          <Metric label="Won / Completed" value={data.metrics.won} />
          <Metric label="Conversion" value={`${data.metrics.conversionRate}%`} />
        </div>

        {/* Kanban */}
        <div className="mt-8 overflow-x-auto pb-4">
          <div className="flex min-w-max gap-4">
            {byStage.map(({ stage, leads }) => (
              <div key={stage} className="w-72 shrink-0">
                <div className="mb-3 flex items-center justify-between px-1">
                  <h2 className="text-sm font-bold uppercase tracking-wide text-midnight">{stageLabel[stage]}</h2>
                  <span className="rounded-full bg-midnight/10 px-2 py-0.5 text-xs font-semibold text-midnight">{leads.length}</span>
                </div>
                <div className="flex flex-col gap-3">
                  {leads.length === 0 && (
                    <div className="rounded-xl border border-dashed border-midnight/15 px-4 py-6 text-center text-xs text-brandslate">
                      No leads
                    </div>
                  )}
                  {leads.map((l) => (
                    <Link
                      key={l.id}
                      href={`/admin/leads/${l.id}`}
                      className="card block p-4 transition-shadow hover:shadow-card-lg"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-midnight">{l.name}</p>
                        <span className="rounded-md bg-midnight px-2 py-0.5 text-xs font-bold text-sand">{effectiveScore(l)}</span>
                      </div>
                      <p className="mt-0.5 text-xs text-brandslate">{l.city || "—"} · {l.publicId}</p>
                      <span className={`mt-2 inline-block rounded-md border px-2 py-0.5 text-[11px] font-semibold ${categoryStyle[l.category]}`}>
                        {l.category.replace("_", " ")}
                      </span>
                      <p className="mt-2 text-xs text-brandslate">
                        {(() => {
                          try {
                            const s = JSON.parse(l.services) as string[];
                            return s.slice(0, 3).join(", ") || "No services listed";
                          } catch {
                            return "—";
                          }
                        })()}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value, accent }: { label: string; value: number | string; accent?: "emerald" }) {
  return (
    <div className="card p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-brandslate">{label}</p>
      <p className={`mt-1 text-3xl font-bold ${accent === "emerald" ? "text-emerald" : "text-midnight"}`}>{value}</p>
    </div>
  );
}
