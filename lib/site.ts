// Central site configuration for GA Land Clearing.
// Single source of truth for company facts, contact info, and navigation.
// NOTE: Only verified facts belong here. Do not add claims about insurance,
// certifications, awards, or years-in-business unless the owner has confirmed them.

export const site = {
  name: "GA Land Clearing",
  legalName: "GA Land Clearing",
  positioning: "Georgia's Land Clearing and Site Preparation Partner",
  tagline: "From Overgrown to Build-Ready.",
  description:
    "Full-service brush clearing, forestry mulching, stump removal, grading, and site preparation for residential and commercial projects across Georgia. Headquartered in Marietta.",
  // Coordination-model disclosure — do NOT imply direct employment of all crews
  // or ownership of all equipment. See build spec §1.
  modelDisclosure:
    "GA Land Clearing coordinates a managed network of qualified subcontractors and equipment operators. We are your single point of contact for planning, scheduling, communication, documentation, and project completion.",
  hq: {
    city: "Marietta",
    state: "GA",
    region: "Metro Atlanta",
  },
  // Contact channels. Replace placeholders below with real, verified numbers
  // before production launch. Format: E.164 for links, pretty for display.
  phoneDisplay: "(470) 555-0142",
  phoneE164: "+14705550142",
  smsE164: "+14705550142",
  email: "quotes@galandclearing.com",
  // Domain used for canonical URLs, sitemap, OG tags.
  url: "https://www.galandclearing.com",
  hoursDisplay: "Mon–Sat, 7:00 AM – 7:00 PM",
  serviceRadiusNote: "Statewide service, dispatched from Marietta.",
  social: {
    facebook: "",
    instagram: "",
    linkedin: "",
  },
} as const;

export type NavItem = { label: string; href: string; children?: NavItem[] };

export const primaryNav: NavItem[] = [
  {
    label: "Services",
    href: "/services",
  },
  { label: "Service Areas", href: "/service-areas" },
  { label: "Projects", href: "/projects" },
  { label: "Commercial", href: "/commercial" },
  { label: "About", href: "/about" },
];

export const footerNav: { heading: string; links: NavItem[] }[] = [
  {
    heading: "Services",
    links: [
      { label: "Land Clearing", href: "/services/land-clearing" },
      { label: "Brush Clearing", href: "/services/brush-clearing" },
      { label: "Forestry Mulching", href: "/services/forestry-mulching" },
      { label: "Stump Removal", href: "/services/stump-removal" },
      { label: "Grading & Leveling", href: "/services/grading-leveling" },
      { label: "Site Development", href: "/services/site-development" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Projects Gallery", href: "/projects" },
      { label: "Service Areas", href: "/service-areas" },
      { label: "Commercial & Builders", href: "/commercial" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Get Started",
    links: [
      { label: "Request a Quote", href: "/request-quote" },
      { label: "Commercial Bid Request", href: "/commercial#bid" },
      { label: "Builder Partnership", href: "/commercial#builder" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/legal/privacy" },
      { label: "Terms of Service", href: "/legal/terms" },
      { label: "Accessibility", href: "/legal/accessibility" },
    ],
  },
];

// Audience segments used across the site (homepage + commercial flows).
export const audiences = [
  {
    key: "homeowners",
    title: "Homeowners",
    blurb:
      "Reclaim overgrown lots, open sightlines, and prep for a build, pool, pasture, or firebreak.",
    icon: "home",
  },
  {
    key: "builders",
    title: "Builders & Developers",
    blurb:
      "Lot clearing, grading coordination, and access roads with written scopes that keep your schedule on track.",
    icon: "blueprint",
  },
  {
    key: "commercial",
    title: "Commercial & Municipal",
    blurb:
      "Right-of-way clearing, development prep, and bid-ready scopes for larger sites and public projects.",
    icon: "building",
  },
  {
    key: "realtors",
    title: "Realtors & Investors",
    blurb:
      "Make raw or neglected parcels show-ready and build-ready to move listings and protect value.",
    icon: "chart",
  },
] as const;

// 5-step client process (spec §9).
export const processSteps = [
  {
    n: 1,
    title: "Submit your property",
    body: "Share the address, acreage, and what you're trying to accomplish. Photos and site plans help us move faster.",
  },
  {
    n: 2,
    title: "We review",
    body: "We assess access, terrain, and scope, then confirm the details and any questions before we come out.",
  },
  {
    n: 3,
    title: "Site assessment",
    body: "We evaluate the site in person or remotely to understand conditions, obstacles, and disposal needs.",
  },
  {
    n: 4,
    title: "Scope & pricing",
    body: "You get a clear, written scope and price — no vague estimates, no surprise change orders.",
  },
  {
    n: 5,
    title: "Execution",
    body: "Coordinated crews and equipment complete the work with communication throughout the project.",
  },
] as const;

// Reasons-to-choose (only verifiable, model-honest claims — spec §9 Trust rules).
export const differentiators = [
  {
    title: "Single point of coordination",
    body: "One contact for planning, scheduling, updates, and documentation from first call to final walkthrough.",
  },
  {
    title: "Managed subcontractor network",
    body: "We match the right qualified operators and equipment to your site instead of forcing one crew onto every job.",
  },
  {
    title: "Clear written scopes",
    body: "You know exactly what's included, what's excluded, and what it costs before work begins.",
  },
  {
    title: "Communication throughout",
    body: "Regular updates so you're never guessing about timing, progress, or next steps.",
  },
  {
    title: "Residential + commercial capability",
    body: "From a single overgrown lot to multi-acre development prep and right-of-way clearing.",
  },
  {
    title: "Marietta-based, Georgia-wide",
    body: "Local roots in Metro Atlanta with the reach to serve projects across the state.",
  },
] as const;
