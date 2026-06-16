"use client";

import { SignOutButton, useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

type Props = {
  variant?: "banner" | "inline";
};

export function SignInSignOut({ variant = "inline" }: Props) {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) return null;

  return (
    <SignOutButton redirectUrl="/sign-in">
      <Button
        type="button"
        variant={variant === "banner" ? "outline" : "ghost"}
        size="sm"
        className={
          variant === "banner"
            ? "mt-3 w-full border-amber-300 bg-white text-amber-950 hover:bg-amber-100"
            : "text-muted-foreground hover:text-foreground"
        }
      >
        Sign out
      </Button>
    </SignOutButton>
  );
}
