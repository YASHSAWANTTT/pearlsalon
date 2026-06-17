import { auth, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { staffProfiles } from "@/db/schema";

export type UserRole = "admin" | "staff" | null;

export async function getRole(): Promise<UserRole> {
  const user = await currentUser();
  if (!user) return null;
  const role = user.publicMetadata?.role as string | undefined;
  if (role === "admin" || role === "staff") return role;
  return null;
}

async function assertActiveProfile(userId: string) {
  const profile = await db.query.staffProfiles.findFirst({
    where: eq(staffProfiles.clerkUserId, userId),
  });

  if (profile && !profile.isActive) {
    redirect("/sign-in?error=unauthorized");
  }
}

export async function requireAuth() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  return userId;
}

export async function requireStaff() {
  const userId = await requireAuth();
  const role = await getRole();
  if (!role) redirect("/sign-in?error=unauthorized");
  await syncStaffProfile();
  await assertActiveProfile(userId);
  return { userId, role };
}

export async function requireAdmin() {
  const userId = await requireAuth();
  const role = await getRole();
  if (role !== "admin") redirect("/staff");
  await syncStaffProfile();
  await assertActiveProfile(userId);
  return { userId, role };
}

export async function syncStaffProfile() {
  const user = await currentUser();
  if (!user) return null;

  const metaRole = user.publicMetadata?.role as string | undefined;
  const role =
    metaRole === "admin" || metaRole === "staff" ? metaRole : "staff";
  const displayName =
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.emailAddresses[0]?.emailAddress ||
    "Staff Member";
  const email = user.emailAddresses[0]?.emailAddress ?? null;

  const [profile] = await db
    .insert(staffProfiles)
    .values({
      clerkUserId: user.id,
      displayName,
      email,
      role,
    })
    .onConflictDoUpdate({
      target: staffProfiles.clerkUserId,
      set: {
        displayName,
        email,
        role,
      },
    })
    .returning();

  return profile;
}

export async function getStaffProfile() {
  const user = await currentUser();
  if (!user) return null;

  return db.query.staffProfiles.findFirst({
    where: eq(staffProfiles.clerkUserId, user.id),
  });
}
