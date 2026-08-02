import Link from "next/link";
import { site } from "@/lib/site";
import { Icon } from "./Icon";

// Consistent interior-page hero used across service, area, and info pages.
export function PageHero({
  eyebrow,
  title,
  subtitle,
  breadcrumbs,
  showCtas = true,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  breadcrumbs?: { label: string; href?: string }[];
  showCtas?: boolean;
}) {
  return (
    <section className="relative overflow-hidden bg-hero-grade">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{ backgroundImage: "radial-gradient(circle at 12% 20%, #22A06B 0, transparent 42%), radial-gradient(circle at 88% 80%, #D8A94A 0, transparent 45%)" }}
      />
      <div className="container-page relative py-14 sm:py-20">
        {breadcrumbs && (
          <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-1.5 text-sm text-sand/60">
            {breadcrumbs.map((b, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {b.href ? (
                  <Link href={b.href} className="hover:text-sand">{b.label}</Link>
                ) : (
                  <span className="text-sand/85">{b.label}</span>
                )}
                {i < breadcrumbs.length - 1 && <span>/</span>}
              </span>
            ))}
          </nav>
        )}
        {eyebrow && <span className="eyebrow text-emerald">{eyebrow}</span>}
        <h1 className="mt-3 max-w-3xl text-balance text-4xl font-bold leading-[1.08] text-sand sm:text-5xl">
          {title}
        </h1>
        {subtitle && <p className="mt-4 max-w-2xl text-lg text-sand/80">{subtitle}</p>}
        {showCtas && (
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/request-quote" className="btn-primary">
              Request Site Assessment <Icon name="arrow" className="h-4 w-4" />
            </Link>
            <a href={`tel:${site.phoneE164}`} className="btn-outline">
              <Icon name="phone" className="h-4 w-4" /> {site.phoneDisplay}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
