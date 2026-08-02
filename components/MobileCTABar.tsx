import Link from "next/link";
import { site } from "@/lib/site";
import { Icon } from "./Icon";

// Sticky mobile bottom bar: Call / Text / Quote (spec §8).
export function MobileCTABar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-3 border-t border-midnight/10 bg-midnight text-sand lg:hidden">
      <a
        href={`tel:${site.phoneE164}`}
        className="flex flex-col items-center gap-1 py-2.5 text-xs font-semibold hover:bg-white/5"
      >
        <Icon name="phone" className="h-5 w-5 text-emerald" />
        Call
      </a>
      <a
        href={`sms:${site.smsE164}`}
        className="flex flex-col items-center gap-1 border-x border-sand/10 py-2.5 text-xs font-semibold hover:bg-white/5"
      >
        <Icon name="message" className="h-5 w-5 text-gold" />
        Text
      </a>
      <Link
        href="/request-quote"
        className="flex flex-col items-center gap-1 bg-emerald py-2.5 text-xs font-bold text-white hover:bg-[#1c8a5b]"
      >
        <Icon name="check" className="h-5 w-5" />
        Quote
      </Link>
    </div>
  );
}
