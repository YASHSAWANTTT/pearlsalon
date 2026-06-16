import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { extractLogbookFromImage } from "@/lib/ai/extract-logbook";
import { getRole } from "@/lib/auth";
import { getActiveServices } from "@/lib/queries/services";
import { saveLogbookPhoto } from "@/lib/uploads/logbook";

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

  try {
    const formData = await req.formData();
    const file = formData.get("photo");
    const logDate = (formData.get("logDate") as string) || new Date().toISOString().slice(0, 10);

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Photo is required" }, { status: 400 });
    }

    const [photoUrl, services] = await Promise.all([
      saveLogbookPhoto(file),
      getActiveServices(),
    ]);

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");
    const mimeType = file.type || "image/jpeg";

    const items = await extractLogbookFromImage(base64, mimeType, logDate, services);

    return NextResponse.json({
      photoUrl,
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
  } catch (error) {
    const message = error instanceof Error ? error.message : "Scan failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
