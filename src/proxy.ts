import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getClerkAuthorizedParties } from "@/lib/clerk";
import { rateLimitQueueStatus, rateLimitResponse } from "@/lib/rate-limit";

const isStaffRoute = createRouteMatcher(["/staff(.*)"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isSignUpRoute = createRouteMatcher(["/sign-up(.*)"]);
const isQueueStatusApi = createRouteMatcher(["/api/queue/status"]);

export default clerkMiddleware(
  async (auth, req) => {
    if (isSignUpRoute(req)) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    if (isQueueStatusApi(req)) {
      const ip =
        req.headers.get("x-real-ip") ??
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        "unknown";
      const limited = await rateLimitQueueStatus(ip);
      if (!limited.ok) {
        return rateLimitResponse(limited.retryAfterSec);
      }
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
