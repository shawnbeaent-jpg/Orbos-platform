// Location data for template-driven service-area SEO pages (spec §18).
// Each entry carries UNIQUE local context so pages are not thin/duplicated.
// Distances are approximate driving distance from Marietta HQ.

export type County = {
  slug: string;
  name: string; // e.g. "Cobb County"
  seat: string;
  approxMilesFromHQ: number;
  context: string; // unique local paragraph
  landscape: string; // terrain/vegetation notes specific to the county
  useCases: string[];
  cities: string[]; // city slugs served within the county
};

export type City = {
  slug: string;
  name: string;
  county: string; // county slug
  approxMilesFromHQ: number;
  context: string;
  useCases: string[];
};

export const counties: County[] = [
  {
    slug: "cobb",
    name: "Cobb County",
    seat: "Marietta",
    approxMilesFromHQ: 0,
    context:
      "Cobb County is our home base — GA Land Clearing is headquartered in Marietta. From established neighborhoods in East Cobb to growing corridors around Kennesaw and Acworth, we clear residential lots, prep builder sites, and maintain overgrown parcels across the county with fast local response.",
    landscape:
      "Mixed hardwood and pine with rolling terrain, mature tree cover in older subdivisions, and denser lots near the Chattahoochee corridor.",
    useCases: [
      "Lot clearing for new construction and additions in fast-growing Cobb neighborhoods",
      "Selective clearing and brush work on wooded East Cobb properties",
      "Builder and developer site prep around Kennesaw and Acworth",
    ],
    cities: ["marietta", "kennesaw", "acworth", "smyrna"],
  },
  {
    slug: "fulton",
    name: "Fulton County",
    seat: "Atlanta",
    approxMilesFromHQ: 20,
    context:
      "Fulton County spans dense metro Atlanta and fast-developing North Fulton. We support infill lot clearing in the city, larger site prep in Alpharetta and Roswell, and commercial and development clearing where raw parcels are being turned build-ready.",
    landscape:
      "Urban infill lots with tight access in the city core; larger wooded and rolling parcels through North Fulton suburbs.",
    useCases: [
      "Tight-access infill lot clearing inside Atlanta",
      "Residential and builder site prep in Alpharetta and Roswell",
      "Commercial and development clearing on North Fulton corridors",
    ],
    cities: ["atlanta", "alpharetta", "roswell", "sandy-springs"],
  },
  {
    slug: "gwinnett",
    name: "Gwinnett County",
    seat: "Lawrenceville",
    approxMilesFromHQ: 35,
    context:
      "Gwinnett is one of Georgia's fastest-growing counties, and that growth means constant demand for lot clearing and site preparation. We work across Lawrenceville, Duluth, and Buford supporting homeowners, builders, and developers turning wooded parcels into build-ready sites.",
    landscape:
      "Heavily wooded suburban parcels, rolling terrain, and a mix of mature pine and hardwood typical of the northeast metro.",
    useCases: [
      "Wooded lot clearing for new residential construction",
      "Developer and subdivision site prep",
      "Brush clearing and reclamation on larger suburban parcels",
    ],
    cities: ["lawrenceville", "duluth", "buford", "snellville"],
  },
  {
    slug: "cherokee",
    name: "Cherokee County",
    seat: "Canton",
    approxMilesFromHQ: 25,
    context:
      "Cherokee County's mix of acreage properties and rapid residential growth makes it a core service area. From wooded lots in Woodstock to larger rural parcels near Canton and Ball Ground, we handle clearing, forestry mulching, and site prep for homeowners and builders alike.",
    landscape:
      "Larger rural and semi-rural acreage, dense hardwood and pine, sloped and erosion-sensitive sites well suited to forestry mulching.",
    useCases: [
      "Acreage clearing and forestry mulching on rural parcels",
      "Lot prep for new homes in Woodstock and Holly Springs",
      "Firebreaks and pasture reclamation on larger properties",
    ],
    cities: ["canton", "woodstock", "holly-springs"],
  },
  {
    slug: "paulding",
    name: "Paulding County",
    seat: "Dallas",
    approxMilesFromHQ: 18,
    context:
      "Paulding County's continued residential growth west of Marietta keeps demand high for lot clearing and land prep. We serve Dallas, Hiram, and surrounding areas with clearing, brush work, and grading coordination for homeowners and builders.",
    landscape:
      "Rolling wooded terrain with a mix of pine and hardwood, larger residential lots, and expanding subdivision development.",
    useCases: [
      "New-construction lot clearing in growing Paulding subdivisions",
      "Brush clearing and reclamation on larger residential parcels",
      "Grading coordination for build-ready pads",
    ],
    cities: ["dallas", "hiram"],
  },
  {
    slug: "bartow",
    name: "Bartow County",
    seat: "Cartersville",
    approxMilesFromHQ: 30,
    context:
      "Bartow County combines rural acreage, agricultural land, and steady residential and commercial growth around Cartersville. We handle larger-scale clearing, forestry mulching, and site development coordination for properties from a few acres to major parcels.",
    landscape:
      "Open agricultural land, wooded acreage, and rolling terrain suited to both traditional clearing and forestry mulching.",
    useCases: [
      "Agricultural land clearing and pasture reclamation",
      "Acreage forestry mulching on wooded parcels",
      "Commercial and development site prep near Cartersville",
    ],
    cities: ["cartersville"],
  },
];

