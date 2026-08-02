import Link from "next/link";
import type { Metadata } from "next";
import { counties, cities } from "@/lib/locations";
import { PageHero } from "@/components/PageHero";
import { ServiceAreaMap } from "@/components/ServiceAreaMap";
import { CTABand } from "@/components/CTABand";
import { Icon } from "@/components/Icon";

export const metadata: Metadata = {
  title: "Service Areas Across Georgia",
  description:
    "GA Land Clearing serves Cobb, Fulton, Gwinnett, Cherokee, Paulding, Bartow and communities statewide from our Marietta headquarters. Find your county or city.",
  alternates: { canonical: "/service-areas" },
};

export default function ServiceAreas() {
  return (
    <>
      <PageHero
        eyebrow="Coverage"
        title="Land clearing across Georgia, from Marietta"
        subtitle="Fast local response throughout Metro Atlanta and coordinated crews for projects statewide. Find your county or city below."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Service Areas" }]}
      />

      <section className="section">
        <div className="container-page grid items-center gap-12 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <h2 className="text-2xl font-bold text-midnight">Counties we serve</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {counties.map((c) => (
                <Link key={c.slug} href={`/service-areas/county/${c.slug}`} className="group card p-5 transition-all hover:-translate-y-1 hover:shadow-card-lg">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-midnight">{c.name}</h3>
                    <Icon name="arrow" className="h-4 w-4 text-emerald transition-transform group-hover:translate-x-1" />
                  </div>
                  <p className="mt-1 text-xs text-brandslate">Seat: {c.seat} · ~{c.approxMilesFromHQ} mi from HQ</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {c.cities.slice(0, 4).map((cs) => (
                      <span key={cs} className="rounded-full bg-midnight/5 px-2.5 py-1 text-xs text-midnight/70 capitalize">
                        {cs.replace(/-/g, " ")}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <ServiceAreaMap className="mx-auto max-w-sm" />
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-page">
          <h2 className="text-2xl font-bold text-midnight">Cities we serve</h2>
          <div className="mt-6 flex flex-wrap gap-2.5">
            {cities.map((c) => (
              <Link key={c.slug} href={`/service-areas/city/${c.slug}`} className="rounded-full border-2 border-midnight/12 px-4 py-2 text-sm font-medium text-midnight hover:border-emerald hover:text-forest">
                {c.name}
              </Link>
            ))}
          </div>
          <p className="mt-6 max-w-2xl text-sm text-brandslate">
            Don&apos;t see your area? We serve projects statewide. <Link href="/request-quote" className="font-semibold text-forest underline">Request a site assessment</Link> and we&apos;ll confirm coverage for your address.
          </p>
        </div>
      </section>

      <CTABand />
    </>
  );
}
