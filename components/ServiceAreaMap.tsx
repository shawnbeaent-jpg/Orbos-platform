import { site } from "@/lib/site";

// Stylized Georgia coverage map centered on Marietta HQ (spec §9 Service Map).
// Abstract state silhouette — NOT a claim of office locations anywhere but HQ.
export function ServiceAreaMap({ className }: { className?: string }) {
  return (
    <div className={`relative ${className ?? ""}`}>
      <svg viewBox="0 0 300 340" className="h-auto w-full" role="img" aria-label="GA Land Clearing Georgia service coverage, headquartered in Marietta">
        <defs>
          <radialGradient id="coverage" cx="42%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#22A06B" stopOpacity="0.55" />
            <stop offset="55%" stopColor="#22A06B" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#22A06B" stopOpacity="0.04" />
          </radialGradient>
        </defs>
        {/* Simplified Georgia outline */}
        <path
          d="M60 20 L210 20 L210 70 L250 100 L262 150 L250 210 L232 250 L205 300 L165 322 L150 300 L120 300 L96 275 L70 250 L58 200 L60 150 Z"
          fill="#17212B"
          stroke="#2b3b47"
          strokeWidth="2"
        />
        {/* Coverage glow */}
        <path
          d="M60 20 L210 20 L210 70 L250 100 L262 150 L250 210 L232 250 L205 300 L165 322 L150 300 L120 300 L96 275 L70 250 L58 200 L60 150 Z"
          fill="url(#coverage)"
        />
        {/* Coverage rings around HQ */}
        {[70, 46, 24].map((r, i) => (
          <circle key={i} cx="120" cy="98" r={r} fill="none" stroke="#22A06B" strokeWidth="1.2" strokeDasharray="4 5" opacity={0.45 - i * 0.08} />
        ))}
        {/* HQ pin (Marietta) — the only marked location */}
        <g>
          <circle cx="120" cy="98" r="8" fill="#D8A94A" />
          <circle cx="120" cy="98" r="8" fill="none" stroke="#0B1420" strokeWidth="2" />
          <circle cx="120" cy="98" r="3" fill="#0B1420" />
        </g>
        <text x="120" y="84" textAnchor="middle" fill="#F4F0E8" fontFamily="'Space Grotesk',sans-serif" fontSize="12" fontWeight="700">
          Marietta HQ
        </text>
      </svg>
      <p className="mt-3 text-center text-sm text-brandslate">
        {site.serviceRadiusNote} We serve counties and cities statewide — with no false office locations.
      </p>
    </div>
  );
}
