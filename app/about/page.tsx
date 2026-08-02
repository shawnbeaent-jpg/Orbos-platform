import type { Metadata } from "next";
import { site, differentiators, processSteps } from "@/lib/site";
import { PageHero } from "@/components/PageHero";
import { CTABand } from "@/components/CTABand";
import { Icon } from "@/components/Icon";

export const metadata: Metadata = {
  title: "About GA Land Clearing",
  description:
    "GA Land Clearing is Georgia's land clearing and site preparation partner, headquartered in Marietta. Learn how our coordination model delivers clear scopes and reliable results.",
  alternates: { canonical: "/about" },
};

export default function About() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Georgia's land clearing and site preparation partner"
        subtitle="Headquartered in Marietta, we make land work simpler by being your single point of coordination from first call to final walkthrough."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
      />

      <section className="section">
        <div className="container-page grid gap-12 lg:grid-cols-2 lg:items-start">
          <div className="space-y-5">
            <h2 className="text-2xl font-bold text-midnight">How we work</h2>
            <p className="leading-relaxed text-brandslate">{site.modelDisclosure}</p>
            <p className="leading-relaxed text-brandslate">
              That model matters. Instead of forcing one crew and one machine onto every job, we match the right
              qualified operators and equipment to your site, terrain, and timeline. You get a single point of contact
              who handles planning, scheduling, communication, and documentation — so the work gets done right without
              you chasing five different subcontractors.
            </p>
            <p className="leading-relaxed text-brandslate">
              We keep our claims honest. We publish clear scopes, communicate throughout the project, and never promise
              a timeline or outcome we can&apos;t stand behind.
            </p>
          </div>
          <div className="rounded-2xl bg-charcoal p-8 text-sand">
            <p className="eyebrow text-gold">Our promise</p>
            <p className="mt-3 font-heading text-2xl font-bold">{site.tagline}</p>
            <ul className="mt-6 space-y-3">
              {differentiators.slice(0, 4).map((d) => (
                <li key={d.title} className="flex gap-3">
                  <Icon name="check" className="mt-0.5 h-5 w-5 shrink-0 text-emerald" />
                  <div>
                    <p className="font-semibold text-sand">{d.title}</p>
                    <p className="text-sm text-sand/70">{d.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-page">
          <h2 className="text-center text-2xl font-bold text-midnight">Our process</h2>
          <ol className="mt-10 grid gap-6 md:grid-cols-5">
            {processSteps.map((p) => (
              <li key={p.n}>
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald font-heading text-lg font-bold text-white">{p.n}</div>
                <h3 className="mt-3 font-bold text-midnight">{p.title}</h3>
                <p className="mt-1 text-sm text-brandslate">{p.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CTABand />
    </>
  );
}
