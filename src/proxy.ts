import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getClerkAuthorizedParties } from "@/lib/clerk";

const isStaffRoute = createRouteMatcher(["/staff(.*)"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isSignUpRoute = createRouteMatcher(["/sign-up(.*)"]);

export default clerkMiddleware(
  async (auth, req) => {
    if (isSignUpRoute(req)) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    if (isStaffRoute(req) || isAdminRoute(req)) {
      await auth.protect();
    }
  },
  {
    authorizedParties: getClerkAuthorizedParties(),
  }
);

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
