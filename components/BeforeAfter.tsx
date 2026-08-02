"use client";

import { useRef, useState } from "react";

// Before/after slider with clearly-labeled placeholders (spec §9).
// Uses CSS-drawn placeholder scenes until real project photography is provided —
// no fabricated or unlicensed imagery.
export function BeforeAfter({
  label = "Sample project",
  meta,
}: {
  label?: string;
  meta?: string;
}) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);

  const move = (clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, pct)));
  };

  return (
    <figure className="overflow-hidden rounded-2xl border border-midnight/10 bg-white shadow-card">
      <div
        ref={ref}
        className="relative aspect-[16/10] w-full cursor-ew-resize select-none touch-none"
        onMouseMove={(e) => e.buttons === 1 && move(e.clientX)}
        onTouchMove={(e) => move(e.touches[0].clientX)}
        onClick={(e) => move(e.clientX)}
        role="slider"
        aria-label="Before and after comparison"
        aria-valuenow={Math.round(pos)}
        aria-valuemin={0}
        aria-valuemax={100}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 5));
          if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 5));
        }}
      >
        {/* AFTER (base) — cleared, graded */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#cfe3d6] to-[#a9c6ac]">
          <div className="absolute bottom-0 h-1/3 w-full bg-[#9db98f]" />
          <span className="absolute right-3 top-3 rounded-full bg-emerald px-3 py-1 text-xs font-bold text-white">
            After
          </span>
        </div>
        {/* BEFORE (clipped overlay) — overgrown */}
        <div
          className="absolute inset-0 overflow-hidden bg-gradient-to-b from-[#2f4a35] to-[#16351d]"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        >
          <div
            className="absolute inset-0 opacity-70"
            style={{
              backgroundImage:
                "repeating-linear-gradient(85deg, #1c3a22 0 6px, #24492b 6px 12px), radial-gradient(circle at 30% 80%, #35592f 0 20px, transparent 21px)",
            }}
          />
          <span className="absolute left-3 top-3 rounded-full bg-midnight px-3 py-1 text-xs font-bold text-sand">
            Before
          </span>
        </div>
        {/* Handle */}
        <div className="absolute inset-y-0 z-10 w-0.5 bg-white shadow" style={{ left: `${pos}%` }}>
          <div className="absolute top-1/2 -left-4 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white text-midnight shadow-card-lg">
            ↔
          </div>
        </div>
        <span className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 rounded bg-midnight/70 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-sand">
          Illustrative placeholder
        </span>
      </div>
      <figcaption className="flex items-center justify-between px-4 py-3">
        <span className="text-sm font-semibold text-midnight">{label}</span>
        {meta && <span className="text-xs text-brandslate">{meta}</span>}
      </figcaption>
    </figure>
  );
}
