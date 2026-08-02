"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { featuredServices } from "@/lib/services";
import { Icon } from "./Icon";

// Compact hero lead form (spec §8): name, phone, property, service, acreage, timeline.
// Posts to the same /api/leads endpoint; deeper qualification happens on /request-quote.
export function HeroLeadForm() {
  const router = useRouter();
  const [f, setF] = useState({ name: "", phone: "", city: "", service: "", acreage: "", timeline: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (f.name.trim().length < 2 || f.phone.replace(/[^0-9]/g, "").length < 7) {
      setErr("Please add your name and a valid phone number.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: f.name,
          phone: f.phone,
          email: `${f.phone.replace(/[^0-9]/g, "")}@no-email.galandclearing.com`,
          city: f.city,
          services: f.service ? [f.service] : [],
          acreage: f.acreage || undefined,
          timeline: f.timeline || undefined,
          source: "hero",
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Please try again.");
      router.push(`/thank-you?id=${encodeURIComponent(json.id)}`);
    } catch (e2) {
      setErr((e2 as Error).message);
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-white/10 bg-white/95 p-5 shadow-card-lg backdrop-blur sm:p-6">
      <div className="mb-3">
        <p className="font-heading text-lg font-bold text-midnight">Get your free site assessment</p>
        <p className="text-sm text-brandslate">Quick start — we&apos;ll follow up to fill in the details.</p>
      </div>
      <div className="grid gap-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <input className="hinp" placeholder="Full name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} autoComplete="name" aria-label="Full name" />
          <input className="hinp" placeholder="Phone" type="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} autoComplete="tel" aria-label="Phone" />
        </div>
        <input className="hinp" placeholder="Property city (e.g. Marietta)" value={f.city} onChange={(e) => setF({ ...f, city: e.target.value })} aria-label="Property city" />
        <div className="grid gap-3 sm:grid-cols-2">
          <select className="hinp" value={f.service} onChange={(e) => setF({ ...f, service: e.target.value })} aria-label="Service needed">
            <option value="">Service needed…</option>
            {featuredServices.map((s) => (
              <option key={s.slug} value={s.slug}>{s.name}</option>
            ))}
          </select>
          <select className="hinp" value={f.acreage} onChange={(e) => setF({ ...f, acreage: e.target.value })} aria-label="Acreage">
            <option value="">Acreage…</option>
            <option value="under-1">Under 1 acre</option>
            <option value="1-3">1–3 acres</option>
            <option value="3-10">3–10 acres</option>
            <option value="10-plus">10+ acres</option>
            <option value="unsure">Not sure</option>
          </select>
        </div>
        <select className="hinp" value={f.timeline} onChange={(e) => setF({ ...f, timeline: e.target.value })} aria-label="Timeline">
          <option value="">Timeline…</option>
          <option value="asap">As soon as possible</option>
          <option value="1-3-months">1–3 months</option>
          <option value="3-6-months">3–6 months</option>
          <option value="planning">Just planning</option>
        </select>
      </div>
      {err && <p className="mt-3 text-sm font-medium text-error">{err}</p>}
      <button type="submit" disabled={busy} className="btn-primary mt-4 w-full">
        {busy ? "Sending…" : (<>Request Site Assessment <Icon name="arrow" className="h-4 w-4" /></>)}
      </button>
      <p className="mt-2 text-center text-xs text-brandslate">No obligation · Marietta-based · Georgia-wide</p>
      <style>{`
        .hinp { width:100%; border-radius:0.7rem; border:1px solid rgba(11,20,32,0.15); background:#fff; padding:0.65rem 0.85rem; font-size:0.95rem; color:#0B1420; outline:none; }
        .hinp:focus { border-color:#22A06B; box-shadow:0 0 0 3px rgba(34,160,107,0.15); }
      `}</style>
    </form>
  );
}
