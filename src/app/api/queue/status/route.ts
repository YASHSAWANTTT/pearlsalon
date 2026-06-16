import { NextResponse } from "next/server";
import { getQueueEntryByToken, getWaitingAhead } from "@/lib/queries/queue";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Token required" }, { status: 400 });
  }

  const result = await getQueueEntryByToken(token);
  if (!result) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const waitingAhead =
    result.entry.status === "waiting"
      ? await getWaitingAhead(result.entry.queueDate, result.entry.position)
      : 0;

  return NextResponse.json({
    customerName: result.entry.customerName,
    serviceName: result.service.name,
    durationMinutes: result.service.durationMinutes,
    position: result.entry.position,
    waitingAhead,
    status: result.entry.status,
    lookupToken: result.entry.lookupToken,
  });
}
