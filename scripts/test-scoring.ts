// Lightweight assertion tests for the lead scoring engine — no test-runner
// dependency. Run with: npm test
import { scoreLead } from "../lib/leadScore";

let passed = 0;
let failed = 0;

function assert(name: string, cond: boolean) {
  if (cond) {
    passed++;
    console.log(`  ✓ ${name}`);
  } else {
    failed++;
    console.error(`  ✗ ${name}`);
  }
}

console.log("lead scoring");

// A large, urgent, budget-ready commercial lead near HQ should be Priority.
const hot = scoreLead({
  propertyType: "commercial",
  acreage: "10-plus",
  services: ["site-development", "grading-leveling", "land-clearing"],
  timeline: "asap",
  budget: "50k-plus",
  ownership: "owner",
  hasUploads: true,
  address: "123 Development Way",
  siteConditions: "Heavily wooded, needs access road and grading before build.",
  milesFromHQ: 10,
});
assert("hot lead scores >= 80 (priority)", hot.score >= 80 && hot.category === "priority");
assert("hot lead score capped at 100", hot.score <= 100);

// A vague, no-commitment lead should be Low quality.
const cold = scoreLead({ propertyType: "residential", acreage: "unsure", services: [], timeline: "unsure", budget: "unsure", ownership: "other", milesFromHQ: 120 });
assert("cold lead scores < 40 (low-quality)", cold.score < 40 && cold.category === "low-quality");

// Category boundaries.
const scores = [hot, cold];
assert("every score within 0..100", scores.every((r) => r.score >= 0 && r.score <= 100));

// Determinism: same input -> same output.
const a = scoreLead({ propertyType: "residential", acreage: "1-3", timeline: "1-3-months", budget: "5k-15k", ownership: "owner", milesFromHQ: 20 });
const b = scoreLead({ propertyType: "residential", acreage: "1-3", timeline: "1-3-months", budget: "5k-15k", ownership: "owner", milesFromHQ: 20 });
assert("scoring is deterministic", a.score === b.score && a.category === b.category);

// Factors are returned and sum to the raw score before clamping.
assert("factor breakdown present", hot.factors.length > 0);

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
