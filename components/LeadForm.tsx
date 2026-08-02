"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { services } from "@/lib/services";
import { Icon } from "./Icon";

type FormState = {
  name: string;
  email: string;
  phone: string;
  smsConsent: boolean;
  address: string;
  city: string;
  county: string;
  propertyType: string;
  acreage: string;
  access: string;
  services: string[];
  siteConditions: string;
  uploadNames: string[];
  timeline: string;
  budget: string;
  ownership: string;
  company_website: string; // honeypot
};

const initial: FormState = {
  name: "",
  email: "",
  phone: "",
  smsConsent: false,
  address: "",
  city: "",
  county: "",
  propertyType: "",
  acreage: "",
  access: "",
  services: [],
  siteConditions: "",
  uploadNames: [],
  timeline: "",
  budget: "",
  ownership: "",
  company_website: "",
};

const STEPS = ["Contact", "Property", "Services", "Conditions", "Uploads", "Qualification", "Review"];

const propertyTypeOpts = [
  { v: "residential", l: "Residential" },
  { v: "commercial", l: "Commercial" },
  { v: "agricultural", l: "Agricultural" },
  { v: "municipal", l: "Municipal / Public" },
];
const acreageOpts = [
  { v: "under-1", l: "Under 1 acre" },
  { v: "1-3", l: "1–3 acres" },
  { v: "3-10", l: "3–10 acres" },
  { v: "10-plus", l: "10+ acres" },
  { v: "unsure", l: "Not sure" },
];
const timelineOpts = [
  { v: "asap", l: "As soon as possible" },
  { v: "1-3-months", l: "1–3 months" },
  { v: "3-6-months", l: "3–6 months" },
  { v: "planning", l: "Just planning" },
  { v: "unsure", l: "Not sure yet" },
];
const budgetOpts = [
  { v: "under-5k", l: "Under $5k" },
  { v: "5k-15k", l: "$5k–$15k" },
  { v: "15k-50k", l: "$15k–$50k" },
  { v: "50k-plus", l: "$50k+" },
  { v: "unsure", l: "Not sure" },
];
const ownershipOpts = [
  { v: "owner", l: "I own the property" },
  { v: "under-contract", l: "Under contract to buy" },
  { v: "agent-representative", l: "Agent / representative" },
  { v: "other", l: "Other" },
];

