// GA Land Clearing logo system — original mark, no clip-art or unlicensed assets.
// The monogram pairs a "GA" lockup with layered contour/grading lines evoking
// graded terrain. Rendered as inline SVG so it stays crisp and themeable.

type LogoProps = {
  variant?: "horizontal" | "stacked" | "icon";
  theme?: "dark" | "light"; // dark = for light backgrounds; light = for dark bg
  className?: string;
};

export function LogoMark({ theme = "dark", className }: { theme?: "dark" | "light"; className?: string }) {
  const stroke = theme === "light" ? "#F4F0E8" : "#0B1420";
  const emerald = "#22A06B";
  const gold = "#D8A94A";
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      role="img"
      aria-label="GA Land Clearing mark"
      fill="none"
    >
      {/* Rounded terrain badge */}
      <rect x="1.5" y="1.5" width="45" height="45" rx="11" stroke={emerald} strokeWidth="3" />
      {/* Contour / grading lines */}
      <path d="M7 31c6-5 12-5 17 0s11 5 17 0" stroke={gold} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M7 38c6-4 12-4 17 0s11 4 17 0" stroke={emerald} strokeWidth="2.5" strokeLinecap="round" opacity="0.65" />
      {/* GA monogram */}
      <text
        x="24"
        y="23"
        textAnchor="middle"
        fontFamily="'Space Grotesk', sans-serif"
        fontWeight="700"
        fontSize="17"
        fill={stroke}
        letterSpacing="-0.5"
      >
        GA
      </text>
    </svg>
  );
}

export function Logo({ variant = "horizontal", theme = "dark", className }: LogoProps) {
  const textColor = theme === "light" ? "text-sand" : "text-midnight";
  const subColor = theme === "light" ? "text-emerald" : "text-forest";

  if (variant === "icon") {
    return <LogoMark theme={theme} className={className ?? "h-10 w-10"} />;
  }

  if (variant === "stacked") {
    return (
      <div className={`flex flex-col items-center gap-2 ${className ?? ""}`}>
        <LogoMark theme={theme} className="h-12 w-12" />
        <div className="text-center leading-none">
          <div className={`font-heading text-lg font-bold tracking-tight ${textColor}`}>
            GA LAND CLEARING
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className ?? ""}`}>
      <LogoMark theme={theme} className="h-10 w-10 shrink-0" />
      <div className="leading-none">
        <div className={`font-heading text-base font-bold tracking-tight sm:text-lg ${textColor}`}>
          GA LAND CLEARING
        </div>
        <div className={`mt-0.5 text-[11px] font-semibold uppercase tracking-[0.16em] ${subColor}`}>
          From Overgrown to Build-Ready
        </div>
      </div>
    </div>
  );
}
