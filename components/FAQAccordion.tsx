"use client";

import { useState } from "react";

export type FAQ = { q: string; a: string };

export function FAQAccordion({ items }: { items: FAQ[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-midnight/10 overflow-hidden rounded-2xl border border-midnight/10 bg-white">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
              >
                <span className="font-heading text-base font-semibold text-midnight sm:text-lg">
                  {item.q}
                </span>
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-midnight/15 text-forest transition-transform ${
                    isOpen ? "rotate-45" : ""
                  }`}
                  aria-hidden
                >
                  +
                </span>
              </button>
            </h3>
            {isOpen && (
              <div className="px-5 pb-5 -mt-1">
                <p className="max-w-3xl leading-relaxed text-brandslate">{item.a}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
