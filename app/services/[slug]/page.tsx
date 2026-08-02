import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { services, getService } from "@/lib/services";
import { site } from "@/lib/site";
import { PageHero } from "@/components/PageHero";
import { FAQAccordion } from "@/components/FAQAccordion";
import { LeadForm } from "@/components/LeadForm";
import { BeforeAfter } from "@/components/BeforeAfter";
import { Icon } from "@/components/Icon";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const s = getService(params.slug);
  if (!s) return { title: "Service not found" };
  return {
    title: `${s.name} in Georgia`,
    description: s.overview.slice(0, 155),
    alternates: { canonical: `/services/${s.slug}` },
    openGraph: { title: `${s.name} | ${site.name}`, description: s.short },
  };
}

export default function ServicePage({ params }: { params: { slug: string } }) {
  const s = getService(params.slug);
  if (!s) notFound();

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: s.name,
    provider: { "@type": "LocalBusiness", name: site.name, telephone: site.phoneE164 },
    areaServed: { "@type": "State", name: "Georgia" },
    description: s.overview,
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: s.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const related = s.related.map(getService).filter(Boolean);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <PageHero
        eyebrow="Service"
        title={`${s.name} in Georgia`}
        subtitle={s.short}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Services", href: "/services" }, { label: s.name }]}
      />

      <div className="container-page grid gap-12 py-16 lg:grid-cols-[1.4fr_0.9fr] lg:items-start">
        <article className="prose-scope space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-midnight">Overview</h2>
            <p className="mt-3 leading-relaxed text-brandslate">{s.overview}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-midnight">Common use cases</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {s.useCases.map((u) => (
                <li key={u} className="flex gap-3 rounded-xl border border-midnight/8 bg-white p-4">
                  <Icon name="check" className="mt-0.5 h-5 w-5 shrink-0 text-emerald" />
                  <span className="text-sm text-midnight">{u}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-midnight">What&apos;s included</h2>
            <ul className="mt-4 space-y-2.5">
              {s.scope.map((item) => (
                <li key={item} className="flex gap-3">
                  <Icon name="check" className="mt-0.5 h-5 w-5 shrink-0 text-forest" />
                  <span className="text-brandslate">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-midnight">Benefits</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {s.benefits.map((b) => (
                <div key={b.title} className="card p-5">
                  <h3 className="font-bold text-midnight">{b.title}</h3>
                  <p className="mt-1.5 text-sm text-brandslate">{b.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-midnight">Results</h2>
            <div className="mt-4">
              <BeforeAfter label={`${s.name} — sample`} meta="Illustrative placeholder" />
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-midnight">Frequently asked questions</h2>
            <div className="mt-4">
              <FAQAccordion items={s.faqs} />
            </div>
          </section>

          {related.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-midnight">Related services</h2>
              <div className="mt-4 flex flex-wrap gap-3">
                {related.map((r) => (
                  <Link key={r!.slug} href={`/services/${r!.slug}`} className="inline-flex items-center gap-2 rounded-full border-2 border-midnight/15 px-4 py-2 text-sm font-semibold text-midnight hover:border-emerald hover:text-forest">
                    <Icon name={r!.icon} className="h-4 w-4" /> {r!.name}
                  </Link>
                ))}
              </div>
            </section>
          )}
        </article>

        {/* Sticky quote rail */}
        <aside className="lg:sticky lg:top-24">
          <div className="mb-4 rounded-2xl bg-forest p-5 text-sand">
            <p className="font-heading text-lg font-bold">Get a scope for {s.name.toLowerCase()}</p>
            <p className="mt-1 text-sm text-sand/80">Tell us about your site — we&apos;ll follow up with a clear written scope and price.</p>
          </div>
          <LeadForm source={`service:${s.slug}`} presetServices={[s.slug]} />
        </aside>
      </div>
    </>
  );
}
