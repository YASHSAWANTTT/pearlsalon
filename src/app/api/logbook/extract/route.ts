import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { extractLogbookFromImage } from "@/lib/ai/extract-logbook";
import { getRole } from "@/lib/auth";
import { getActiveServices } from "@/lib/queries/services";
import { rateLimitLogbookExtract } from "@/lib/rate-limit";
import { readLogbookImage } from "@/lib/uploads/logbook";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = await getRole();
  if (!role) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const limited = await rateLimitLogbookExtract(userId);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Scan limit reached. Please try again later." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("photo");
    const logDate = (formData.get("logDate") as string) || new Date().toISOString().slice(0, 10);

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Photo is required" }, { status: 400 });
    }

    const [{ buffer, mime }, services] = await Promise.all([
      readLogbookImage(file),
      getActiveServices(),
    ]);

    const base64 = buffer.toString("base64");
    const items = await extractLogbookFromImage(base64, mime, logDate, services);

    return NextResponse.json({
      items: items.map((item) => ({
        logDate: item.logDate,
        entryType: item.entryType,
        customerName: item.customerName,
        description: item.matchedServiceName ?? item.serviceName,
        amount: item.amount,
        serviceId: item.serviceId,
        serviceName: item.serviceName,
        matchedServiceName: item.matchedServiceName,
      })),
    });
  } catch {
    return NextResponse.json({ error: "Scan failed" }, { status: 500 });
  }
}
