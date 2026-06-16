import { Clock, ListOrdered, Smartphone } from "lucide-react";
import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { JoinQueueForm } from "@/components/queue/join-form";
import { getActiveServices } from "@/lib/queries/services";
import { isSalonOpenToday } from "@/lib/slots";

export const metadata = { title: "Join Walk-in Queue" };

export default async function QueuePage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const params = await searchParams;
  const [services, salonOpen] = await Promise.all([
    getActiveServices(),
    isSalonOpenToday(),
  ]);

  const highlights = [
    { icon: ListOrdered, text: "Take your place in line without standing around." },
    { icon: Smartphone, text: "Track your spot live from your phone — no app needed." },
    { icon: Clock, text: "We'll let you know when it's nearly your turn." },
  ];

  return (
    <>
      <PublicHeader />
      <main className="grain bg-background py-16 sm:py-20">
        <div className="mx-auto grid max-w-5xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-start lg:gap-14 xl:max-w-6xl xl:grid-cols-[minmax(0,1fr)_28rem] xl:gap-16">
          <aside className="reveal lg:sticky lg:top-24 lg:pt-2">
            <p className="eyebrow">Today</p>
            <h1 className="mt-4 font-serif text-4xl font-light leading-[1.05] tracking-tight text-foreground sm:text-5xl">
              Walk-in <span className="italic text-primary">queue</span>
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
              Join today&apos;s queue and we&apos;ll notify you when it&apos;s your turn.
            </p>

            <div className="rule-crimson mt-8" />

            <ul className="mt-8 space-y-5">
              {highlights.map(({ icon: Icon, text }) => (
                <li key={text} className="flex gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-primary">
                    <Icon className="h-4 w-4" strokeWidth={1.5} />
                  </span>
                  <p className="pt-1.5 text-sm leading-relaxed text-muted-foreground">{text}</p>
                </li>
              ))}
            </ul>
          </aside>

          <div
            className="reveal-item w-full rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6"
            style={{ ["--reveal-index" as string]: 1 }}
          >
            <h2 className="font-serif text-lg font-normal text-foreground">Your details</h2>
            <div className="mt-1 h-px w-full bg-border" />
            <div className="mt-5">
              <JoinQueueForm
                services={services}
                preselectedServiceId={params.service}
                salonOpen={salonOpen}
              />
            </div>
          </div>
        </div>
      </main>
      <PublicFooter />
    </>
  );
}
