import Link from "next/link";
import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { LeadForm } from "@/components/LeadForm";
import { Icon } from "@/components/Icon";

export const metadata: Metadata = {
  title: "Commercial, Builder & Developer Land Services",
  description:
    "Development prep, lot clearing, access roads, right-of-way clearing, and grading coordination for builders, developers, GCs, and municipal projects across Georgia. Invite GA Land Clearing to bid.",
  alternates: { canonical: "/commercial" },
};

const segments = [
  { icon: "blueprint", title: "Builders & Developers", body: "Lot and pad clearing, grading coordination, and access roads with written scopes that keep your build schedule on track.", anchor: "builder" },
  { icon: "building", title: "General Contractors", body: "Reliable site-prep subcontracting with documentation and sequencing that fits your project workflow.", anchor: "bid" },
  { icon: "chart", title: "Realtors & Investors", body: "Make raw or neglected parcels show-ready and build-ready to move listings and protect value.", anchor: "realtor" },
  { icon: "users", title: "Property Managers & HOAs", body: "Retention pond maintenance, right-of-way and common-area clearing on documented, recurring schedules.", anchor: "bid" },
];

export default function Commercial() {
  return (
    <>
      <PageHero
        eyebrow="Commercial & Development"
        title="Bid-ready land clearing and site prep for commercial projects"
        subtitle="Development prep, lot clearing, access roads, right-of-way, and grading coordination — with the written scopes and documentation larger projects require."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Commercial" }]}
      />

      <section className="section">
        <div className="container-page">
          <h2 className="text-center text-2xl font-bold text-midnight">Who we partner with</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {segments.map((s) => (
              <a key={s.title} href={`#${s.anchor}`} className="card p-6 transition-shadow hover:shadow-card-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest/10 text-forest">
                  <Icon name={s.icon} className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-bold text-midnight">{s.title}</h3>
                <p className="mt-2 text-sm text-brandslate">{s.body}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-forest text-sand">
        <div className="container-page grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold">Capabilities</h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {["Development site prep", "Lot & pad clearing", "Access roads & entrances", "Right-of-way clearing", "Grading coordination", "Excavation coordination", "Retention pond maintenance", "Debris hauling & disposal"].map((c) => (
                <li key={c} className="inline-flex items-center gap-2 text-sm text-sand/90">
                  <Icon name="check" className="h-4 w-4 text-gold" /> {c}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-3xl font-bold">Why GCs and developers work with us</h2>
            <ul className="mt-6 space-y-3">
              {[
                ["Single point of coordination", "One contact managing clearing, grading, and access sequencing."],
                ["Bid-ready documentation", "Written scopes and records built for commercial and municipal review."],
                ["Schedule-aware", "Site prep sequenced to your construction milestones."],
              ].map(([t, b]) => (
                <li key={t} className="flex gap-3">
                  <Icon name="check" className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                  <div>
                    <p className="font-semibold">{t}</p>
                    <p className="text-sm text-sand/75">{b}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Bid request */}
      <section id="bid" className="section scroll-mt-24">
        <div className="container-page grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <span className="eyebrow">Commercial Bid Request</span>
            <h2 className="mt-3 text-3xl font-bold text-midnight">Invite us to bid</h2>
            <p className="mt-4 text-brandslate">
              Send us the project scope, plans, and requirements. We&apos;ll respond with a written scope and pricing
              built for your review process. Attach site plans or specs in the upload step.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-brandslate">
              <li className="flex gap-2"><Icon name="check" className="h-4 w-4 text-emerald" /> Written, bid-ready scope</li>
              <li className="flex gap-2"><Icon name="check" className="h-4 w-4 text-emerald" /> Documentation for review</li>
              <li className="flex gap-2"><Icon name="check" className="h-4 w-4 text-emerald" /> Schedule coordination</li>
            </ul>
          </div>
          <LeadForm source="commercial-bid" />
        </div>
      </section>

      {/* Builder partnership */}
      <section id="builder" className="section scroll-mt-24 bg-white">
        <div className="container-page grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <span className="eyebrow">Builder Partnership</span>
            <h2 className="mt-3 text-3xl font-bold text-midnight">Become a builder partner</h2>
            <p className="mt-4 text-brandslate">
              Building multiple homes or developing lots? Set up an ongoing partnership for repeatable lot clearing and
              site prep with consistent scopes, communication, and scheduling across your projects.
            </p>
          </div>
          <LeadForm source="builder-partnership" presetServices={["site-development", "land-clearing", "grading-leveling"]} />
        </div>
      </section>

      {/* Realtor / investor */}
      <section id="realtor" className="section scroll-mt-24">
        <div className="container-page grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <span className="eyebrow">Realtors & Investors</span>
            <h2 className="mt-3 text-3xl font-bold text-midnight">Make parcels show-ready</h2>
            <p className="mt-4 text-brandslate">
              Reclaim overgrown or neglected parcels so they show well and build well. Great for listings, flips, and
              raw-land investments. Tell us about the property and timeline.
            </p>
            <p className="mt-4 text-sm text-brandslate">
              Not sure which service you need? <Link href="/services" className="font-semibold text-forest underline">Browse services</Link>.
            </p>
          </div>
          <LeadForm source="realtor-investor" presetServices={["brush-clearing", "land-clearing"]} />
        </div>
      </section>
    </>
  );
}
