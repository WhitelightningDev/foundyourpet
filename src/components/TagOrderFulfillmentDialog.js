import React, { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const STATUS_OPTIONS = [
  { value: "unfulfilled", label: "Unfulfilled" },
  { value: "processing", label: "Processing" },
  { value: "submitted", label: "Submitted to PUDO" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

function TagOrderFulfillmentDialog({
  open,
  onOpenChange,
  order,
  onSave,
  saving,
}) {
  const initial = useMemo(() => {
    const fulfillment = order?.fulfillment || {};
    const pudo = fulfillment?.pudo || {};
    return {
      status: (fulfillment?.status || "unfulfilled").toString(),
      notes: fulfillment?.notes || "",
      pudoShipmentId: pudo?.shipmentId || "",
      pudoTrackingNumber: pudo?.trackingNumber || "",
      pudoStatus: pudo?.status || "",
      pudoLabelUrl: pudo?.labelUrl || "",
    };
  }, [order]);

  const [form, setForm] = useState(initial);

  useEffect(() => {
    setForm(initial);
  }, [initial]);

  if (!order) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave?.({
      status: form.status,
      notes: form.notes,
      pudoShipmentId: form.pudoShipmentId,
      pudoTrackingNumber: form.pudoTrackingNumber,
      pudoStatus: form.pudoStatus,
      pudoLabelUrl: form.pudoLabelUrl,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update fulfillment</DialogTitle>
          <DialogDescription>
            Order: <span className="font-mono text-xs">{order.paymentId}</span>
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="fulfillment-status">Status</Label>
            <select
              id="fulfillment-status"
              value={form.status}
              onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="pudo-tracking">PUDO tracking number</Label>
              <Input
                id="pudo-tracking"
                value={form.pudoTrackingNumber}
                onChange={(e) => setForm((prev) => ({ ...prev, pudoTrackingNumber: e.target.value }))}
                placeholder="Tracking number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pudo-shipment">PUDO shipment ID</Label>
              <Input
                id="pudo-shipment"
                value={form.pudoShipmentId}
                onChange={(e) => setForm((prev) => ({ ...prev, pudoShipmentId: e.target.value }))}
                placeholder="Shipment ID"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="pudo-status">PUDO status</Label>
              <Input
                id="pudo-status"
                value={form.pudoStatus}
                onChange={(e) => setForm((prev) => ({ ...prev, pudoStatus: e.target.value }))}
                placeholder="Provider status"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pudo-label">Label URL</Label>
              <Input
                id="pudo-label"
                value={form.pudoLabelUrl}
                onChange={(e) => setForm((prev) => ({ ...prev, pudoLabelUrl: e.target.value }))}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fulfillment-notes">Notes</Label>
            <Textarea
              id="fulfillment-notes"
              value={form.notes}
              onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Internal notes for fulfillment"
              className="min-h-[90px]"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange?.(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default TagOrderFulfillmentDialog;

