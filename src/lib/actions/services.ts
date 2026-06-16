"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { services } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { serviceSchema } from "@/lib/validators/services";

export async function createService(formData: FormData) {
  await requireAdmin();

  const raw = {
    name: formData.get("name") as string,
    description: (formData.get("description") as string) || "",
    durationMinutes: formData.get("durationMinutes") as string,
    price: formData.get("price") as string,
    category: formData.get("category") as string,
    isActive: formData.get("isActive") === "true",
    sortOrder: (formData.get("sortOrder") as string) || "0",
  };

  const parsed = serviceSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  await db.insert(services).values({
    name: parsed.data.name,
    description: parsed.data.description,
    durationMinutes: parsed.data.durationMinutes,
    price: parsed.data.price.toFixed(2),
    category: parsed.data.category,
    isActive: parsed.data.isActive,
    sortOrder: parsed.data.sortOrder,
  });

  revalidatePath("/admin/services");
  revalidatePath("/services");
  return { success: true };
}

export async function updateService(formData: FormData) {
  await requireAdmin();

  const id = formData.get("id") as string;
  const raw = {
    name: formData.get("name") as string,
    description: (formData.get("description") as string) || "",
    durationMinutes: formData.get("durationMinutes") as string,
    price: formData.get("price") as string,
    category: formData.get("category") as string,
    isActive: formData.get("isActive") === "true",
    sortOrder: (formData.get("sortOrder") as string) || "0",
  };

  const parsed = serviceSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  await db
    .update(services)
    .set({
      name: parsed.data.name,
      description: parsed.data.description,
      durationMinutes: parsed.data.durationMinutes,
      price: parsed.data.price.toFixed(2),
      category: parsed.data.category,
      isActive: parsed.data.isActive,
      sortOrder: parsed.data.sortOrder,
    })
    .where(eq(services.id, id));

  revalidatePath("/admin/services");
  revalidatePath("/services");
  return { success: true };
}

export async function toggleServiceActive(id: string, isActive: boolean) {
  await requireAdmin();

  await db.update(services).set({ isActive }).where(eq(services.id, id));

  revalidatePath("/admin/services");
  revalidatePath("/services");
  return { success: true };
}

export async function deleteService(id: string) {
  await requireAdmin();

  await db.delete(services).where(eq(services.id, id));

  revalidatePath("/admin/services");
  revalidatePath("/services");
  return { success: true };
}
