import Link from "next/link";
import type { Metadata } from "next";
import { site } from "@/lib/site";
import { Icon } from "@/components/Icon";

export const metadata: Metadata = {
  title: "Thank You",
  description: "Your request has been received. GA Land Clearing will follow up shortly.",
  robots: { index: false, follow: false },
};

export default function ThankYou({ searchParams }: { searchParams: { id?: string } }) {
  const id = searchParams?.id;
  return (
    <section className="section">
      <div className="container-page max-w-2xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald/15 text-emerald">
          <Icon name="check" className="h-8 w-8" />
        </div>
        <h1 className="mt-6 text-3xl font-bold text-midnight sm:text-4xl">Request received — thank you</h1>
        <p className="mt-4 text-brandslate">
          We&apos;ve got your details and a member of our team will follow up shortly to confirm next steps and schedule
          your site assessment.
        </p>
        {id && (
          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-midnight/5 px-4 py-2 text-sm font-semibold text-midnight">
            Your reference: <span className="font-mono text-forest">{id}</span>
          </p>
        )}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <InfoCard icon="clock" title="Fast response" body="We aim to reach out quickly during business hours." />
          <InfoCard icon="shield" title="No obligation" body="A written scope and price with no pressure." />
          <InfoCard icon="phone" title="Questions?" body={site.phoneDisplay} href={`tel:${site.phoneE164}`} />
        </div>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn-ghost">Back to home</Link>
          <Link href="/services" className="btn-primary">Explore services <Icon name="arrow" className="h-4 w-4" /></Link>
        </div>
      </div>
    </section>
  );
}

function InfoCard({ icon, title, body, href }: { icon: string; title: string; body: string; href?: string }) {
  const inner = (
    <div className="card h-full p-5 text-left">
      <Icon name={icon} className="h-6 w-6 text-forest" />
      <p className="mt-3 font-bold text-midnight">{title}</p>
      <p className="mt-1 text-sm text-brandslate">{body}</p>
    </div>
  );
  return href ? <a href={href}>{inner}</a> : inner;
}
