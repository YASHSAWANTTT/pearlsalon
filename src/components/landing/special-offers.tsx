import Link from "next/link";

const offers = [
  {
    label: "— FIRST VISIT",
    title: "The Welcome Ritual",
    description:
      "Complimentary express facial with any first booking. Let us introduce you to the Pearl experience.",
    highlight: "Free",
    footer: "New guests · One per person",
    featured: true,
  },
  {
    label: "MIDWEEK",
    title: "Quiet Tuesdays",
    description:
      "Enjoy a slower pace and deeper relaxation with 25% off select spa treatments every Tuesday.",
    highlight: "25%",
    footer: "Off select treatments",
    featured: false,
  },
  {
    label: "TOGETHER",
    title: "Duo Escape",
    description:
      "Two side-by-side massages with champagne and a shared relaxation lounge experience.",
    highlight: "$180",
    footer: "For two guests · Save $40",
    featured: false,
  },
];

export function SpecialOffers() {
  return (
    <section className="bg-secondary/40 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <p className="eyebrow">Limited time</p>
          <h2 className="mt-4 font-serif text-3xl font-light text-foreground sm:text-4xl md:text-5xl">
            Special <span className="italic text-primary">offers</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground">
            Treat yourself, or someone you love. These seasonal indulgences won&apos;t last long.
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
