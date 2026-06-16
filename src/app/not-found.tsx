import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PublicHeader } from "@/components/layout/public-header";

export default function NotFound() {
  return (
    <>
      <PublicHeader />
      <main className="grain flex flex-1 flex-col items-center justify-center bg-background px-4 py-28 text-center">
        <div className="reveal">
          <p className="eyebrow flex items-center justify-center">Lost the thread</p>
          <h1 className="mt-4 font-serif text-7xl font-light tracking-tight text-primary sm:text-8xl">
            404
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            We couldn&apos;t find the page you were looking for.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild className="rounded-full">
              <Link href="/">Back to Home</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/services">View Menu</Link>
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
