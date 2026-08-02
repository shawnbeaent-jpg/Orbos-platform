import Link from "next/link";
import type { Metadata } from "next";
import { services } from "@/lib/services";
import { PageHero } from "@/components/PageHero";
import { CTABand } from "@/components/CTABand";
import { Icon } from "@/components/Icon";

export const metadata: Metadata = {
  title: "Land Clearing & Site Prep Services",
  description:
    "Explore GA Land Clearing's services: land clearing, brush clearing, forestry mulching, stump removal, grading, excavation, site development, right-of-way clearing, storm cleanup, and more across Georgia.",
  alternates: { canonical: "/services" },
};

export default function ServicesHub() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Every service to take land from overgrown to build-ready"
        subtitle="One coordinated point of contact for clearing, mulching, stumps, grading, excavation, and full site development — residential and commercial."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Services" }]}
      />
      <section className="section">
        <div className="container-page grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              className="group card flex flex-col p-6 transition-all hover:-translate-y-1 hover:shadow-card-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald/10 text-emerald">
                <Icon name={s.icon} className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-lg font-bold text-midnight">{s.name}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-brandslate">{s.short}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-forest">
                Learn more <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>
      <CTABand />
    </>
  );
}
