import type { Metadata } from "next";
import { site, processSteps } from "@/lib/site";
import { PageHero } from "@/components/PageHero";
import { LeadForm } from "@/components/LeadForm";
import { Icon } from "@/components/Icon";

export const metadata: Metadata = {
  title: "Request a Site Assessment",
  description:
    "Request a free site assessment from GA Land Clearing. Tell us about your property and get a clear, written scope and price — no obligation.",
  alternates: { canonical: "/request-quote" },
};

export default function RequestQuote() {
  return (
    <>
      <PageHero
        eyebrow="Request a Quote"
        title="Get a free site assessment"
        subtitle="Answer a few questions about your property and project. We'll follow up with a clear, written scope and price — no obligation."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Request a Quote" }]}
        showCtas={false}
      />
      <div className="container-page grid gap-12 py-16 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <aside className="space-y-8 lg:sticky lg:top-24">
          <div>
            <h2 className="text-xl font-bold text-midnight">What happens next</h2>
            <ol className="mt-5 space-y-5">
              {processSteps.map((p) => (
                <li key={p.n} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald text-sm font-bold text-white">{p.n}</span>
                  <div>
                    <p className="font-semibold text-midnight">{p.title}</p>
                    <p className="text-sm text-brandslate">{p.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-2xl bg-midnight p-6 text-sand">
            <p className="font-heading font-bold">Prefer to talk?</p>
            <p className="mt-1 text-sm text-sand/75">We&apos;re happy to answer questions before you submit anything.</p>
            <a href={`tel:${site.phoneE164}`} className="btn-primary mt-4 w-full">
              <Icon name="phone" className="h-4 w-4" /> Call {site.phoneDisplay}
            </a>
            <a href={`sms:${site.smsE164}`} className="btn-outline mt-3 w-full !text-sand">
              <Icon name="message" className="h-4 w-4" /> Text us
            </a>
          </div>
        </aside>
        <div>
          <LeadForm source="quote" />
        </div>
      </div>
    </>
  );
}
