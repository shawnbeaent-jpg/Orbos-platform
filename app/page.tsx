import Link from "next/link";
import type { Metadata } from "next";
import { site, audiences, processSteps, differentiators } from "@/lib/site";
import { featuredServices } from "@/lib/services";
import { Icon } from "@/components/Icon";
import { HeroLeadForm } from "@/components/HeroLeadForm";
import { BeforeAfter } from "@/components/BeforeAfter";
import { FAQAccordion } from "@/components/FAQAccordion";
import { ServiceAreaMap } from "@/components/ServiceAreaMap";
import { CTABand } from "@/components/CTABand";

export const metadata: Metadata = {
  title: "Professional Land Clearing Across Georgia",
  description: site.description,
};

const trustPoints = ["Marietta-based", "Georgia-wide service", "Residential & commercial", "Clear written scopes", "Fast response"];

const homeFaqs = [
  { q: "How much does land clearing cost?", a: "It depends on acreage, tree density, terrain, access, and how debris is handled. Rather than post a misleading flat rate, we review your property and give you a clear written scope and price. Most quotes are fast once we understand the site." },
  { q: "What areas do you serve?", a: `We're headquartered in Marietta and serve projects statewide across Georgia, with fast response throughout Metro Atlanta — Cobb, Fulton, Gwinnett, Cherokee, Paulding, Bartow, and beyond.` },
  { q: "Do you handle both residential and commercial work?", a: "Yes. We clear single overgrown lots for homeowners and coordinate multi-acre development prep, right-of-way clearing, and commercial site work — with documentation suited to each." },
  { q: "How does GA Land Clearing operate?", a: site.modelDisclosure },
  { q: "Do I need a permit to clear my land?", a: "Some jurisdictions require land-disturbance or tree-removal permits, especially near streams or on larger sites. We'll flag what we notice, but permitting is set by your local authority — always confirm requirements with them or your engineer." },
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-hero-grade">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 15%, #22A06B 0, transparent 40%), radial-gradient(circle at 90% 80%, #D8A94A 0, transparent 45%)",
          }}
        />
        {/* Contour lines */}
        <svg aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-40 w-full text-emerald/20" preserveAspectRatio="none" viewBox="0 0 1440 160">
          <path d="M0 120 Q360 60 720 100 T1440 90" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M0 140 Q360 90 720 130 T1440 120" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.6" />
        </svg>

        <div className="container-page relative grid gap-12 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-24">
          <div className="animate-fade-up">
            <span className="eyebrow text-emerald">{site.positioning}</span>
            <h1 className="mt-4 text-balance text-4xl font-bold leading-[1.05] text-sand sm:text-5xl lg:text-6xl">
              Professional Land Clearing Across Georgia
            </h1>
            <p className="mt-5 max-w-xl text-lg text-sand/80">
              Full-service brush clearing, stump removal, grading, forestry mulching, and site preparation for
              residential and commercial projects. From overgrown to build-ready.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/request-quote" className="btn-primary">
                Request Site Assessment <Icon name="arrow" className="h-4 w-4" />
              </Link>
              <a href={`tel:${site.phoneE164}`} className="btn-outline">
                <Icon name="phone" className="h-4 w-4" /> Call / Text Now
              </a>
            </div>
            <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-3">
              {trustPoints.map((t) => (
                <li key={t} className="inline-flex items-center gap-2 text-sm font-medium text-sand/85">
                  <Icon name="check" className="h-4 w-4 text-emerald" /> {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="animate-fade-up lg:pl-4">
            <HeroLeadForm />
          </div>
        </div>
      </section>

      {/* AUDIENCE SEGMENTS */}
      <section className="section">
        <div className="container-page">
          <SectionHead eyebrow="Who we serve" title="Built for every kind of Georgia project" />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {audiences.map((a) => (
              <div key={a.key} className="card p-6 transition-shadow hover:shadow-card-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest/10 text-forest">
                  <Icon name={a.icon} className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-midnight">{a.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brandslate">{a.blurb}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES OVERVIEW */}
      <section className="section bg-white">
        <div className="container-page">
          <SectionHead
            eyebrow="Services"
            title="One coordinator for the full scope of land work"
            desc="From a single overgrown lot to multi-acre development prep — matched to the right crews and equipment."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featuredServices.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="group card p-6 transition-all hover:-translate-y-1 hover:shadow-card-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald/10 text-emerald">
                  <Icon name={s.icon} className="h-6 w-6" />
                </div>
                <h3 className="mt-4 flex items-center gap-2 text-lg font-bold text-midnight">
                  {s.name}
                  <Icon name="arrow" className="h-4 w-4 text-emerald opacity-0 transition-opacity group-hover:opacity-100" />
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-brandslate">{s.short}</p>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/services" className="btn-ghost">See all services <Icon name="arrow" className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      {/* BEFORE / AFTER */}
      <section className="section">
        <div className="container-page">
          <SectionHead eyebrow="Results" title="From overgrown to build-ready" desc="Drag the slider to compare. Real project photography replaces these placeholders as galleries are added." />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <BeforeAfter label="Residential lot clearing" meta="Cobb County · ~1.5 acres" />
            <BeforeAfter label="Forestry mulching" meta="Cherokee County · wooded slope" />
          </div>
          <div className="mt-8 text-center">
            <Link href="/projects" className="btn-ghost">View projects gallery <Icon name="arrow" className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="section bg-midnight text-sand">
        <div className="container-page">
          <SectionHead eyebrow="How it works" title="Five clear steps, no surprises" theme="dark" />
          <ol className="mt-12 grid gap-6 md:grid-cols-3 lg:grid-cols-5">
            {processSteps.map((p) => (
              <li key={p.n} className="relative">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald font-heading text-lg font-bold text-white">
                  {p.n}
                </div>
                <h3 className="mt-4 font-heading text-base font-bold text-sand">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-sand/70">{p.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="section bg-white">
        <div className="container-page">
          <SectionHead eyebrow="Why GA Land Clearing" title="A single point of coordination you can trust" />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {differentiators.map((d) => (
              <div key={d.title} className="flex gap-4">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold/15 text-gold">
                  <Icon name="check" className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-midnight">{d.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-brandslate">{d.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICE MAP + COMMERCIAL */}
      <section className="section">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHead eyebrow="Coverage" title="Georgia-wide, dispatched from Marietta" align="left" />
            <p className="mt-4 max-w-md text-brandslate">
              We serve homeowners, builders, and commercial clients across the state — with fast local response
              throughout Metro Atlanta and coordinated crews for projects statewide.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/service-areas" className="btn-ghost">Browse service areas <Icon name="arrow" className="h-4 w-4" /></Link>
            </div>
          </div>
          <ServiceAreaMap className="mx-auto max-w-sm" />
        </div>
      </section>

      {/* COMMERCIAL BAND */}
      <section className="section bg-forest text-sand">
        <div className="container-page grid items-center gap-8 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <span className="eyebrow text-gold">Commercial & Development</span>
            <h2 className="mt-3 text-3xl font-bold text-sand sm:text-4xl">Development prep, lot clearing, access roads & ROW</h2>
            <p className="mt-4 max-w-2xl text-sand/80">
              Bid-ready scopes and documentation for builders, developers, general contractors, and municipal
              projects. We coordinate clearing, grading, and access so your site work stays on schedule.
            </p>
            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {["Development site prep", "Lot & pad clearing", "Access roads", "Right-of-way clearing", "Grading coordination", "Retention pond maintenance"].map((i) => (
                <li key={i} className="inline-flex items-center gap-2 text-sm text-sand/90">
                  <Icon name="check" className="h-4 w-4 text-gold" /> {i}
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:text-right">
            <Link href="/commercial#bid" className="btn-gold w-full sm:w-auto">Invite Us to Bid <Icon name="arrow" className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-white">
        <div className="container-page grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionHead eyebrow="FAQ" title="Answers before you ask" align="left" />
            <p className="mt-4 text-brandslate">
              Still have questions? <Link href="/contact" className="font-semibold text-forest underline">Get in touch</Link> or
              call <a href={`tel:${site.phoneE164}`} className="font-semibold text-forest underline">{site.phoneDisplay}</a>.
            </p>
          </div>
          <FAQAccordion items={homeFaqs} />
        </div>
      </section>

      <CTABand />
    </>
  );
}

// Reusable section heading (kept local to avoid an extra client boundary).
function SectionHead({
  eyebrow,
  title,
  desc,
  align = "center",
  theme = "light",
}: {
  eyebrow: string;
  title: string;
  desc?: string;
  align?: "center" | "left";
  theme?: "light" | "dark";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <span className="eyebrow">{eyebrow}</span>
      <h2 className={`mt-3 text-balance text-3xl font-bold sm:text-4xl ${theme === "dark" ? "text-sand" : "text-midnight"}`}>
        {title}
      </h2>
      {desc && <p className={`mt-3 ${theme === "dark" ? "text-sand/70" : "text-brandslate"}`}>{desc}</p>}
    </div>
  );
}
