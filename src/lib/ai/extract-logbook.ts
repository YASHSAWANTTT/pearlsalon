import type { Service } from "@/db/schema";
import { SALON_NAME } from "@/lib/constants";

export type ExtractedLogItem = {
  logDate: string;
  customerName: string | null;
  serviceName: string;
  amount: number;
  entryType: "revenue" | "expense";
  serviceId: string | null;
  matchedServiceName: string | null;
};

type RawExtractedItem = {
  logDate?: string;
  customerName?: string;
  serviceName?: string;
  amount?: number;
  entryType?: string;
};

function normalizeName(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9+]/g, "");
}

function matchService(serviceName: string, services: Service[]): Service | null {
  const target = normalizeName(serviceName);
  if (!target) return null;

  const exact = services.find((s) => normalizeName(s.name) === target);
  if (exact) return exact;

  const partial = services.find((s) => {
    const name = normalizeName(s.name);
    return name.includes(target) || target.includes(name);
  });
  return partial ?? null;
}

export function enrichExtractedItems(
  items: RawExtractedItem[],
  services: Service[],
  defaultDate: string
): ExtractedLogItem[] {
  return items
    .filter((item) => item.serviceName && item.amount != null && item.amount > 0)
    .map((item) => {
      const serviceName = item.serviceName!.trim();
      const matched = matchService(serviceName, services);
      return {
        logDate: item.logDate ?? defaultDate,
        customerName: item.customerName?.trim() || null,
        serviceName,
        amount: Math.round(item.amount!),
        entryType: item.entryType === "expense" ? "expense" : "revenue",
        serviceId: matched?.id ?? null,
        matchedServiceName: matched?.name ?? null,
      };
    });
}

export async function extractLogbookFromImage(
  base64: string,
  mimeType: string,
  defaultDate: string,
  services: Service[]
) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY is not configured. Add it to .env.local to scan logbook photos."
    );
  }

  const serviceList = services
    .slice(0, 80)
    .map((s) => `${s.name} (₹${parseFloat(s.price)})`)
    .join("\n");

  const prompt = `You are reading a handwritten salon logbook photo for ${SALON_NAME} salon in India.

The page is a table. Columns are usually: Name | Service | Cash | GP (GPay).
Each customer row may list one or more services and an amount written in EITHER the Cash or the GP column.

Extract every customer service row and its total price in INR.

Known services (use these names when possible):
${serviceList}

Return strict JSON only, no markdown:
{
  "items": [
    {
      "logDate": "YYYY-MM-DD",
      "customerName": "string",
      "serviceName": "string",
      "amount": 0,
      "entryType": "revenue"
    }
  ]
}

Rules:
- customerName is the name written in the Name column for that row (e.g. "Zainab", "Aditi"). If no name is readable, use an empty string.
- amount is the number written for that row in the Cash OR GP column (whichever has a value). Never include currency symbols.
- combine the services on a single customer row into one serviceName (e.g. "Eye + Forehead + Uplips").
- entryType is "revenue" for customer services/charges, "expense" for costs/supplies.
- the date is often written at the top of the page in DD/MM/YY form (e.g. 12/6/26 means 2026-06-12). Use it for every row. If unreadable, use "${defaultDate}".
- skip blank lines, column headings, and the totals rows at the bottom (e.g. "Cash-220", "GPay-1340", "Total-2050").
- include every individual customer row you can read.`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60_000);

  let response: Response;
  try {
    response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You are an OCR assistant. You read handwritten salon logbooks and respond ONLY with a valid JSON object matching the requested schema. Never include prose, markdown, or code fences.",
          },
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: { url: `data:${mimeType};base64,${base64}`, detail: "high" },
              },
            ],
          },
        ],
        max_tokens: 2000,
      }),
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(
        "The AI scan timed out. Try a smaller or clearer photo and scan again."
      );
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`AI scan failed: ${error.slice(0, 200)}`);
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };

  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("AI returned an empty response.");

  let parsed: { items?: RawExtractedItem[] };
  try {
    parsed = JSON.parse(content) as { items?: RawExtractedItem[] };
  } catch {
    const match = content.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error("AI did not return valid JSON. Please try scanning again.");
    }
    parsed = JSON.parse(match[0]) as { items?: RawExtractedItem[] };
  }

  const items = enrichExtractedItems(parsed.items ?? [], services, defaultDate);

  if (items.length === 0) {
    throw new Error(
      "No service lines were found in the photo. Try a clearer, well-lit image."
    );
  }

  return items;
}
