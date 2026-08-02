import type { Metadata } from "next";
import { services } from "@/lib/services";
import { site } from "@/lib/site";
import { PageHero } from "@/components/PageHero";
import { FAQAccordion } from "@/components/FAQAccordion";
import { CTABand } from "@/components/CTABand";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers about land clearing pricing, timelines, methods, permits, access, and how GA Land Clearing operates across Georgia.",
  alternates: { canonical: "/faq" },
};

const generalFaqs = [
  { q: "How much does land clearing cost?", a: "It depends on acreage, tree density, terrain, access, and how debris is handled. We provide a written scope and price after reviewing your property — a flat public rate would be misleading for work that varies this much." },
  { q: "How long will my project take?", a: "A small residential lot can take a few days; multi-acre or heavily wooded sites take longer. Your written scope includes a realistic timeline." },
  { q: "What areas do you serve?", a: "We're based in Marietta and serve projects statewide across Georgia, with fast response throughout Metro Atlanta — Cobb, Fulton, Gwinnett, Cherokee, Paulding, Bartow, and beyond." },
  { q: "How does GA Land Clearing operate?", a: site.modelDisclosure },
  { q: "Do you handle both residential and commercial work?", a: "Yes — from a single overgrown lot to multi-acre development prep, right-of-way clearing, and commercial site work with documentation suited to each." },
  { q: "Do I need a permit?", a: "Some jurisdictions require land-disturbance or tree-removal permits, especially near streams or on larger sites. We'll flag what we notice, but permitting is set by your local authority — confirm requirements with them or your engineer." },
  { q: "What methods do you use to clear land?", a: "Depending on the site and goal, we coordinate mechanical clearing, forestry mulching, selective clearing, and grading. We match the method and equipment to your terrain, density, and end use." },
  { q: "What happens to the debris?", a: "Debris is mulched on site, hauled off, or burned where permitted — decided up front and written into your scope." },
  { q: "Can you clear around trees I want to keep?", a: "Yes. Selective clearing preserves the specific trees and features you want while removing everything else." },
  { q: "Do you offer financing or public pricing?", a: "We don't publish pricing because every site is different. Contact us for a written scope and price specific to your property." },
];

export default function FAQ() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: generalFaqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <PageHero
        eyebrow="FAQ"
        title="Frequently asked questions"
        subtitle="Pricing, timelines, methods, permits, and how we work. Still have questions? Reach out any time."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "FAQ" }]}
      />
      <section className="section">
        <div className="container-page max-w-3xl">
          <FAQAccordion items={generalFaqs} />

          <h2 className="mt-14 text-2xl font-bold text-midnight">Service-specific questions</h2>
          <div className="mt-6 space-y-8">
            {services.filter((s) => s.featured).map((s) => (
              <div key={s.slug}>
                <h3 className="mb-3 font-heading text-lg font-bold text-forest">{s.name}</h3>
                <FAQAccordion items={s.faqs} />
              </div>
            ))}
          </div>
        </div>
      </section>
      <CTABand />
    </>
  );
}
