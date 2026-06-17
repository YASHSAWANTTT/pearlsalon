import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { staffProfiles } from "@/db/schema";

function parseRole(value: unknown): "admin" | "staff" {
  return value === "admin" || value === "staff" ? value : "staff";
}

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    return new Response("Webhook secret not configured", { status: 500 });
  }

  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const body = await req.text();
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;
  try {
    evt = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  if (evt.type === "user.created" || evt.type === "user.updated") {
    const { id, first_name, last_name, email_addresses, public_metadata } =
      evt.data;

    const role = parseRole(public_metadata?.role);
    const displayName =
      [first_name, last_name].filter(Boolean).join(" ") ||
      email_addresses[0]?.email_address ||
      "Staff Member";

    const existing = await db.query.staffProfiles.findFirst({
      where: eq(staffProfiles.clerkUserId, id),
    });

    if (existing) {
      await db
        .update(staffProfiles)
        .set({
          displayName,
          email: email_addresses[0]?.email_address,
          role,
        })
        .where(eq(staffProfiles.clerkUserId, id));
    } else {
      await db
        .insert(staffProfiles)
        .values({
          clerkUserId: id,
          displayName,
          email: email_addresses[0]?.email_address,
          role,
        })
        .onConflictDoUpdate({
          target: staffProfiles.clerkUserId,
          set: {
            displayName,
            email: email_addresses[0]?.email_address,
            role,
          },
        });
    }
  }

  if (evt.type === "user.deleted") {
    const { id } = evt.data;
    if (id) {
      await db
        .update(staffProfiles)
        .set({ isActive: false })
        .where(eq(staffProfiles.clerkUserId, id));
    }
  }

  return new Response("OK", { status: 200 });
}
