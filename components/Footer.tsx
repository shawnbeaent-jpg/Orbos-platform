import Link from "next/link";
import { site, footerNav } from "@/lib/site";
import { Logo } from "./Logo";
import { Icon } from "./Icon";

export function Footer() {
  return (
    <footer className="bg-midnight text-sand">
      <div className="container-page py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <Logo variant="horizontal" theme="light" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-sand/70">
              {site.modelDisclosure}
            </p>
            <div className="mt-6 flex flex-col gap-2 text-sm">
              <a href={`tel:${site.phoneE164}`} className="inline-flex items-center gap-2 font-semibold hover:text-emerald">
                <Icon name="phone" className="h-4 w-4" /> {site.phoneDisplay}
              </a>
              <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 text-sand/80 hover:text-emerald">
                <Icon name="message" className="h-4 w-4" /> {site.email}
              </a>
              <span className="inline-flex items-center gap-2 text-sand/70">
                <Icon name="map" className="h-4 w-4" /> {site.hq.city}, {site.hq.state} · {site.serviceRadiusNote}
              </span>
              <span className="inline-flex items-center gap-2 text-sand/70">
                <Icon name="clock" className="h-4 w-4" /> {site.hoursDisplay}
              </span>
            </div>
          </div>

          {footerNav.map((col) => (
            <div key={col.heading}>
              <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-emerald">{col.heading}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-sand/75 hover:text-sand">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-sand/10 pt-8 text-xs text-sand/55 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {site.legalName}. {site.positioning}.
          </p>
          <p className="max-w-md sm:text-right">
            GA Land Clearing coordinates qualified subcontractors and equipment operators. Not all crews are
            direct employees and not all equipment is company-owned.
          </p>
        </div>
      </div>
    </footer>
  );
}
