import Link from "next/link";
import { site } from "@/lib/site";
import { Icon } from "./Icon";

type CTABandProps = {
  title?: string;
  subtitle?: string;
};

// Reusable conversion band placed near the bottom of most pages (spec §2:
// every page must include a clear conversion path).
export function CTABand({
  title = "Ready to take your property from overgrown to build-ready?",
  subtitle = "Tell us about your site and get a clear, written scope and price — no obligation, no pressure.",
}: CTABandProps) {
  return (
    <section className="section">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-2xl bg-hero-grade px-6 py-14 text-center sm:px-12">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, #22A06B 0, transparent 45%), radial-gradient(circle at 85% 70%, #D8A94A 0, transparent 40%)",
            }}
          />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-balance text-3xl font-bold text-sand sm:text-4xl">{title}</h2>
            <p className="mx-auto mt-4 max-w-xl text-sand/75">{subtitle}</p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/request-quote" className="btn-primary w-full sm:w-auto">
                Request Site Assessment <Icon name="arrow" className="h-4 w-4" />
              </Link>
              <a href={`tel:${site.phoneE164}`} className="btn-outline w-full sm:w-auto">
                <Icon name="phone" className="h-4 w-4" /> Call {site.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
