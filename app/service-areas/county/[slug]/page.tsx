import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { counties, getCounty, citiesInCounty } from "@/lib/locations";
import { featuredServices } from "@/lib/services";
import { site } from "@/lib/site";
import { PageHero } from "@/components/PageHero";
import { LeadForm } from "@/components/LeadForm";
import { CTABand } from "@/components/CTABand";
import { Icon } from "@/components/Icon";

export function generateStaticParams() {
  return counties.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const c = getCounty(params.slug);
  if (!c) return { title: "County not found" };
  return {
    title: `Land Clearing in ${c.name}, GA`,
    description: `Land clearing, brush clearing, forestry mulching, stump removal, and grading in ${c.name}, Georgia. ${c.context.slice(0, 90)}`,
    alternates: { canonical: `/service-areas/county/${c.slug}` },
  };
}

export default function CountyPage({ params }: { params: { slug: string } }) {
  const c = getCounty(params.slug);
  if (!c) notFound();
  const cityList = citiesInCounty(c.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Land Clearing",
    areaServed: { "@type": "AdministrativeArea", name: `${c.name}, Georgia` },
    provider: { "@type": "LocalBusiness", name: site.name, telephone: site.phoneE164 },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero
        eyebrow={`${c.name}, GA`}
        title={`Land Clearing in ${c.name}`}
        subtitle={`Professional clearing, mulching, stump removal, and grading across ${c.name} — coordinated from our Marietta HQ, about ${c.approxMilesFromHQ} miles away.`}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Service Areas", href: "/service-areas" }, { label: c.name }]}
      />

      <div className="container-page grid gap-12 py-16 lg:grid-cols-[1.4fr_0.9fr] lg:items-start">
        <article className="space-y-10">
          <section>
            <h2 className="text-2xl font-bold text-midnight">Clearing services in {c.name}</h2>
            <p className="mt-3 leading-relaxed text-brandslate">{c.context}</p>
            <p className="mt-3 leading-relaxed text-brandslate">
              <span className="font-semibold text-midnight">Local terrain: </span>{c.landscape}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-midnight">What we do most in {c.name}</h2>
            <ul className="mt-4 space-y-3">
              {c.useCases.map((u) => (
                <li key={u} className="flex gap-3 rounded-xl border border-midnight/8 bg-white p-4">
                  <Icon name="check" className="mt-0.5 h-5 w-5 shrink-0 text-emerald" />
                  <span className="text-sm text-midnight">{u}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-midnight">Popular services</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {featuredServices.map((s) => (
                <Link key={s.slug} href={`/services/${s.slug}`} className="flex items-center gap-3 rounded-xl border border-midnight/10 bg-white p-4 hover:border-emerald">
                  <Icon name={s.icon} className="h-5 w-5 text-emerald" />
                  <span className="font-semibold text-midnight">{s.name}</span>
                </Link>
              ))}
            </div>
          </section>

          {cityList.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-midnight">Cities we serve in {c.name}</h2>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {cityList.map((ct) => (
                  <Link key={ct.slug} href={`/service-areas/city/${ct.slug}`} className="rounded-full border-2 border-midnight/12 px-4 py-2 text-sm font-medium text-midnight hover:border-emerald hover:text-forest">
                    {ct.name}
                  </Link>
                ))}
              </div>
            </section>
          )}
        </article>

        <aside className="lg:sticky lg:top-24">
          <div className="mb-4 rounded-2xl bg-forest p-5 text-sand">
            <p className="font-heading text-lg font-bold">Serving {c.name}</p>
            <p className="mt-1 text-sm text-sand/80">Get a written scope for your {c.name} property.</p>
          </div>
          <LeadForm source={`county:${c.slug}`} />
        </aside>
      </div>

      <CTABand title={`Have a property in ${c.name}?`} />
    </>
  );
}
