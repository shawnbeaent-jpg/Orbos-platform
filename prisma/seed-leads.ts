// Demo lead seed for GA Land Clearing — populates the admin pipeline with a few
// realistic-but-clearly-fictional leads so the dashboard isn't empty in a demo.
// Requires DATABASE_URL. Run with: npm run seed:leads
import { PrismaClient } from "@prisma/client";
import { scoreLead } from "../lib/leadScore";

const prisma = new PrismaClient();

function publicId(n: number) {
  return `GLC-DEMO${String(n).padStart(2, "0")}`;
}

const demos = [
  { name: "Sample Homeowner", email: "demo1@example.com", phone: "4705550101", city: "Marietta", county: "Cobb", propertyType: "residential" as const, acreage: "1-3" as const, services: ["brush-clearing", "stump-removal"], timeline: "1-3-months" as const, budget: "5k-15k" as const, ownership: "owner" as const, stage: "NEW" as const, milesFromHQ: 0 },
  { name: "Sample Builder Co.", email: "demo2@example.com", phone: "4705550102", city: "Canton", county: "Cherokee", propertyType: "commercial" as const, acreage: "10-plus" as const, services: ["site-development", "grading-leveling", "land-clearing"], timeline: "asap" as const, budget: "50k-plus" as const, ownership: "owner" as const, stage: "QUALIFIED" as const, milesFromHQ: 25 },
  { name: "Sample Investor", email: "demo3@example.com", phone: "4705550103", city: "Dallas", county: "Paulding", propertyType: "agricultural" as const, acreage: "3-10" as const, services: ["forestry-mulching"], timeline: "3-6-months" as const, budget: "15k-50k" as const, ownership: "under-contract" as const, stage: "SITE_VISIT" as const, milesFromHQ: 18 },
];

async function main() {
  for (let i = 0; i < demos.length; i++) {
    const d = demos[i];
    const { score, category, factors } = scoreLead({ ...d, hasUploads: false, address: `${d.city}, GA` });
    const cat = { priority: "PRIORITY", qualified: "QUALIFIED", "needs-review": "NEEDS_REVIEW", "low-quality": "LOW_QUALITY" }[category] as
      | "PRIORITY" | "QUALIFIED" | "NEEDS_REVIEW" | "LOW_QUALITY";
    await prisma.lead.upsert({
      where: { publicId: publicId(i + 1) },
      update: {},
      create: {
        publicId: publicId(i + 1),
        name: d.name,
        email: d.email,
        phone: d.phone,
        city: d.city,
        county: d.county,
        propertyType: d.propertyType,
        acreage: d.acreage,
        services: JSON.stringify(d.services),
        timeline: d.timeline,
        budget: d.budget,
        ownership: d.ownership,
        source: "seed",
        score,
        category: cat,
        scoreFactors: JSON.stringify(factors),
        stage: d.stage,
        tasks: { create: { title: `Follow up with ${d.name}` } },
      },
    });
    console.log(`seeded ${publicId(i + 1)} — ${d.name} (${score}/${category})`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
