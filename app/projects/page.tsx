import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { BeforeAfter } from "@/components/BeforeAfter";
import { CTABand } from "@/components/CTABand";

export const metadata: Metadata = {
  title: "Projects Gallery",
  description:
    "Before-and-after land clearing, forestry mulching, and site prep projects across Georgia. Placeholders shown until project photography is added.",
  alternates: { canonical: "/projects" },
};

// Clearly-labeled placeholder projects — no fabricated client names or locations
// beyond generic county context. Replace with real, permissioned project media.
const projects = [
  { label: "Residential lot clearing", meta: "Cobb County · ~1.5 acres" },
  { label: "Forestry mulching", meta: "Cherokee County · wooded slope" },
  { label: "Pasture reclamation", meta: "Paulding County · ~4 acres" },
  { label: "Commercial pad clearing", meta: "Bartow County · development site" },
  { label: "Stump removal & grading", meta: "Fulton County · build prep" },
  { label: "Right-of-way clearing", meta: "Gwinnett County · access corridor" },
];

export default function Projects() {
  return (
    <>
      <PageHero
        eyebrow="Projects"
        title="From overgrown to build-ready"
        subtitle="A sample of the kinds of projects we coordinate across Georgia. Real, permissioned project photography replaces these placeholders as galleries are added."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Projects" }]}
      />
      <section className="section">
        <div className="container-page">
          <div className="rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-midnight">
            <strong>Note:</strong> The comparisons below are illustrative placeholders. We do not publish fabricated
            client names, reviews, or photos — real project media is added as clients approve it.
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <BeforeAfter key={p.label} label={p.label} meta={p.meta} />
            ))}
          </div>
        </div>
      </section>
      <CTABand title="Want your property to be the next before-and-after?" />
    </>
  );
}
