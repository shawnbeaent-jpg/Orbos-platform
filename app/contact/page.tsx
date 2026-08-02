import type { Metadata } from "next";
import { site } from "@/lib/site";
import { PageHero } from "@/components/PageHero";
import { LeadForm } from "@/components/LeadForm";
import { Icon } from "@/components/Icon";

export const metadata: Metadata = {
  title: "Contact GA Land Clearing",
  description:
    "Call, text, or send a request to GA Land Clearing. Marietta-based, serving land clearing and site prep projects across Georgia.",
  alternates: { canonical: "/contact" },
};

export default function Contact() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's talk about your project"
        subtitle="Call, text, or send us the details. We'll follow up to schedule a site assessment and put together a clear written scope."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        showCtas={false}
      />
      <div className="container-page grid gap-12 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <aside className="space-y-4">
          <ContactCard icon="phone" title="Call us" value={site.phoneDisplay} href={`tel:${site.phoneE164}`} sub="Fastest way to reach us" />
          <ContactCard icon="message" title="Text us" value={site.phoneDisplay} href={`sms:${site.smsE164}`} sub="Send photos of your site" />
          <ContactCard icon="message" title="Email" value={site.email} href={`mailto:${site.email}`} />
          <ContactCard icon="map" title="Based in" value={`${site.hq.city}, ${site.hq.state}`} sub={site.serviceRadiusNote} />
          <ContactCard icon="clock" title="Hours" value={site.hoursDisplay} />
        </aside>
        <div>
          <h2 className="mb-4 text-xl font-bold text-midnight">Send us your project details</h2>
          <LeadForm source="contact" />
        </div>
      </div>
    </>
  );
}

function ContactCard({ icon, title, value, href, sub }: { icon: string; title: string; value: string; href?: string; sub?: string }) {
  const inner = (
    <div className="card flex items-center gap-4 p-5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-forest/10 text-forest">
        <Icon name={icon} className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-brandslate">{title}</p>
        <p className="font-bold text-midnight">{value}</p>
        {sub && <p className="text-xs text-brandslate">{sub}</p>}
      </div>
    </div>
  );
  return href ? (
    <a href={href} className="block transition-transform hover:-translate-y-0.5">{inner}</a>
  ) : (
    inner
  );
}
