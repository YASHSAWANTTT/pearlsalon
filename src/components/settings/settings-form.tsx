"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateSalonSettings, updateBusinessHours } from "@/lib/actions/settings";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

type Settings = {
  name: string;
  address: string | null;
  phone: string | null;
  timezone: string;
};

type Hour = {
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
};

export function SettingsForm({
  settings,
  hours,
}: {
  settings: Settings;
  hours: Hour[];
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-lg font-normal">Salon Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              startTransition(async () => {
                await updateSalonSettings(new FormData(e.currentTarget));
                toast.success("Settings saved");
              });
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="name">Salon Name</Label>
              <Input id="name" name="name" defaultValue={settings.name} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea id="address" name="address" defaultValue={settings.address ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" defaultValue={settings.phone ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input id="timezone" name="timezone" defaultValue={settings.timezone} />
            </div>
            <Button type="submit" disabled={isPending}>Save Salon Info</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-lg font-normal">Business Hours</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              startTransition(async () => {
                await updateBusinessHours(new FormData(e.currentTarget));
                toast.success("Hours saved");
              });
            }}
            className="space-y-3"
          >
            {DAY_NAMES.map((day, i) => {
              const h = hours.find((hr) => hr.dayOfWeek === i);
              return (
                <div key={day} className="flex items-center gap-3 text-sm">
                  <span className="w-24 font-medium">{day}</span>
                  <input
                    type="checkbox"
                    name={`closed_${i}`}
                    defaultChecked={h?.isClosed}
                    id={`closed_${i}`}
                  />
                  <Label htmlFor={`closed_${i}`} className="w-12 text-xs text-muted-foreground">Closed</Label>
                  <Input
                    name={`open_${i}`}
                    type="time"
                    defaultValue={h?.openTime?.slice(0, 5) ?? "09:00"}
                    className="w-28"
                  />
                  <span className="text-muted-foreground">–</span>
                  <Input
                    name={`close_${i}`}
                    type="time"
                    defaultValue={h?.closeTime?.slice(0, 5) ?? "17:00"}
                    className="w-28"
                  />
                </div>
              );
            })}
            <Button type="submit" disabled={isPending} className="mt-4">Save Hours</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
