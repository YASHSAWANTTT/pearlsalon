import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { QueueStatusClient } from "@/components/queue/status-client";

export const metadata = { title: "Queue Status" };

export default async function QueueStatusPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return (
    <>
      <PublicHeader />
      <QueueStatusClient token={token} />
      <PublicFooter />
    </>
  );
}
