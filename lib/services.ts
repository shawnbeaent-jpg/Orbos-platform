// Data-driven service catalog. Each service renders through the same template
// at app/services/[slug]/page.tsx — no per-page duplication (spec §7, §17).

export type ServiceFaq = { q: string; a: string };

export type Service = {
  slug: string;
  name: string;
  short: string; // one-line summary for cards
  icon: string; // key mapped in components/Icon.tsx
  overview: string;
  useCases: string[];
  scope: string[]; // what's typically included
  benefits: { title: string; body: string }[];
  faqs: ServiceFaq[];
  related: string[]; // slugs of related services
  featured?: boolean; // shown in the homepage services grid
};

export const services: Service[] = [
  {
    slug: "land-clearing",
    name: "Land Clearing",
    short: "Full-site clearing to take a parcel from overgrown to build-ready.",
    icon: "clearing",
    featured: true,
    overview:
      "Comprehensive land clearing removes trees, brush, undergrowth, and obstructions to open a site for construction, agriculture, or improved use. We coordinate the equipment and crews suited to your terrain, then leave you with a clean, workable parcel and a clear plan for debris.",
    useCases: [
      "Preparing a lot for a new home, barn, or outbuilding",
      "Opening pasture, food plots, or agricultural land",
      "Creating firebreaks and defensible space",
      "Reclaiming neglected or overgrown parcels for sale",
    ],
    scope: [
      "Removal of trees, brush, and undergrowth to the agreed clearing line",
      "Debris handling: mulching on site, hauling, or burning where permitted",
      "Stump handling per scope (grind, pull, or leave to grade)",
      "Rough grading coordination if the site needs leveling",
      "Written scope defining the exact cleared area and exclusions",
    ],
    benefits: [
      { title: "Build-ready faster", body: "A cleared, documented site keeps your project timeline moving." },
      { title: "Right equipment for the terrain", body: "We match machinery to slope, density, and access instead of one-size-fits-all." },
      { title: "Debris handled, not left behind", body: "Clear plan for mulch, hauling, or permitted burning up front." },
    ],
    faqs: [
      { q: "How much does land clearing cost?", a: "Pricing depends on acreage, tree density, terrain, access, and how debris is handled. We provide a written scope and price after reviewing your property — no public flat rate would be honest for work that varies this much." },
      { q: "How long does it take?", a: "A small residential lot can be days; multi-acre or heavily wooded sites take longer. We give a realistic timeline in your scope." },
      { q: "Do I need a permit?", a: "Some jurisdictions require land-disturbance or tree-removal permits, especially near streams or on larger sites. We'll flag what we see, but permitting requirements are set by your local authority — confirm with them or your engineer." },
    ],
    related: ["forestry-mulching", "stump-removal", "grading-leveling"],
  },
  {
    slug: "brush-clearing",
    name: "Brush Clearing",
    short: "Clear overgrowth, briars, and small growth without a full teardown.",
    icon: "brush",
    featured: true,
    overview:
      "Brush clearing removes dense undergrowth, briars, saplings, and small vegetation to reclaim usable space and improve visibility and access — without the scope or cost of full land clearing. It's ideal for maintenance, sightlines, and preparing a property to show or use.",
    useCases: [
      "Reclaiming fence lines, trails, and property edges",
      "Improving sightlines and curb appeal before a sale",
      "Ongoing maintenance of previously cleared land",
      "Clearing around structures for access and safety",
    ],
    scope: [
      "Removal of undergrowth, briars, and small-diameter growth",
      "Cut-back along fence lines, trails, and boundaries",
      "Debris mulched on site or hauled per scope",
      "Selective clearing to preserve trees you want to keep",
    ],
    benefits: [
      { title: "Lower-cost reclamation", body: "Targets overgrowth without the expense of removing mature trees." },
      { title: "Preserves what matters", body: "Selective clearing keeps the trees and features you want." },
      { title: "Fast turnaround", body: "Most brush work is completed quickly once scoped." },
    ],
    faqs: [
      { q: "What's the difference between brush clearing and land clearing?", a: "Brush clearing targets undergrowth, briars, and small growth. Land clearing removes trees and larger obstructions to open a full site. Many projects use both." },
      { q: "Can you clear without removing my trees?", a: "Yes. Selective brush clearing preserves specified trees while removing the growth around them." },
    ],
    related: ["land-clearing", "forestry-mulching", "storm-cleanup"],
  },
  {
    slug: "forestry-mulching",
    name: "Forestry Mulching",
    short: "Grind vegetation into mulch in one pass — low-impact, no hauling.",
    icon: "mulch",
    featured: true,
    overview:
      "Forestry mulching uses specialized equipment to cut, grind, and clear vegetation in a single pass, leaving a layer of nutrient-rich mulch behind. Because there's no hauling or burning, it's one of the most efficient and low-impact ways to clear brush, saplings, and small trees while protecting the soil.",
    useCases: [
      "Selective clearing that leaves ground cover intact",
      "Erosion-sensitive sites and slopes",
      "Trails, food plots, and recreational land",
      "Underbrush reduction for wildfire mitigation",
    ],
    scope: [
      "Single-pass cutting and mulching of brush and small trees",
      "Mulch layer left on site to suppress regrowth and reduce erosion",
      "Selective clearing around trees to be retained",
      "No debris hauling or burn piles for mulched material",
    ],
    benefits: [
      { title: "No hauling or burning", body: "Material stays on site as mulch — less cost, less disruption." },
      { title: "Soil protection", body: "The mulch layer reduces erosion and returns nutrients to the ground." },
      { title: "Low ground impact", body: "Well-suited to slopes and erosion-sensitive parcels." },
    ],
    faqs: [
      { q: "What size trees can forestry mulching handle?", a: "Mulching is most efficient on brush, saplings, and small-to-mid diameter trees. Larger trees may need removal first — we'll assess and tell you honestly." },
      { q: "Does the mulch need to be removed?", a: "Usually not. The mulch layer is a benefit — it suppresses regrowth and controls erosion. If your end use needs bare ground, we'll scope that separately." },
    ],
    related: ["brush-clearing", "land-clearing", "retention-pond-maintenance"],
  },
  {
    slug: "stump-removal",
    name: "Stump Removal",
    short: "Grind or pull stumps so the ground is level and build-ready.",
    icon: "stump",
    featured: true,
    overview:
      "Leftover stumps get in the way of grading, construction, mowing, and landscaping. We remove them by grinding or extraction depending on your end use and the site, so you're left with ground that's ready for the next step.",
    useCases: [
      "Clearing stumps before grading or foundation work",
      "Reclaiming lawn and pasture for mowing and use",
      "Removing hazards and trip points",
      "Finishing a clearing or storm-cleanup project",
    ],
    scope: [
      "Stump grinding below grade, or full extraction where needed",
      "Grindings backfilled or hauled per scope",
      "Coordination with grading if the area needs leveling after",
    ],
    benefits: [
      { title: "Truly usable ground", body: "No stumps left to block grading, building, or mowing." },
      { title: "Method matched to end use", body: "Grinding for landscaping, extraction where footings or utilities require it." },
    ],
    faqs: [
      { q: "Grinding vs. full removal — which do I need?", a: "Grinding is faster and less disruptive and works for most landscaping and mowing goals. Full extraction is used when the area needs footings, utilities, or a clean subgrade. We'll recommend based on your plan." },
      { q: "What happens to the grindings?", a: "They can be left as backfill/mulch or hauled off, depending on your scope." },
    ],
    related: ["land-clearing", "grading-leveling", "brush-clearing"],
  },
  {
    slug: "grading-leveling",
    name: "Grading & Leveling",
    short: "Shape and level the ground for drainage, building, and access.",
    icon: "grade",
    featured: true,
    overview:
      "Grading shapes and levels a site so water drains correctly and the ground is ready to build, pave, or plant. We coordinate rough and finish grading to your plan, working with your engineer's specs where drainage, slope, or compaction matter.",
    useCases: [
      "Preparing a pad for a home, slab, or structure",
      "Correcting drainage and low spots",
      "Leveling for driveways, lots, and access roads",
      "Finishing a cleared site for its next use",
    ],
    scope: [
      "Rough grading to establish slope and drainage",
      "Finish grading to plan where required",
      "Cut/fill and material movement coordination",
      "Coordination with engineered drainage plans when provided",
    ],
    benefits: [
      { title: "Drainage that works", body: "Proper slope moves water away from structures and surfaces." },
      { title: "Ready for the next trade", body: "A graded pad hands off cleanly to concrete, paving, or framing." },
    ],
    faqs: [
      { q: "Do you follow engineered grading plans?", a: "Yes. When you provide an engineer's or architect's plan, we coordinate the work to it. We don't provide engineering or certify plans ourselves." },
      { q: "Can you fix drainage problems?", a: "Often, yes — regrading to correct slope and low spots. Complex drainage may need an engineered solution, which we'll flag." },
    ],
    related: ["excavation", "site-development", "land-clearing"],
  },
  {
    slug: "site-development",
    name: "Site Development",
    short: "Coordinated clearing, grading, and access to make a site build-ready.",
    icon: "site",
    featured: true,
    overview:
      "Site development ties the pieces together — clearing, grading, access, and excavation coordination — so a raw parcel becomes a build-ready site on schedule. As your single point of coordination, we sequence the work and keep communication clear from start to finish.",
    useCases: [
      "New residential or commercial builds",
      "Multi-lot and subdivision preparation",
      "Access roads and site entrances",
      "Turning raw land into a build-ready pad",
    ],
    scope: [
      "Clearing and grubbing to the development footprint",
      "Rough and finish grading coordination",
      "Access road and entrance preparation",
      "Excavation and utility-trench coordination with your team",
      "Sequencing and communication across the site work",
    ],
    benefits: [
      { title: "One coordinator, not five callbacks", body: "We sequence clearing, grading, and access so trades hand off cleanly." },
      { title: "Schedule-aware", body: "Work planned around your build timeline and milestones." },
    ],
    faqs: [
      { q: "Do you handle utilities and foundations?", a: "We coordinate site prep — clearing, grading, access, and excavation. Utility connections and foundations are handled by licensed trades we sequence alongside, not something we self-perform or certify." },
      { q: "Can you work from our site plan?", a: "Yes. Share your site or civil plan and we'll coordinate the prep work to it." },
    ],
    related: ["grading-leveling", "excavation", "land-clearing"],
  },
  {
    slug: "excavation",
    name: "Excavation Coordination",
    short: "Digging, cut/fill, and earthwork coordinated with your project.",
    icon: "excavate",
    overview:
      "We coordinate excavation and earthwork — cut and fill, trenching, pond and pad work — with the right equipment and operators for the job, integrated with the rest of your site preparation.",
    useCases: [
      "Building pads and cut/fill balancing",
      "Trenching coordination for utilities",
      "Pond and detention basin shaping",
      "Access and driveway sub-grade work",
    ],
    scope: [
      "Cut/fill and earthwork coordination",
      "Trench excavation coordination with utility trades",
      "Basin and pad shaping",
      "Haul-off or on-site material placement per scope",
    ],
    benefits: [
      { title: "Integrated with site prep", body: "Earthwork sequenced with clearing and grading, not siloed." },
      { title: "Matched equipment", body: "The right machine and operator for the volume and access." },
    ],
    faqs: [
      { q: "Do you locate utilities before digging?", a: "Utility location (811 / call-before-you-dig) is arranged before any excavation. We coordinate it and will not dig without locates in place." },
    ],
    related: ["grading-leveling", "site-development", "retention-pond-maintenance"],
  },
  {
    slug: "right-of-way-clearing",
    name: "Right-of-Way Clearing",
    short: "Clear corridors for roads, utilities, and access — bid-ready scopes.",
    icon: "row",
    overview:
      "Right-of-way (ROW) clearing opens and maintains corridors for roads, utilities, pipelines, and access. We coordinate crews and equipment for linear clearing with the documentation and scope commercial and municipal projects require.",
    useCases: [
      "Road and access-corridor clearing",
      "Utility and pipeline right-of-way",
      "Vegetation management along established corridors",
      "Developer access roads",
    ],
    scope: [
      "Corridor clearing to defined width and limits",
      "Vegetation management and maintenance passes",
      "Debris handling per scope",
      "Documentation suited to commercial/municipal requirements",
    ],
    benefits: [
      { title: "Bid-ready documentation", body: "Scopes and records built for commercial and municipal review." },
      { title: "Linear-clearing capability", body: "Equipment and crews suited to corridor work." },
    ],
    faqs: [
      { q: "Do you handle municipal and utility projects?", a: "Yes — invite us to bid. We provide written scopes and documentation appropriate to public and utility work." },
    ],
    related: ["commercial-clearing", "brush-clearing", "site-development"],
  },
  {
    slug: "storm-cleanup",
    name: "Storm Cleanup",
    short: "Clear downed trees and debris and restore access after a storm.",
    icon: "storm",
    overview:
      "After a storm, we coordinate crews to clear downed trees, limbs, and debris so you can restore access and safety. We prioritize hazards and access first, then complete the cleanup and debris handling.",
    useCases: [
      "Downed-tree and limb removal",
      "Restoring driveway and road access",
      "Debris hauling and disposal",
      "Clearing hazards around structures",
    ],
    scope: [
      "Hazard and access clearing first",
      "Downed tree, limb, and debris removal",
      "Debris hauling or on-site processing per scope",
    ],
    benefits: [
      { title: "Access restored fast", body: "Hazards and blocked access handled as the priority." },
      { title: "Full debris handling", body: "Cleared, hauled, or processed so you're not left with piles." },
    ],
    faqs: [
      { q: "How quickly can you respond?", a: "Response depends on conditions and demand after a storm. Contact us and we'll give you a realistic window — we won't promise a time we can't hold." },
    ],
    related: ["brush-clearing", "stump-removal", "land-clearing"],
  },
  {
    slug: "retention-pond-maintenance",
    name: "Retention Pond Maintenance",
    short: "Clear and maintain detention and retention basins to function.",
    icon: "pond",
    overview:
      "Retention and detention ponds fill in with vegetation and sediment over time and stop draining as designed. We coordinate clearing and maintenance to keep basins functional and presentable for HOAs, property managers, and commercial sites.",
    useCases: [
      "HOA and community detention basins",
      "Commercial-site retention ponds",
      "Vegetation and sediment clearing",
      "Restoring designed drainage function",
    ],
    scope: [
      "Vegetation clearing in and around the basin",
      "Sediment and debris removal coordination",
      "Slope and inlet/outlet clearing",
      "Maintenance passes on a schedule",
    ],
    benefits: [
      { title: "Keeps basins functional", body: "Clearing restores designed capacity and drainage." },
      { title: "HOA & PM friendly", body: "Documented, scheduled maintenance for communities and sites." },
    ],
    faqs: [
      { q: "Do you offer scheduled maintenance?", a: "Yes. Many HOAs and property managers set up recurring maintenance passes — we'll scope a schedule that fits the basin." },
    ],
    related: ["forestry-mulching", "excavation", "commercial-clearing"],
  },
  {
    slug: "residential-clearing",
    name: "Residential Clearing",
    short: "Lot clearing and cleanup for homeowners and home builds.",
    icon: "home",
    overview:
      "Residential clearing helps homeowners and home builders reclaim lots, open space, and prepare ground for a build, pool, pasture, or landscaping — with clear scopes and communication throughout.",
    useCases: [
      "Preparing a lot for a new home or addition",
      "Clearing for a pool, shop, or barn",
      "Opening overgrown yards and acreage",
      "Firebreaks and defensible space around a home",
    ],
    scope: [
      "Selective or full clearing to your goals",
      "Brush, tree, and stump handling per scope",
      "Debris mulched, hauled, or burned where permitted",
      "Grading coordination if the lot needs leveling",
    ],
    benefits: [
      { title: "Homeowner-friendly process", body: "Clear scope and communication so you know what's happening and when." },
      { title: "Preserve what you want", body: "Selective clearing keeps the trees and features you value." },
    ],
    faqs: [
      { q: "Can you clear just part of my lot?", a: "Absolutely. We'll mark and scope the exact area so only what you want cleared is cleared." },
    ],
    related: ["land-clearing", "brush-clearing", "stump-removal"],
  },
  {
    slug: "commercial-clearing",
    name: "Commercial Clearing",
    short: "Lot clearing and site prep for commercial and development projects.",
    icon: "building",
    overview:
      "Commercial clearing supports developers, contractors, and property owners preparing sites for commercial construction, parking, access, and development — with the written scopes and documentation larger projects require.",
    useCases: [
      "Commercial lot and pad clearing",
      "Development-site preparation",
      "Access roads and site entrances",
      "Parking and staging area clearing",
    ],
    scope: [
      "Clearing and grubbing to the project footprint",
      "Grading and access coordination",
      "Debris handling and documentation",
      "Sequencing with your construction schedule",
    ],
    benefits: [
      { title: "Bid-ready scopes", body: "Written scopes and documentation built for commercial review." },
      { title: "Schedule coordination", body: "Site prep sequenced to your construction milestones." },
    ],
    faqs: [
      { q: "Can we invite you to bid on a project?", a: "Yes — that's exactly how commercial work should start. Send us the plans and requirements and we'll respond with a written scope." },
    ],
    related: ["site-development", "right-of-way-clearing", "grading-leveling"],
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export const featuredServices = services.filter((s) => s.featured);
