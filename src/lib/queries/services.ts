import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { services } from "@/db/schema";
import { SERVICE_CATEGORY_ORDER } from "@/lib/salon-services";

export async function getActiveServices() {
  return db.query.services.findMany({
    where: eq(services.isActive, true),
    orderBy: [asc(services.sortOrder), asc(services.name)],
  });
}

export async function getAllServices() {
  return db.query.services.findMany({
    orderBy: [asc(services.sortOrder), asc(services.name)],
  });
}

export async function getServiceById(id: string) {
  return db.query.services.findFirst({
    where: eq(services.id, id),
  });
}

export async function getServicesByCategory() {
  const all = await getActiveServices();
  const grouped = all.reduce(
    (acc, service) => {
      if (!acc[service.category]) acc[service.category] = [];
      acc[service.category].push(service);
      return acc;
    },
    {} as Record<string, typeof all>
  );

  const ordered: Record<string, typeof all> = {};
  for (const category of SERVICE_CATEGORY_ORDER) {
    if (grouped[category]) ordered[category] = grouped[category];
  }
  for (const [category, items] of Object.entries(grouped)) {
    if (!ordered[category]) ordered[category] = items;
  }
  return ordered;
}
