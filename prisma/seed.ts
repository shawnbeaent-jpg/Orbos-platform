// Seeds the database with the 27 real Metro Atlanta prospects already researched
// for the ORBOS CRM tracker (Companies tab). Run with: npx prisma db seed
import { PrismaClient, Priority, Status } from "@prisma/client";

const prisma = new PrismaClient();

type Row = {
  name: string;
  industry: string;
  address: string;
  city: string;
  phone: string;
  contactPerson: string;
  priority: Priority;
  estDealValueCents: number;
  notes: string;
  latitude: number;
  longitude: number;
};

const companies: Row[] = [
  { name: "Heartwood Powder Springs", industry: "Luxury Apartment Community", address: "4493 Brownsville Rd", city: "Powder Springs", phone: "470-970-3878", contactPerson: "Leasing Office", priority: "A", estDealValueCents: 190000, notes: "Large, high-rated community — strong turnover volume", latitude: 33.844946, longitude: -84.696045 },
  { name: "Springside at Powder Springs Apartments & Townhomes", industry: "Mid-Market Apartment Community", address: "4490 Marietta St", city: "Powder Springs", phone: "844-435-9357", contactPerson: "Leasing Office", priority: "B", estDealValueCents: 150000, notes: "Apartments + townhomes mix", latitude: 33.8601539, longitude: -84.6852583 },
  { name: "Crofthouse West Cobb Apartments", industry: "Luxury Apartment Community", address: "2830 Macedonia Rd", city: "Powder Springs", phone: "770-415-9034", contactPerson: "Leasing Office", priority: "A", estDealValueCents: 190000, notes: "Resort-style amenities, high review volume", latitude: 33.8721719, longitude: -84.63655 },
  { name: "Magnolia Commons Apartments", industry: "Mid-Market Apartment Community", address: "6737 Bill Carruth Pkwy", city: "Hiram", phone: "678-883-1079", contactPerson: "Property Manager", priority: "B", estDealValueCents: 150000, notes: "", latitude: 33.8822397, longitude: -84.733988 },
  { name: "The Columns at Hiram", industry: "Mid-Market Apartment Community", address: "6736 Bill Carruth Pkwy", city: "Hiram", phone: "770-767-0449", contactPerson: "Leasing Office", priority: "B", estDealValueCents: 150000, notes: "Large unit count", latitude: 33.8814924, longitude: -84.7323907 },
  { name: "Ilion", industry: "Luxury Apartment Community", address: "1960 Spectrum Cir", city: "Marietta", phone: "678-528-5588", contactPerson: "Leasing Office", priority: "B", estDealValueCents: 170000, notes: "Modern architectural community", latitude: 33.9071998, longitude: -84.468338 },
  { name: "The Apex Apartment Community Marietta", industry: "Mid-Market Apartment Community", address: "860 Franklin Gateway SE", city: "Marietta", phone: "770-436-7744", contactPerson: "Property Manager", priority: "C", estDealValueCents: 120000, notes: "Smaller community", latitude: 33.9320878, longitude: -84.4995125 },
  { name: "Aldridge at Town Village", industry: "Luxury Apartment Community", address: "3024 Hidden Forest Ct", city: "Marietta", phone: "470-938-3623", contactPerson: "Leasing Office", priority: "A", estDealValueCents: 190000, notes: "Very large community", latitude: 34.0245824, longitude: -84.563951 },
  { name: "Solis Kennesaw Apartments", industry: "Luxury Apartment Community", address: "3238 Hidden Forest Ct", city: "Marietta", phone: "470-740-9905", contactPerson: "Leasing Office", priority: "A", estDealValueCents: 190000, notes: "Markets itself explicitly as luxury", latitude: 34.0277191, longitude: -84.563516 },
  { name: "Belmont Place", industry: "Mid-Market Apartment Community", address: "2825 Windy Hill Rd SE", city: "Marietta", phone: "678-274-0550", contactPerson: "Property Manager", priority: "A", estDealValueCents: 190000, notes: "Very high unit count", latitude: 33.9047587, longitude: -84.4720445 },
  { name: "Hardy Springs", industry: "Senior Living Community", address: "705 Charles Hardy Pkwy", city: "Dallas", phone: "470-780-6157", contactPerson: "Executive Director", priority: "B", estDealValueCents: 140000, notes: "55+ cottage community", latitude: 33.9120738, longitude: -84.7763654 },
  { name: "Sterling Estates of West Cobb", industry: "Senior Living Community", address: "3165 Dallas Hwy", city: "Marietta", phone: "678-535-2892", contactPerson: "Executive Director", priority: "A", estDealValueCents: 180000, notes: "Assisted living + memory care", latitude: 33.9507026, longitude: -84.6451568 },
  { name: "Canterfield of Kennesaw", industry: "Senior Living Community", address: "4381 Bells Ferry Rd", city: "Kennesaw", phone: "470-308-5260", contactPerson: "Executive Director", priority: "B", estDealValueCents: 140000, notes: "Independent living, off I-575", latitude: 34.0592663, longitude: -84.5589093 },
  { name: "Arbor Terrace Burnt Hickory", industry: "Senior Living Community", address: "920 Burnt Hickory Rd NW", city: "Marietta", phone: "770-343-3870", contactPerson: "Executive Director", priority: "A", estDealValueCents: 180000, notes: "Includes memory care — high-frequency odor needs", latitude: 33.9540214, longitude: -84.5790523 },
  { name: "Winnwood Retirement Community", industry: "Senior Living Community", address: "100 Whitlock Ave NW", city: "Marietta", phone: "770-692-3963", contactPerson: "Executive Director", priority: "B", estDealValueCents: 140000, notes: "", latitude: 33.9536141, longitude: -84.5556327 },
  { name: "Gravity Motor Cars", industry: "Exotic Dealership", address: "468 Cobb Pkwy SE", city: "Marietta", phone: "404-620-2776", contactPerson: "General Manager", priority: "A", estDealValueCents: 240000, notes: "Porsche/Range Rover inventory", latitude: 33.9412212, longitude: -84.5158946 },
  { name: "Cobb Luxury Cars", industry: "Luxury Dealership", address: "1400 Atlanta Rd SE", city: "Marietta", phone: "770-575-0303", contactPerson: "General Manager", priority: "A", estDealValueCents: 220000, notes: "High-volume lot", latitude: 33.9183283, longitude: -84.5420196 },
  { name: "Georgia Luxury Cars", industry: "Luxury Dealership", address: "687 Cobb Pkwy SE South", city: "Marietta", phone: "478-280-4021", contactPerson: "General Manager", priority: "B", estDealValueCents: 200000, notes: "Escalade/high-end SUV specialty", latitude: 33.9353782, longitude: -84.511829 },
  { name: "Platinum Cars Marietta", industry: "Used Car Dealership", address: "1215 Cobb Pkwy SE", city: "Marietta", phone: "678-355-5222", contactPerson: "General Manager", priority: "B", estDealValueCents: 180000, notes: "", latitude: 33.9220475, longitude: -84.5040341 },
  { name: "Atlanta Autos", industry: "Exotic Dealership", address: "1001 Cobb Pkwy N", city: "Marietta", phone: "678-213-4455", contactPerson: "General Manager", priority: "A", estDealValueCents: 240000, notes: "Carries exotic inventory", latitude: 33.9740441, longitude: -84.5449322 },
  { name: "Gravity Autos Marietta", industry: "Luxury Dealership", address: "1830 Cobb Pkwy SE", city: "Marietta", phone: "404-999-6277", contactPerson: "General Manager", priority: "A", estDealValueCents: 220000, notes: "Sister lot to Gravity Motor Cars", latitude: 33.9085728, longitude: -84.4941151 },
  { name: "Hampton Inn and Suites Atlanta/Marietta", industry: "Hotel", address: "2136 Kingston Ct", city: "Marietta", phone: "678-460-1160", contactPerson: "General Manager", priority: "A", estDealValueCents: 180000, notes: "Branded chain", latitude: 33.9235104, longitude: -84.490278 },
  { name: "Drury Inn & Suites Atlanta Marietta", industry: "Hotel", address: "1170 Powers Ferry Pl", city: "Marietta", phone: "770-612-0900", contactPerson: "General Manager", priority: "A", estDealValueCents: 180000, notes: "High occupancy", latitude: 33.9232486, longitude: -84.4820437 },
  { name: "Extended Stay America Suites - Kennesaw Town Center", industry: "Extended-Stay Property", address: "3000 George Busbee Pkwy NW", city: "Kennesaw", phone: "770-422-1403", contactPerson: "General Manager", priority: "B", estDealValueCents: 150000, notes: "Reviews mention cleanliness/odor complaints", latitude: 34.0272211, longitude: -84.5675553 },
  { name: "Premier Extended Stay", industry: "Extended-Stay Property", address: "765 Cobb Pl Blvd NW", city: "Kennesaw", phone: "678-503-7200", contactPerson: "General Manager", priority: "C", estDealValueCents: 120000, notes: "", latitude: 34.00656, longitude: -84.567934 },
  { name: "Keyrenter Marietta Property Management", industry: "Property Management Company", address: "1685 Terrell Mill Road SE", city: "Marietta", phone: "404-800-1818", contactPerson: "Owner/Broker", priority: "B", estDealValueCents: 130000, notes: "Manages a portfolio of single-family rentals", latitude: 33.9107141, longitude: -84.4833534 },
  { name: "Avalon Property Management & Sales", industry: "Property Management Company", address: "3113 Roswell Rd Suite 101", city: "Marietta", phone: "770-971-0025", contactPerson: "Owner/Broker", priority: "A", estDealValueCents: 160000, notes: "Manages multiple properties", latitude: 33.9797667, longitude: -84.4610655 },
];

async function main() {
  console.log(`Seeding ${companies.length} companies...`);
  for (const c of companies) {
    await prisma.company.create({
      data: {
        name: c.name,
        industry: c.industry,
        address: c.address,
        city: c.city,
        phone: c.phone,
        contactPerson: c.contactPerson,
        priority: c.priority,
        status: "NEW_LEAD" as Status,
        estDealValueCents: c.estDealValueCents,
        latitude: c.latitude,
        longitude: c.longitude,
        notes: c.notes,
      },
    });
  }
  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
