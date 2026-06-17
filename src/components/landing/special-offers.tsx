import Link from "next/link";

const offers = [
  {
    label: "WEEKDAY MORNINGS",
    title: "Morning Special",
    description:
      "20% off all waxing services when you visit between 11 AM and 2 PM, Monday through Friday.",
    highlight: "20%",
    footer: "11 AM – 2 PM · All waxing services",
    featured: false,
  },
  {
    label: "TUESDAY",
    title: "Tuesday Glow Deal",
    description:
      "Fruit Facial + Face Bleach bundled together — glowing skin at a sweeter price.",
    highlight: "₹799",
    footer: "Usually ₹900 · Tuesdays only",
    featured: true,
  },
  {
    label: "COMBO",
    title: "Full Glam",
    description:
      "Facial, waxing, and threading in one visit — 15% off when you book the complete package.",
    highlight: "15%",
    footer: "Facial + waxing + threading",
    featured: false,
  },
];

export function SpecialOffers() {
  return (
    <section className="bg-secondary/40 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <p className="eyebrow">Current offers</p>
          <h2 className="mt-4 font-serif text-3xl font-light text-foreground sm:text-4xl md:text-5xl">
            Special <span className="italic text-primary">offers</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground">
            Thoughtful savings on the treatments you love most. Mention your offer when you book or
            check in.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:mt-14 sm:gap-6 md:grid-cols-3">
          {offers.map((offer) => (
            <article
              key={offer.title}
              className={`flex flex-col rounded-2xl p-6 shadow-sm sm:p-8 ${
                offer.featured
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card text-foreground"
              }`}
            >
              <p
                className={`text-[11px] font-medium uppercase tracking-[0.2em] ${
                  offer.featured ? "text-primary-foreground/70" : "text-primary"
                }`}
              >
                {offer.label}
              </p>
              <h3 className="mt-4 font-serif text-2xl">{offer.title}</h3>
              <p
                className={`mt-3 flex-1 text-sm leading-relaxed ${
                  offer.featured ? "text-primary-foreground/80" : "text-muted-foreground"
                }`}
              >
                {offer.description}
              </p>
              <p
                className={`mt-6 font-serif text-4xl sm:text-5xl ${
                  offer.featured ? "text-primary-foreground" : "text-primary"
                }`}
              >
                {offer.highlight}
              </p>
              <div
                className={`mt-6 border-t pt-4 text-xs ${
                  offer.featured
                    ? "border-primary-foreground/20 text-primary-foreground/60"
                    : "border-border text-muted-foreground"
                }`}
              >
                {offer.footer}
              </div>
            </article>
          ))}
        </div>

        <article className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm sm:mt-8 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-primary">
                Refer a friend
              </p>
              <h3 className="mt-3 font-serif text-2xl text-foreground">
                You both get 10% off
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Bring a friend to Pearl — you each receive 10% off your visit. Word of mouth in
                Dhokali and Thane is powerful, and it costs you nothing upfront.
              </p>
            </div>
            <p className="shrink-0 font-serif text-4xl text-primary sm:text-5xl">10%</p>
          </div>
        </article>

        <div className="mt-10 text-center">
          <Link
            href="/book"
            className="inline-flex items-center rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Reserve a Time
          </Link>
        </div>
      </div>
    </section>
  );
}
