import { z } from "zod";
import {
  propertyTypes,
  timelines,
  budgetBands,
  acreageBands,
  ownershipOptions,
} from "./leadScore";
import { services } from "./services";

const serviceSlugs = services.map((s) => s.slug) as [string, ...string[]];

// One schema shared by the client form and the API route (spec §6, §10).
export const leadSchema = z.object({
  // Step 1 — Contact (required)
  name: z.string().min(2, "Please enter your name").max(120),
  email: z.string().email("Enter a valid email"),
  phone: z
    .string()
    .min(7, "Enter a valid phone number")
    .max(25)
    .regex(/^[0-9()+\-.\s]+$/, "Enter a valid phone number"),
  smsConsent: z.boolean().default(false),

  // Step 2 — Property details
  address: z.string().max(200).optional().or(z.literal("")),
  city: z.string().max(120).optional().or(z.literal("")),
  county: z.string().max(120).optional().or(z.literal("")),
  propertyType: z.enum(propertyTypes).optional(),
  acreage: z.enum(acreageBands).optional(),
  access: z.string().max(300).optional().or(z.literal("")),

  // Step 3 — Services
  services: z.array(z.enum(serviceSlugs)).default([]),

  // Step 4 — Site conditions
  siteConditions: z.string().max(2000).optional().or(z.literal("")),

  // Step 5 — Uploads (client stores references; server records count/keys)
  uploadKeys: z.array(z.string().max(400)).max(20).default([]),

  // Step 6 — Qualification
  timeline: z.enum(timelines).optional(),
  budget: z.enum(budgetBands).optional(),
  ownership: z.enum(ownershipOptions).optional(),

  // Attribution / meta
  source: z.string().max(40).default("quote"),
  utmSource: z.string().max(120).optional().or(z.literal("")),
  utmMedium: z.string().max(120).optional().or(z.literal("")),
  utmCampaign: z.string().max(120).optional().or(z.literal("")),
  referrer: z.string().max(500).optional().or(z.literal("")),

  // Anti-spam honeypot — must stay empty.
  company_website: z.string().max(0).optional().or(z.literal("")),
});

export type LeadInput = z.infer<typeof leadSchema>;
