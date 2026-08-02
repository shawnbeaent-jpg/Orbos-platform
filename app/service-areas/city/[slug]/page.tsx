import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cities, getCity, getCounty } from "@/lib/locations";
import { featuredServices } from "@/lib/services";
import { site } from "@/lib/site";
import { PageHero } from "@/components/PageHero";
import { LeadForm } from "@/components/LeadForm";
import { CTABand } from "@/components/CTABand";
import { Icon } from "@/components/Icon";

export function generateStaticParams() {
  return cities.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const c = getCity(params.slug);
  if (!c) return { title: "City not found" };
  return {
    title: `Land Clearing in ${c.name}, GA`,
    description: `Land clearing and site prep in ${c.name}, Georgia. ${c.context.slice(0, 100)}`,
    alternates: { canonical: `/service-areas/city/${c.slug}` },
  };
}

export default function CityPage({ params }: { params: { slug: string } }) {
  const c = getCity(params.slug);
  if (!c) notFound();
  const county = getCounty(c.county);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Land Clearing",
    areaServed: { "@type": "City", name: `${c.name}, Georgia` },
    provider: { "@type": "LocalBusiness", name: site.name, telephone: site.phoneE164 },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero
        eyebrow={`${c.name}, GA`}
        title={`Land Clearing in ${c.name}`}
        subtitle={`${c.context}`}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Service Areas", href: "/service-areas" },
          ...(county ? [{ label: county.name, href: `/service-areas/county/${county.slug}` }] : []),
          { label: c.name },
        ]}
      />

      <div className="container-page grid gap-12 py-16 lg:grid-cols-[1.4fr_0.9fr] lg:items-start">
        <article className="space-y-10">
          <section>
            <h2 className="text-2xl font-bold text-midnight">Clearing & site prep in {c.name}</h2>
            <p className="mt-3 leading-relaxed text-brandslate">
              GA Land Clearing serves {c.name}
              {county ? ` in ${county.name}` : ""}, about {c.approxMilesFromHQ} miles from our Marietta headquarters.
              Whether you&apos;re clearing a single overgrown lot or preparing a site to build, you get one point of
              coordination and a clear written scope before any work begins.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-midnight">Common {c.name} projects</h2>
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
            <h2 className="text-2xl font-bold text-midnight">Services available in {c.name}</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {featuredServices.map((s) => (
                <Link key={s.slug} href={`/services/${s.slug}`} className="flex items-center gap-3 rounded-xl border border-midnight/10 bg-white p-4 hover:border-emerald">
                  <Icon name={s.icon} className="h-5 w-5 text-emerald" />
                  <span className="font-semibold text-midnight">{s.name}</span>
                </Link>
              ))}
            </div>
          </section>

          {county && (
            <p className="text-sm text-brandslate">
              {c.name} is part of{" "}
              <Link href={`/service-areas/county/${county.slug}`} className="font-semibold text-forest underline">
                our {county.name} service area
              </Link>
              .
            </p>
          )}
        </article>

        <aside className="lg:sticky lg:top-24">
          <div className="mb-4 rounded-2xl bg-forest p-5 text-sand">
            <p className="font-heading text-lg font-bold">Serving {c.name}</p>
            <p className="mt-1 text-sm text-sand/80">Get a written scope for your {c.name} property.</p>
          </div>
          <LeadForm source={`city:${c.slug}`} />
        </aside>
      </div>

      <CTABand title={`Have a property in ${c.name}?`} />
    </>
  );
}
