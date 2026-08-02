import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { LEAD_STAGES, stageLabel, categoryStyle, effectiveScore } from "@/lib/admin";
import { updateStage, overrideScore, addNote, toggleTask } from "../../actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Lead detail", robots: { index: false, follow: false } };

export default async function LeadDetail({ params }: { params: { id: string } }) {
  let lead;
  try {
    lead = await prisma.lead.findUnique({
      where: { id: params.id },
      include: { notes: { orderBy: { createdAt: "desc" } }, tasks: { orderBy: { createdAt: "desc" } } },
    });
  } catch {
    lead = null;
  }
  if (!lead) notFound();

  const services = safeJson<string[]>(lead.services, []);
  const factors = safeJson<{ label: string; points: number }[]>(lead.scoreFactors, []);
  const uploads = safeJson<string[]>(lead.uploadKeys, []);

  return (
    <div className="min-h-screen bg-sand">
      <div className="container-page py-10">
        <Link href="/admin" className="text-sm font-semibold text-forest hover:underline">← Back to pipeline</Link>

        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-midnight">{lead.name}</h1>
            <p className="text-brandslate">{lead.publicId} · {new Date(lead.createdAt).toLocaleString()}</p>
          </div>
          <span className={`rounded-lg border px-3 py-1.5 text-sm font-bold ${categoryStyle[lead.category]}`}>
            {lead.category.replace("_", " ")} · {effectiveScore(lead)}/100
          </span>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-6">
            {/* Contact + property */}
            <Panel title="Contact & property">
              <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
                <Info label="Email" value={<a className="text-forest underline" href={`mailto:${lead.email}`}>{lead.email}</a>} />
                <Info label="Phone" value={<a className="text-forest underline" href={`tel:${lead.phone}`}>{lead.phone}</a>} />
                <Info label="SMS consent" value={lead.smsConsent ? "Yes" : "No"} />
                <Info label="Source" value={lead.source || "—"} />
                <Info label="Address" value={[lead.address, lead.city, lead.county].filter(Boolean).join(", ") || "—"} />
                <Info label="Property type" value={lead.propertyType || "—"} />
                <Info label="Acreage" value={lead.acreage || "—"} />
                <Info label="Access" value={lead.access || "—"} />
                <Info label="Timeline" value={lead.timeline || "—"} />
                <Info label="Budget" value={lead.budget || "—"} />
                <Info label="Ownership" value={lead.ownership || "—"} />
                <Info label="UTM" value={[lead.utmSource, lead.utmMedium, lead.utmCampaign].filter(Boolean).join(" / ") || "—"} />
              </dl>
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase text-brandslate">Services requested</p>
                <p className="mt-1 text-sm text-midnight">{services.join(", ") || "—"}</p>
              </div>
              {lead.siteConditions && (
                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase text-brandslate">Site conditions</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-midnight">{lead.siteConditions}</p>
                </div>
              )}
              {uploads.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase text-brandslate">Files ({uploads.length})</p>
                  <ul className="mt-1 text-sm text-midnight">{uploads.map((u, i) => <li key={i}>{u}</li>)}</ul>
                </div>
              )}
            </Panel>

            {/* Score breakdown */}
            <Panel title="Score breakdown">
              <ul className="space-y-1.5">
                {factors.map((f, i) => (
                  <li key={i} className="flex items-center justify-between text-sm">
                    <span className="text-brandslate">{f.label}</span>
                    <span className="font-semibold text-midnight">+{f.points}</span>
                  </li>
                ))}
              </ul>
              <form action={overrideScore} className="mt-4 flex items-end gap-3 border-t border-midnight/10 pt-4">
                <input type="hidden" name="id" value={lead.id} />
                <label className="text-sm">
                  <span className="mb-1 block font-semibold text-midnight">Manual override (0–100)</span>
                  <input name="scoreOverride" type="number" min={0} max={100} defaultValue={lead.scoreOverride ?? ""} placeholder={String(lead.score)} className="w-32 rounded-lg border border-midnight/15 px-3 py-2" />
                </label>
                <button className="btn-ghost !py-2">Save</button>
              </form>
            </Panel>

            {/* Notes */}
            <Panel title="Notes">
              <form action={addNote} className="flex gap-2">
                <input type="hidden" name="id" value={lead.id} />
                <input name="body" placeholder="Add a note…" className="flex-1 rounded-lg border border-midnight/15 px-3 py-2" />
                <button className="btn-primary !py-2">Add</button>
              </form>
              <ul className="mt-4 space-y-3">
                {lead.notes.length === 0 && <li className="text-sm text-brandslate">No notes yet.</li>}
                {lead.notes.map((n) => (
                  <li key={n.id} className="rounded-lg bg-sand/70 p-3 text-sm">
                    <p className="text-midnight">{n.body}</p>
                    <p className="mt-1 text-xs text-brandslate">{n.author} · {new Date(n.createdAt).toLocaleString()}</p>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>

          {/* Sidebar: stage + tasks */}
          <div className="space-y-6">
            <Panel title="Pipeline stage">
              <form action={updateStage} className="space-y-3">
                <input type="hidden" name="id" value={lead.id} />
                <select name="stage" defaultValue={lead.stage} className="w-full rounded-lg border border-midnight/15 px-3 py-2.5">
                  {LEAD_STAGES.map((s) => (
                    <option key={s} value={s}>{stageLabel[s]}</option>
                  ))}
                </select>
                <button className="btn-primary w-full !py-2.5">Update stage</button>
              </form>
            </Panel>

            <Panel title="Tasks">
              <ul className="space-y-2">
                {lead.tasks.length === 0 && <li className="text-sm text-brandslate">No tasks.</li>}
                {lead.tasks.map((t) => (
                  <li key={t.id} className="flex items-center gap-3">
                    <form action={toggleTask}>
                      <input type="hidden" name="taskId" value={t.id} />
                      <input type="hidden" name="leadId" value={lead.id} />
                      <input type="hidden" name="done" value={String(t.done)} />
                      <button className={`h-5 w-5 rounded border-2 ${t.done ? "border-emerald bg-emerald text-white" : "border-midnight/30"}`} aria-label="Toggle task">
                        {t.done ? "✓" : ""}
                      </button>
                    </form>
                    <span className={`text-sm ${t.done ? "text-brandslate line-through" : "text-midnight"}`}>{t.title}</span>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>
        </div>
      </div>
    </div>
  );
}

function safeJson<T>(s: string, fallback: T): T {
  try {
    return JSON.parse(s) as T;
  } catch {
    return fallback;
  }
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="card p-6">
      <h2 className="mb-4 text-lg font-bold text-midnight">{title}</h2>
      {children}
    </section>
  );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase text-brandslate">{label}</dt>
      <dd className="text-sm text-midnight">{value}</dd>
    </div>
  );
}