export const cities: City[] = [
  { slug: "marietta", name: "Marietta", county: "cobb", approxMilesFromHQ: 0, context: "Marietta is our headquarters. We know these neighborhoods, soils, and permitting landscape firsthand and respond fast to local clearing and site-prep requests.", useCases: ["In-town lot clearing and additions", "Selective clearing on wooded Marietta properties", "Stump removal and cleanup"] },
  { slug: "kennesaw", name: "Kennesaw", county: "cobb", approxMilesFromHQ: 8, context: "Kennesaw's steady residential growth keeps demand high for lot clearing and builder site prep, all within quick reach of our Marietta base.", useCases: ["New-construction lot clearing", "Brush clearing on wooded lots", "Builder site prep"] },
  { slug: "acworth", name: "Acworth", county: "cobb", approxMilesFromHQ: 12, context: "From lakeside properties to growing subdivisions, Acworth projects range from selective clearing to full lot prep — all a short drive from our HQ.", useCases: ["Selective and lakeside-lot clearing", "Full lot prep for new builds", "Brush and undergrowth clearing"] },
  { slug: "smyrna", name: "Smyrna", county: "cobb", approxMilesFromHQ: 8, context: "Smyrna's mix of infill redevelopment and established lots means tight-access clearing and stump work close to home.", useCases: ["Infill lot clearing with tight access", "Stump removal", "Brush clearing"] },
  { slug: "atlanta", name: "Atlanta", county: "fulton", approxMilesFromHQ: 20, context: "Inside Atlanta, infill lots and redevelopment sites often mean tight access and careful debris handling — we scope and coordinate accordingly.", useCases: ["Tight-access infill lot clearing", "Redevelopment site prep", "Debris hauling in constrained sites"] },
  { slug: "alpharetta", name: "Alpharetta", county: "fulton", approxMilesFromHQ: 28, context: "North Fulton's Alpharetta blends upscale residential and commercial development, with wooded parcels being turned build-ready across the area.", useCases: ["Residential and estate lot clearing", "Builder and commercial site prep", "Selective clearing on wooded lots"] },
  { slug: "roswell", name: "Roswell", county: "fulton", approxMilesFromHQ: 25, context: "Roswell's mature tree cover and larger lots call for selective clearing and careful preservation of the trees homeowners want to keep.", useCases: ["Selective clearing on wooded lots", "Brush and undergrowth reclamation", "Stump removal"] },
  { slug: "sandy-springs", name: "Sandy Springs", county: "fulton", approxMilesFromHQ: 18, context: "Sandy Springs properties often combine slope, mature trees, and tight access — conditions we scope carefully before work begins.", useCases: ["Sloped-lot clearing and mulching", "Selective tree and brush clearing", "Grading coordination"] },
  { slug: "lawrenceville", name: "Lawrenceville", county: "gwinnett", approxMilesFromHQ: 35, context: "As Gwinnett's county seat, Lawrenceville sees steady residential and commercial development that keeps demand strong for lot clearing and site prep.", useCases: ["New-construction lot clearing", "Commercial and development site prep", "Brush clearing"] },
  { slug: "duluth", name: "Duluth", county: "gwinnett", approxMilesFromHQ: 33, context: "Duluth's growing corridors and wooded residential lots make it a regular service area for clearing and grading coordination.", useCases: ["Wooded lot clearing", "Grading coordination", "Brush and undergrowth clearing"] },
  { slug: "buford", name: "Buford", county: "gwinnett", approxMilesFromHQ: 40, context: "Buford's mix of lake-area properties and new development ranges from selective clearing to full site prep for builders.", useCases: ["Lake-area and wooded lot clearing", "Builder site prep", "Forestry mulching on larger parcels"] },
  { slug: "snellville", name: "Snellville", county: "gwinnett", approxMilesFromHQ: 38, context: "Snellville's established neighborhoods and wooded lots call for selective clearing, stump removal, and reclamation of overgrown parcels.", useCases: ["Selective lot clearing", "Stump removal", "Overgrowth reclamation"] },
  { slug: "canton", name: "Canton", county: "cherokee", approxMilesFromHQ: 25, context: "Canton anchors Cherokee County's blend of rural acreage and fast residential growth, with parcels ranging from a few acres to major tracts.", useCases: ["Acreage clearing and forestry mulching", "New-construction lot prep", "Pasture and firebreak clearing"] },
  { slug: "woodstock", name: "Woodstock", county: "cherokee", approxMilesFromHQ: 18, context: "Woodstock's rapid growth and wooded terrain make it a core area for lot clearing and forestry mulching on sloped, tree-covered parcels.", useCases: ["Wooded lot clearing", "Forestry mulching on slopes", "Builder site prep"] },
  { slug: "holly-springs", name: "Holly Springs", county: "cherokee", approxMilesFromHQ: 20, context: "Holly Springs combines newer subdivisions with wooded acreage, calling for both lot prep and selective clearing.", useCases: ["New-construction lot clearing", "Selective and brush clearing", "Stump removal"] },
  { slug: "dallas", name: "Dallas", county: "paulding", approxMilesFromHQ: 18, context: "Dallas anchors Paulding County's residential growth west of Marietta, with larger lots and expanding subdivisions needing clearing and grading.", useCases: ["Subdivision and lot clearing", "Grading coordination", "Brush reclamation on larger lots"] },
  { slug: "hiram", name: "Hiram", county: "paulding", approxMilesFromHQ: 15, context: "Hiram's mix of residential and commercial growth keeps demand steady for lot clearing and site prep close to Marietta.", useCases: ["Residential lot clearing", "Commercial site prep", "Brush clearing"] },
  { slug: "cartersville", name: "Cartersville", county: "bartow", approxMilesFromHQ: 30, context: "Cartersville anchors Bartow County's agricultural and commercial growth, with larger-scale clearing and development site prep common.", useCases: ["Agricultural and acreage clearing", "Commercial and development site prep", "Forestry mulching"] },
];

export function getCounty(slug: string) {
  return counties.find((c) => c.slug === slug);
}
export function getCity(slug: string) {
  return cities.find((c) => c.slug === slug);
}
export function citiesInCounty(countySlug: string) {
  return cities.filter((c) => c.county === countySlug);
}
