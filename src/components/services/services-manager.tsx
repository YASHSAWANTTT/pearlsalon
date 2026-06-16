"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  createService,
  updateService,
  toggleServiceActive,
  deleteService,
} from "@/lib/actions/services";
import { formatDuration, formatPrice, SERVICE_CATEGORIES } from "@/lib/constants";
import type { Service } from "@/db/schema";

function ServiceForm({
  service,
  onSuccess,
}: {
  service?: Service;
  onSuccess: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [category, setCategory] = useState(service?.category ?? "Facials");
  const isEdit = !!service;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (isEdit) formData.set("id", service.id);
    formData.set("category", category);
    formData.set("isActive", formData.get("isActive") === "on" ? "true" : "false");

    startTransition(async () => {
      const result = isEdit
        ? await updateService(formData)
        : await createService(formData);
      if (result.error) toast.error(result.error);
      else {
        toast.success(isEdit ? "Service updated" : "Service created");
        onSuccess();
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" defaultValue={service?.name} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" defaultValue={service?.description ?? ""} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price (₹)</Label>
          <Input id="price" name="price" type="number" step="1" defaultValue={service?.price} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="durationMinutes">Duration (min)</Label>
          <Input id="durationMinutes" name="durationMinutes" type="number" defaultValue={service?.durationMinutes} required />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={category} onValueChange={(v) => v && setCategory(v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {SERVICE_CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input type="hidden" name="category" value={category} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sortOrder">Sort Order</Label>
          <Input id="sortOrder" name="sortOrder" type="number" defaultValue={service?.sortOrder ?? 0} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="isActive" name="isActive" defaultChecked={service?.isActive ?? true} />
        <Label htmlFor="isActive">Active</Label>
      </div>
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Saving..." : isEdit ? "Update Service" : "Create Service"}
      </Button>
    </form>
  );
}

export function ServicesManager({ services }: { services: Service[] }) {
  const [open, setOpen] = useState(false);
  const [editService, setEditService] = useState<Service | undefined>();
  const [isPending, startTransition] = useTransition();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{services.length} services</p>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditService(undefined); }}>
          <DialogTrigger className={buttonVariants({ variant: "default" })} onClick={() => setEditService(undefined)}>
            <Plus className="mr-2 h-4 w-4" /> Add Service
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editService ? "Edit Service" : "New Service"}</DialogTitle>
            </DialogHeader>
            <ServiceForm service={editService} onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => (
            <TableRow key={service.id}>
              <TableCell className="font-medium">{service.name}</TableCell>
              <TableCell>{service.category}</TableCell>
              <TableCell>{formatPrice(service.price)}</TableCell>
              <TableCell>{formatDuration(service.durationMinutes)}</TableCell>
              <TableCell>
                <Badge variant={service.isActive ? "default" : "secondary"}>
                  {service.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button size="sm" variant="ghost"
                    onClick={() => { setEditService(service); setOpen(true); }}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" disabled={isPending}
                    onClick={() => startTransition(async () => {
                      await toggleServiceActive(service.id, !service.isActive);
                      toast.success("Updated");
                    })}>
                    {service.isActive ? "Disable" : "Enable"}
                  </Button>
                  <Button size="sm" variant="ghost" disabled={isPending}
                    onClick={() => startTransition(async () => {
                      await deleteService(service.id);
                      toast.success("Deleted");
                    })}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
    </div>
  );
}
