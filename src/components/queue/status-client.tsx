"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatDuration } from "@/lib/constants";
import { BADGE_BASE, queueStatus } from "@/lib/status-badge";

type QueueStatus = {
  customerName: string;
  serviceName: string;
  durationMinutes: number;
  position: number;
  waitingAhead: number;
  status: string;
  lookupToken: string;
};

export function QueueStatusClient({ token }: { token: string }) {
  const [data, setData] = useState<QueueStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStatus() {
      const res = await fetch(`/api/queue/status?token=${token}`);
      if (!res.ok) {
        setError("Queue entry not found");
        return;
      }
      const json = await res.json();
      setData(json);
    }

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, [token]);

  const tone = data ? queueStatus(data.status) : null;
  const statusInfo = tone
    ? {
        ...tone,
        label: data!.status === "called" ? "Please come to the front!" : tone.label,
      }
    : null;

  return (
    <main className="grain bg-background py-20 sm:py-24">
      <div className="mx-auto max-w-lg px-4 sm:px-6">
        {error ? (
          <div className="reveal text-center">
            <h1 className="font-serif text-3xl font-light text-foreground">Not found</h1>
            <p className="mt-2 text-muted-foreground">{error}</p>
            <Button asChild className="mt-6 rounded-full">
              <Link href="/queue">Join Queue</Link>
            </Button>
          </div>
        ) : !data ? (
          <p className="text-center text-muted-foreground">Loading your queue status…</p>
        ) : (
          <div className="reveal text-center">
            <p className="eyebrow flex items-center justify-center">Live status</p>
            <h1 className="mt-3 font-serif text-4xl font-light tracking-tight text-foreground">
              Hi, {data.customerName.split(" ")[0]}
            </h1>

            {/* Live ticket */}
            <div className="relative mt-8 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <div className="flex items-center justify-between border-b border-dashed border-border px-6 py-4">
                <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  Pearl Queue
                </span>
                {statusInfo && (
                  <span className={`${BADGE_BASE} ${statusInfo.className}`}>{statusInfo.label}</span>
                )}
              </div>

              <div className="px-6 py-10">
                {data.status === "waiting" && (
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                      Your position
                    </p>
                    <p className="mt-2 font-serif text-7xl font-light leading-none text-primary">
                      #{data.position}
                    </p>
                    <p className="mt-4 text-foreground">
                      {data.waitingAhead === 0
                        ? "You're next!"
                        : `${data.waitingAhead} ${data.waitingAhead === 1 ? "person" : "people"} ahead of you`}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Est. wait ~
                      {formatDuration(
                        data.waitingAhead * data.durationMinutes || data.durationMinutes
                      )}
                    </p>
                  </div>
                )}

                {data.status === "called" && (
                  <p className="animate-pulse font-serif text-2xl text-primary">
                    Please proceed to the reception desk
                  </p>
                )}

                {!["waiting", "called"].includes(data.status) && statusInfo && (
                  <p className="font-serif text-2xl text-foreground">{statusInfo.label}</p>
                )}
              </div>

              <dl className="grid grid-cols-2 border-t border-dashed border-border text-left">
                <div className="border-r border-dashed border-border px-6 py-4">
                  <dt className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    Service
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-foreground">{data.serviceName}</dd>
                </div>
                <div className="px-6 py-4">
                  <dt className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    Token
                  </dt>
                  <dd className="mt-1 font-mono text-sm font-medium tracking-wider text-foreground">
                    {data.lookupToken}
                  </dd>
                </div>
              </dl>
            </div>

            <p className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              Refreshes automatically every 30 seconds
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
