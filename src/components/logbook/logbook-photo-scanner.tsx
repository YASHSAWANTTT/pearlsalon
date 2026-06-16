"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Camera, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { bulkCreateLogEntries } from "@/lib/actions/logbook";
import { formatPrice } from "@/lib/constants";

type ScannedItem = {
  logDate: string;
  entryType: "revenue" | "expense";
  customerName: string | null;
  description: string;
  amount: number;
  serviceId: string | null;
};

type Props = {
  logDate: string;
  onSaved: () => void;
};

export function LogbookPhotoScanner({ logDate, onSaved }: Props) {
  const [isScanning, setIsScanning] = useState(false);
  const [isSaving, startSave] = useTransition();
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [items, setItems] = useState<ScannedItem[]>([]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setPhotoUrl(null);
    setItems([]);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 90_000);

    try {
      const formData = new FormData();
      formData.set("photo", file);
      formData.set("logDate", logDate);

      const res = await fetch("/api/logbook/extract", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Scan failed");

      setPhotoUrl(data.photoUrl);
      setItems(
        data.items.map((item: ScannedItem) => ({
          logDate: item.logDate || logDate,
          entryType: item.entryType,
          customerName: item.customerName ?? "",
          description: item.description,
          amount: item.amount,
          serviceId: item.serviceId,
        }))
      );
      toast.success(`Found ${data.items.length} entries — review before saving`);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        toast.error("Scan timed out. Try a smaller or clearer photo.");
      } else {
        toast.error(error instanceof Error ? error.message : "Scan failed");
      }
    } finally {
      clearTimeout(timeout);
      setIsScanning(false);
      e.target.value = "";
    }
  }

  function updateItem(index: number, patch: Partial<ScannedItem>) {
    setItems((current) =>
      current.map((item, i) => (i === index ? { ...item, ...patch } : item))
    );
  }

  function removeItem(index: number) {
    setItems((current) => current.filter((_, i) => i !== index));
  }

  function handleSave() {
    if (items.length === 0) {
      toast.error("No entries to save");
      return;
    }

    startSave(async () => {
      const result = await bulkCreateLogEntries({
        logDate,
        photoUrl: photoUrl ?? undefined,
        items,
      });

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(`Added ${result.count} entries from photo`);
      setPhotoUrl(null);
      setItems([]);
      onSaved();
    });
  }

  const previewTotal = items.reduce((sum, item) => {
    return item.entryType === "revenue" ? sum + item.amount : sum - item.amount;
  }, 0);

  return (
    <div className="space-y-4 rounded-lg border border-dashed border-primary/30 bg-primary/5 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-serif text-lg text-foreground">Scan written logbook</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload a photo of your handwritten book. AI will read the date, service, and price for each line.
          </p>
        </div>
        <label className="shrink-0">
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileChange}
            disabled={isScanning}
          />
          <Button type="button" variant="outline" disabled={isScanning} asChild>
            <span className="cursor-pointer">
              {isScanning ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Camera className="mr-2 h-4 w-4" />
              )}
              {isScanning ? "Scanning…" : "Upload photo"}
            </span>
          </Button>
        </label>
      </div>

      {photoUrl && (
        <div className="grid gap-4 lg:grid-cols-[180px_1fr]">
          <div className="relative aspect-[3/4] overflow-hidden rounded-lg border border-border bg-card">
            <Image
              src={photoUrl}
              alt="Uploaded logbook"
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">
                Review extracted entries ({items.length})
              </p>
              <p className="text-sm text-muted-foreground">
                Net total:{" "}
                <span className="font-semibold text-foreground">
                  {formatPrice(previewTotal)}
                </span>
              </p>
            </div>

            <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="grid gap-2 rounded-lg border border-border bg-card p-3 sm:grid-cols-[120px_1fr_100px_36px]"
                >
                  <Input
                    value={item.customerName ?? ""}
                    placeholder="Name"
                    onChange={(e) => updateItem(index, { customerName: e.target.value })}
                  />
                  <Input
                    value={item.description}
                    placeholder="Service"
                    onChange={(e) => updateItem(index, { description: e.target.value })}
                  />
                  <Input
                    type="number"
                    min="0"
                    value={item.amount}
                    onChange={(e) =>
                      updateItem(index, { amount: Number(e.target.value) || 0 })
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(index)}
                    aria-label="Remove entry"
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              ))}
            </div>

            <Button
              onClick={handleSave}
              disabled={isSaving || items.length === 0}
            >
              {isSaving ? "Saving…" : `Save ${items.length} entries`}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
