// Lightweight inline icon set (no icon-library dependency, keeps bundle small).
// Stroke-based, currentColor, 24x24 grid.

type IconProps = { name: string; className?: string };

const paths: Record<string, React.ReactNode> = {
  clearing: <path d="M3 20h18M6 20V10l6-5 6 5v10M9 20v-5h6v5" />,
  brush: <path d="M4 20c4 0 4-6 8-6s4 6 8 6M12 14V4M9 7l3-3 3 3" />,
  mulch: <path d="M3 15h18M5 15c0-3 3-5 7-5s7 2 7 5M8 19h.01M12 19h.01M16 19h.01" />,
  stump: <path d="M8 21h8M9 21v-6h6v6M12 15V9M9 9h6M10.5 9V4M13.5 9V6" />,
  grade: <path d="M3 18L21 6M3 18h6M21 6v6" />,
  site: <path d="M4 21V9l8-5 8 5v12M4 21h16M9 21v-6h6v6M9 12h.01M15 12h.01" />,
  excavate: <path d="M3 20h11M14 20v-4l4-2 3 3-2 3M6 20l1-9 4 1M11 12l3-4" />,
  row: <path d="M3 20h18M6 20V7M18 20V7M6 12h12M9 4h6" />,
  storm: <path d="M13 3L4 14h6l-1 7 9-11h-6z" />,
  pond: <path d="M3 12c3 0 3 2 6 2s3-2 6-2 3 2 6 2M3 17c3 0 3 2 6 2s3-2 6-2 3 2 6 2M12 3v6M9 6l3-3 3 3" />,
  home: <path d="M3 11l9-7 9 7M5 10v10h14V10M10 20v-6h4v6" />,
  building: <path d="M6 21V4h12v17M9 8h.01M12 8h.01M15 8h.01M9 12h.01M12 12h.01M15 12h.01M10 21v-4h4v4" />,
  blueprint: <path d="M4 4h16v16H4zM8 4v16M4 8h4M16 12h4M12 16h8" />,
  chart: <path d="M4 20h16M7 20v-6M12 20V8M17 20v-9" />,
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />,
  message: <path d="M4 5h16v11H8l-4 3z" />,
  check: <path d="M20 6L9 17l-5-5" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  map: <path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14" />,
  clock: <path d="M12 7v5l3 2M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
  shield: <path d="M12 3l8 3v6c0 4-3 7-8 9-5-2-8-5-8-9V6z" />,
  upload: <path d="M12 16V4M8 8l4-4 4 4M4 16v4h16v-4" />,
  users: <path d="M16 20v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 10a4 4 0 100-8 4 4 0 000 8M22 20v-2a4 4 0 00-3-3.8M16 2.2A4 4 0 0116 10" />,
};

export function Icon({ name, className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className ?? "h-6 w-6"}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] ?? paths.check}
    </svg>
  );
}
