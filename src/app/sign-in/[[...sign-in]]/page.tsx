import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { SignInSignOut } from "@/components/auth/sign-in-sign-out";
import { SALON_NAME } from "@/lib/constants";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function SignInPage({ searchParams }: Props) {
  const params = await searchParams;
  const unauthorized = params.error === "unauthorized";

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Crimson brand panel */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-primary px-12 py-14 text-primary-foreground lg:flex">
        <div className="grain absolute inset-0 opacity-100" />
        <Link
          href="/"
          className="relative z-10 text-xs font-medium uppercase tracking-[0.18em] text-primary-foreground/70 transition-colors hover:text-primary-foreground"
        >
          ← Back to website
        </Link>
        <div className="relative z-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-primary-foreground/70">
            {SALON_NAME}
          </p>
          <h2 className="mt-6 max-w-sm font-serif text-4xl font-light leading-[1.1]">
            The team portal, kept calm and in order.
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-primary-foreground/75">
            Manage appointments, the walk-in queue, and the daily logbook — all in
            one quiet place.
          </p>
        </div>
        <p className="relative z-10 text-xs text-primary-foreground/60">
          © {new Date().getFullYear()} {SALON_NAME}
        </p>
      </aside>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-background px-4 py-16">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <p className="eyebrow flex items-center justify-center lg:hidden">
              {SALON_NAME}
            </p>
            <h1 className="mt-3 font-serif text-3xl font-light tracking-tight text-foreground">
              Staff login
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Restricted access — authorized team members only.
            </p>
          </div>

          {unauthorized && (
            <div className="mb-6 rounded-lg border border-amber-200/70 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              <p className="font-medium">Access not authorized</p>
              <p className="mt-1 text-amber-800">
                This account does not have staff access. Contact your salon admin if
                you need portal access.
              </p>
              <p className="mt-2 text-amber-800">
                If your role was just updated in Clerk, sign out and sign in again
                so your session picks up the change.
              </p>
              <SignInSignOut variant="banner" />
              <Link href="/" className="mt-3 inline-block text-amber-900 underline">
                Back to salon website
              </Link>
            </div>
          )}

          <SignIn
            forceRedirectUrl="/staff"
            fallbackRedirectUrl="/staff"
            signUpUrl="/sign-in"
            appearance={{
              elements: {
                rootBox: "mx-auto w-full",
                card: "shadow-sm border border-border bg-card",
                footer: { display: "none" },
                footerAction: { display: "none" },
                footerActionLink: { display: "none" },
              },
              variables: {
                colorPrimary: "#8E1B2E",
              },
            }}
          />

          <div className="mt-4 flex justify-center">
            <SignInSignOut />
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground lg:hidden">
            <Link href="/" className="hover:text-foreground">
              ← Back to website
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
