import type { BusinessHour } from "@/db/schema";
import { buildLocalBusinessJsonLd } from "@/lib/seo";

type Props = {
  hours?: BusinessHour[];
};

export function LocalBusinessJsonLd({ hours }: Props) {
  const data = buildLocalBusinessJsonLd(hours);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
