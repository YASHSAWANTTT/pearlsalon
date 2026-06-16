import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isStaffRoute = createRouteMatcher(["/staff(.*)"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isSignUpRoute = createRouteMatcher(["/sign-up(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isSignUpRoute(req)) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  if (isStaffRoute(req) || isAdminRoute(req)) {
    const { userId, sessionClaims } = await auth.protect();
    const role = (sessionClaims?.metadata as { role?: string })?.role;

    if (isAdminRoute(req) && role !== "admin") {
      return NextResponse.redirect(new URL("/staff", req.url));
    }

    if (isStaffRoute(req) && !role) {
      return NextResponse.redirect(
        new URL("/sign-in?error=unauthorized", req.url)
      );
    }

    if (!userId) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