export function LeadForm({
  source = "quote",
  presetServices = [],
}: {
  source?: string;
  presetServices?: string[];
}) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>({ ...initial, services: presetServices });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [utm, setUtm] = useState<Record<string, string>>({});

  // Capture UTM + referrer once on mount (spec §10 attribution).
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setUtm({
      utmSource: p.get("utm_source") || "",
      utmMedium: p.get("utm_medium") || "",
      utmCampaign: p.get("utm_campaign") || "",
      referrer: document.referrer || "",
    });
  }, []);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const toggleService = (slug: string) =>
    setForm((f) => ({
      ...f,
      services: f.services.includes(slug)
        ? f.services.filter((s) => s !== slug)
        : [...f.services, slug],
    }));

  function validateStep(s: number): boolean {
    const e: Record<string, string> = {};
    if (s === 0) {
      if (form.name.trim().length < 2) e.name = "Please enter your name";
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) e.email = "Enter a valid email";
      if (form.phone.replace(/[^0-9]/g, "").length < 7) e.phone = "Enter a valid phone number";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() {
    if (validateStep(step)) setStep((s) => Math.min(STEPS.length - 1, s + 1));
  }
  function back() {
    setSubmitError(null);
    setStep((s) => Math.max(0, s - 1));
  }

  async function submit() {
    if (!validateStep(0)) {
      setStep(0);
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          smsConsent: form.smsConsent,
          address: form.address,
          city: form.city,
          county: form.county,
          propertyType: form.propertyType || undefined,
          acreage: form.acreage || undefined,
          access: form.access,
          services: form.services,
          siteConditions: form.siteConditions,
          uploadKeys: form.uploadNames,
          timeline: form.timeline || undefined,
          budget: form.budget || undefined,
          ownership: form.ownership || undefined,
          source,
          ...utm,
          company_website: form.company_website,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.error || "Something went wrong. Please try again or call us.");
      }
      router.push(`/thank-you?id=${encodeURIComponent(json.id)}`);
    } catch (err) {
      setSubmitError((err as Error).message);
      setSubmitting(false);
    }
  }

  const pct = useMemo(() => Math.round(((step + 1) / STEPS.length) * 100), [step]);

  return (
    <div className="card overflow-hidden">
      {/* Progress */}
      <div className="border-b border-midnight/8 bg-sand/60 px-6 py-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-midnight">
            Step {step + 1} of {STEPS.length}
            <span className="ml-2 font-normal text-brandslate">· {STEPS[step]}</span>
          </span>
          <span className="text-brandslate">{pct}%</span>
        </div>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-midnight/10">
          <div className="h-full rounded-full bg-emerald transition-all duration-300" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="px-6 py-7">
        {/* Honeypot (visually hidden) */}
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
          className="absolute -left-[9999px] h-0 w-0"
          value={form.company_website}
          onChange={(e) => set("company_website", e.target.value)}
        />

        {step === 0 && (
          <Fieldset legend="How can we reach you?">
            <Field label="Full name" error={errors.name} required>
              <input className="inp" value={form.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Email" error={errors.email} required>
                <input className="inp" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" />
              </Field>
              <Field label="Phone" error={errors.phone} required>
                <input className="inp" type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} autoComplete="tel" />
              </Field>
            </div>
            <label className="mt-2 flex items-start gap-3 text-sm text-brandslate">
              <input type="checkbox" className="mt-1 h-4 w-4 accent-emerald" checked={form.smsConsent} onChange={(e) => set("smsConsent", e.target.checked)} />
              <span>
                Text me updates about my request. Message/data rates may apply; reply STOP to opt out. (Optional — we
                never text without this consent.)
              </span>
            </label>
          </Fieldset>
        )}

        {step === 1 && (
          <Fieldset legend="Tell us about the property">
            <Field label="Property address">
              <input className="inp" value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="Street address" autoComplete="street-address" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="City">
                <input className="inp" value={form.city} onChange={(e) => set("city", e.target.value)} />
              </Field>
              <Field label="County">
                <input className="inp" value={form.county} onChange={(e) => set("county", e.target.value)} placeholder="e.g. Cobb" />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Property type">
                <ChipGroup options={propertyTypeOpts} value={form.propertyType} onChange={(v) => set("propertyType", v)} />
              </Field>
              <Field label="Approximate acreage">
                <ChipGroup options={acreageOpts} value={form.acreage} onChange={(v) => set("acreage", v)} />
              </Field>
            </div>
            <Field label="Site access (gates, terrain, equipment access)">
              <input className="inp" value={form.access} onChange={(e) => set("access", e.target.value)} placeholder="e.g. Gated, steep driveway, wet in back" />
            </Field>
          </Fieldset>
        )}

        {step === 2 && (
          <Fieldset legend="What do you need done?" hint="Select all that apply.">
            <div className="grid gap-3 sm:grid-cols-2">
              {services.map((s) => {
                const on = form.services.includes(s.slug);
                return (
                  <button
                    type="button"
                    key={s.slug}
                    onClick={() => toggleService(s.slug)}
                    aria-pressed={on}
                    className={`flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-all ${
                      on ? "border-emerald bg-emerald/5" : "border-midnight/10 hover:border-midnight/25"
                    }`}
                  >
                    <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 ${on ? "border-emerald bg-emerald text-white" : "border-midnight/25"}`}>
                      {on && <Icon name="check" className="h-3.5 w-3.5" />}
                    </span>
                    <span>
                      <span className="block font-semibold text-midnight">{s.name}</span>
                      <span className="block text-xs text-brandslate">{s.short}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </Fieldset>
        )}

        {step === 3 && (
          <Fieldset legend="Site conditions" hint="The more detail, the more accurate your scope.">
            <Field label="Describe the site">
              <textarea
                className="inp min-h-[140px] resize-y"
                value={form.siteConditions}
                onChange={(e) => set("siteConditions", e.target.value)}
                placeholder="Vegetation density, tree sizes, slopes, wet areas, structures nearby, what you want to keep, and your end goal for the land."
              />
            </Field>
          </Fieldset>
        )}

        {step === 4 && (
          <Fieldset legend="Photos, plans & documents" hint="Optional, but photos speed up your quote.">
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-midnight/20 bg-sand/50 px-6 py-10 text-center hover:border-emerald">
              <Icon name="upload" className="h-8 w-8 text-forest" />
              <span className="font-semibold text-midnight">Add photos or site plans</span>
              <span className="text-xs text-brandslate">JPG, PNG, PDF · up to 20 files</span>
              <input
                type="file"
                multiple
                className="hidden"
                accept="image/*,.pdf"
                onChange={(e) => {
                  const names = Array.from(e.target.files ?? []).slice(0, 20).map((f) => f.name);
                  set("uploadNames", names);
                }}
              />
            </label>
            {form.uploadNames.length > 0 && (
              <ul className="mt-4 space-y-1.5 text-sm text-brandslate">
                {form.uploadNames.map((n, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Icon name="check" className="h-4 w-4 text-emerald" /> {n}
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-3 text-xs text-brandslate">
              File references are attached to your request. Secure file storage is enabled once cloud storage is
              configured for the site.
            </p>
          </Fieldset>
        )}

        {step === 5 && (
          <Fieldset legend="A few details to prioritize your project">
            <Field label="Timeline">
              <ChipGroup options={timelineOpts} value={form.timeline} onChange={(v) => set("timeline", v)} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Budget range">
                <ChipGroup options={budgetOpts} value={form.budget} onChange={(v) => set("budget", v)} />
              </Field>
              <Field label="Your relationship to the property">
                <ChipGroup options={ownershipOpts} value={form.ownership} onChange={(v) => set("ownership", v)} />
              </Field>
            </div>
          </Fieldset>
        )}

        {step === 6 && (
          <Fieldset legend="Review & submit">
            <dl className="divide-y divide-midnight/8 rounded-xl border border-midnight/10">
              <Row label="Name" value={form.name} />
              <Row label="Contact" value={`${form.email} · ${form.phone}`} />
              <Row label="Property" value={[form.address, form.city, form.county].filter(Boolean).join(", ") || "—"} />
              <Row label="Type / acreage" value={[labelFor(propertyTypeOpts, form.propertyType), labelFor(acreageOpts, form.acreage)].filter(Boolean).join(" · ") || "—"} />
              <Row label="Services" value={form.services.map((s) => services.find((x) => x.slug === s)?.name).filter(Boolean).join(", ") || "—"} />
              <Row label="Timeline / budget" value={[labelFor(timelineOpts, form.timeline), labelFor(budgetOpts, form.budget)].filter(Boolean).join(" · ") || "—"} />
              <Row label="Files" value={form.uploadNames.length ? `${form.uploadNames.length} attached` : "None"} />
            </dl>
            {submitError && (
              <p className="mt-4 rounded-lg bg-error/10 px-4 py-3 text-sm font-medium text-error">{submitError}</p>
            )}
            <p className="mt-4 text-xs text-brandslate">
              By submitting, you agree to be contacted about your request. We never sell your information. See our{" "}
              <a href="/legal/privacy" className="underline">Privacy Policy</a>.
            </p>
          </Fieldset>
        )}
      </div>

      {/* Nav */}
      <div className="flex items-center justify-between gap-3 border-t border-midnight/8 bg-sand/40 px-6 py-4">
        <button type="button" onClick={back} disabled={step === 0} className="btn-ghost !py-2.5 disabled:opacity-40">
          Back
        </button>
        {step < STEPS.length - 1 ? (
          <button type="button" onClick={next} className="btn-primary !py-2.5">
            Continue <Icon name="arrow" className="h-4 w-4" />
          </button>
        ) : (
          <button type="button" onClick={submit} disabled={submitting} className="btn-primary !py-2.5">
            {submitting ? "Submitting…" : "Submit request"}
            {!submitting && <Icon name="check" className="h-4 w-4" />}
          </button>
        )}
      </div>

      <style>{`
        .inp {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid rgba(11,20,32,0.15);
          background: #fff;
          padding: 0.7rem 0.9rem;
          font-size: 1rem;
          color: #0B1420;
          outline: none;
        }
        .inp:focus { border-color: #22A06B; box-shadow: 0 0 0 3px rgba(34,160,107,0.15); }
        .inp::placeholder { color: #98a2ad; }
      `}</style>
    </div>
  );
}

function labelFor(opts: { v: string; l: string }[], v: string) {
  return opts.find((o) => o.v === v)?.l ?? "";
}

function Fieldset({ legend, hint, children }: { legend: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="animate-fade-up">
      <h2 className="font-heading text-xl font-bold text-midnight">{legend}</h2>
      {hint && <p className="mt-1 text-sm text-brandslate">{hint}</p>}
      <div className="mt-5 space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, error, required, children }: { label: string; error?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-midnight">
        {label} {required && <span className="text-error">*</span>}
      </span>
      {children}
      {error && <span className="mt-1 block text-sm text-error">{error}</span>}
    </label>
  );
}

function ChipGroup({ options, value, onChange }: { options: { v: string; l: string }[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          type="button"
          key={o.v}
          onClick={() => onChange(value === o.v ? "" : o.v)}
          aria-pressed={value === o.v}
          className={`rounded-full border-2 px-4 py-2 text-sm font-medium transition-all ${
            value === o.v ? "border-emerald bg-emerald text-white" : "border-midnight/15 text-midnight hover:border-midnight/35"
          }`}
        >
          {o.l}
        </button>
      ))}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 px-4 py-3 text-sm">
      <dt className="font-semibold text-midnight">{label}</dt>
      <dd className="text-right text-brandslate">{value}</dd>
    </div>
  );
}
