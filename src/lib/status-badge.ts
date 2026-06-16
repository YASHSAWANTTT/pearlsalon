/**
 * Single source of truth for status badge styling across appointments and queue.
 * Refined, muted tones that stay meaningful but cohesive with the crimson system.
 */

export type StatusTone = {
  className: string;
  label: string;
};

const APPOINTMENT_TONES: Record<string, StatusTone> = {
  pending: {
    className:
      "bg-amber-50 text-amber-700 ring-1 ring-amber-200/70 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-800/60",
    label: "Pending",
  },
  confirmed: {
    className:
      "bg-sky-50 text-sky-700 ring-1 ring-sky-200/70 dark:bg-sky-950/40 dark:text-sky-300 dark:ring-sky-800/60",
    label: "Confirmed",
  },
  checked_in: {
    className:
      "bg-violet-50 text-violet-700 ring-1 ring-violet-200/70 dark:bg-violet-950/40 dark:text-violet-300 dark:ring-violet-800/60",
    label: "Checked in",
  },
  completed: {
    className:
      "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/70 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-800/60",
    label: "Completed",
  },
  cancelled: {
    className: "bg-muted text-muted-foreground ring-1 ring-border",
    label: "Cancelled",
  },
  no_show: {
    className:
      "bg-rose-50 text-rose-700 ring-1 ring-rose-200/70 dark:bg-rose-950/40 dark:text-rose-300 dark:ring-rose-800/60",
    label: "No show",
  },
};

const QUEUE_TONES: Record<string, StatusTone> = {
  waiting: {
    className:
      "bg-amber-50 text-amber-700 ring-1 ring-amber-200/70 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-800/60",
    label: "Waiting",
  },
  called: {
    className:
      "bg-primary/10 text-primary ring-1 ring-primary/25 dark:bg-primary/20 dark:text-primary dark:ring-primary/40",
    label: "Called",
  },
  in_service: {
    className:
      "bg-sky-50 text-sky-700 ring-1 ring-sky-200/70 dark:bg-sky-950/40 dark:text-sky-300 dark:ring-sky-800/60",
    label: "In service",
  },
  completed: {
    className:
      "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/70 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-800/60",
    label: "Done",
  },
  left: {
    className: "bg-muted text-muted-foreground ring-1 ring-border",
    label: "Left",
  },
};

const FALLBACK: StatusTone = {
  className: "bg-muted text-muted-foreground ring-1 ring-border",
  label: "Unknown",
};

function humanize(status: string) {
  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function appointmentStatus(status: string): StatusTone {
  return APPOINTMENT_TONES[status] ?? { ...FALLBACK, label: humanize(status) };
}

export function queueStatus(status: string): StatusTone {
  return QUEUE_TONES[status] ?? { ...FALLBACK, label: humanize(status) };
}

export const BADGE_BASE =
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide";
