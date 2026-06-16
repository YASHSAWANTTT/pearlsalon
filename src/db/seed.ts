import { config } from "dotenv";
import { eq } from "drizzle-orm";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { SALON_CONTACT, SALON_NAME } from "../lib/constants";
config({ path: ".env.local" });

async function run() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set in .env.local");

  const db = drizzle(neon(url), { schema: await import("./schema") });
  const { businessHours, salonSettings, services } = await import("./schema");
  const { buildSeedServices } = await import("../lib/salon-services");

  const seedServices = buildSeedServices();
  const reseedServices = process.argv.includes("--services");

  const defaultHours = [0, 1, 2, 3, 4, 5, 6].map((dayOfWeek) => ({
    dayOfWeek,
    openTime: "11:00",
    closeTime: "19:00",
    isClosed: false,
  }));

  if (reseedServices) {
    await db.delete(services);
    await db.insert(services).values(seedServices);
    console.log(`Seeded ${seedServices.length} services from rate card.`);
  }

  for (const hour of defaultHours) {
    await db
      .insert(businessHours)
      .values(hour)
      .onConflictDoUpdate({
        target: businessHours.dayOfWeek,
        set: {
          openTime: hour.openTime,
          closeTime: hour.closeTime,
          isClosed: hour.isClosed,
        },
      });
  }
  console.log("Updated business hours (11:00 AM – 7:00 PM daily).");

  const settingsData = {
    name: SALON_NAME,
    address: SALON_CONTACT.address,
    phone: SALON_CONTACT.phone,
    timezone: "Asia/Kolkata",
  };

  const existingSettings = await db.query.salonSettings.findFirst();
  if (existingSettings) {
    await db
      .update(salonSettings)
      .set(settingsData)
      .where(eq(salonSettings.id, existingSettings.id));
    console.log("Updated salon settings.");
  } else {
    await db.insert(salonSettings).values(settingsData);
    console.log("Inserted salon settings.");
  }

  console.log("Seed complete!");
}

run().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
