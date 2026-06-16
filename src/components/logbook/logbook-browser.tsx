"use client";

import { useState } from "react";
import { format, subDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/constants";

type LogRow = {
  id: string;
  logDate: string;
  entryType: string;
  customerName: string | null;
  description: string;
  amount: string | null;
  staffName: string | null;
};

export function LogbookBrowser({ initialEntries }: { initialEntries: LogRow[] }) {
  const [entries, setEntries] = useState(initialEntries);
  const [startDate, setStartDate] = useState(format(subDays(new Date(), 7), "yyyy-MM-dd"));
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    setLoading(true);
    const res = await fetch(`/api/logbook?start=${startDate}&end=${endDate}`);
    const data = await res.json();
    setEntries(data.entries);
    setLoading(false);
  }

  function exportCsv() {
    const headers = ["Date", "Type", "Customer", "Description", "Amount", "Staff"];
    const rows = entries.map((e) => [
      e.logDate, e.entryType, e.customerName ?? "", e.description, e.amount ?? "", e.staffName ?? "",
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `logbook-${startDate}-${endDate}.csv`;
    a.click();
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-4 items-end">
        <div className="space-y-2">
          <Label>Start Date</Label>
          <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>End Date</Label>
          <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
        <Button onClick={handleSearch} disabled={loading}>
          {loading ? "Loading…" : "Search"}
        </Button>
        <Button variant="outline" onClick={exportCsv} disabled={entries.length === 0}>
          Export CSV
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Staff</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                No entries found.
              </TableCell>
            </TableRow>
          ) : (
            entries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell className="tabular-nums">{entry.logDate}</TableCell>
                <TableCell className="capitalize">{entry.entryType}</TableCell>
                <TableCell>{entry.customerName ?? "—"}</TableCell>
                <TableCell>{entry.description}</TableCell>
                <TableCell className="tabular-nums">{entry.amount ? formatPrice(entry.amount) : "—"}</TableCell>
                <TableCell className="text-muted-foreground">{entry.staffName ?? "—"}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      </div>
    </div>
  );
}
