import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getRole } from "@/lib/auth";
import { getLogEntriesByRange } from "@/lib/queries/logbook";

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = await getRole();
  if (!role) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  if (!start || !end) {
    return NextResponse.json({ error: "start and end required" }, { status: 400 });
  }

  const entries = await getLogEntriesByRange(start, end);

  return NextResponse.json({
    entries: entries.map(({ entry, staff }) => ({
      id: entry.id,
      logDate: entry.logDate,
      entryType: entry.entryType,
      customerName: entry.customerName,
      description: entry.description,
      amount: entry.amount,
      staffName: staff?.displayName ?? null,
    })),
  });
}
