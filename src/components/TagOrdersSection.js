import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";

import { API_BASE_URL } from "../config/api";
import TagOrderFulfillmentDialog from "./TagOrderFulfillmentDialog";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

const statusLabel = (status) => {
  const normalized = (status || "unfulfilled").toString().toLowerCase();
  if (normalized === "unfulfilled") return "Unfulfilled";
  if (normalized === "processing") return "Processing";
  if (normalized === "submitted") return "Submitted";
  if (normalized === "shipped") return "Shipped";
  if (normalized === "delivered") return "Delivered";
  if (normalized === "cancelled") return "Cancelled";
  return normalized || "Unfulfilled";
};

const badgeVariantForStatus = (status) => {
  const normalized = (status || "unfulfilled").toString().toLowerCase();
  if (normalized === "delivered") return "default";
  if (normalized === "cancelled") return "destructive";
  if (normalized === "shipped" || normalized === "submitted") return "secondary";
  return "secondary";
};

const formatAddress = (address) => {
  if (!address) return "—";
  const parts = [
    address.street,
    address.city,
    address.province,
    address.postalCode,
    address.country,
  ]
    .filter(Boolean)
    .map((p) => String(p).trim())
    .filter(Boolean);
  return parts.length ? parts.join(", ") : "—";
};

function TagOrdersSection({ token }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [q, setQ] = useState("");
  const [fulfillmentStatus, setFulfillmentStatus] = useState("open");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [saving, setSaving] = useState(false);

  const resolvedFulfillmentStatus = useMemo(() => {
    if (fulfillmentStatus === "open") return "";
    return fulfillmentStatus;
  }, [fulfillmentStatus]);

  const fetchOrders = useCallback(
    async ({ showSpinner } = {}) => {
      if (!token) return;
      if (showSpinner) setLoading(true);
      setRefreshing(!showSpinner);
      setError("");
      try {
        const res = await axios.get(`${API_BASE_URL}/api/payment/admin/tag-orders`, {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            q: q.trim() || undefined,
            fulfillmentStatus: resolvedFulfillmentStatus || undefined,
            limit: 50,
            skip: 0,
          },
        });
        setOrders(res.data?.data?.orders || []);
      } catch (err) {
        console.error("Failed to load tag orders:", err);
        setError(err?.response?.data?.message || "Failed to load tag orders");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [token, q, resolvedFulfillmentStatus]
  );

  useEffect(() => {
    fetchOrders({ showSpinner: true });
  }, [fetchOrders]);

  const openFulfillment = (order) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  const updateFulfillment = async (payload) => {
    if (!selectedOrder) return;
    setSaving(true);
    setError("");
    try {
      const res = await axios.patch(
        `${API_BASE_URL}/api/payment/admin/tag-orders/${selectedOrder.paymentId}/fulfillment`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedPayment = res.data?.data || null;
      if (updatedPayment?._id) {
        setOrders((prev) =>
          prev.map((o) => (o.paymentId === updatedPayment._id ? { ...o, fulfillment: updatedPayment.fulfillment } : o))
        );
      } else {
        await fetchOrders({ showSpinner: false });
      }
      setDialogOpen(false);
    } catch (err) {
      console.error("Failed to update fulfillment:", err);
      setError(err?.response?.data?.message || "Failed to update fulfillment");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card id="admin-tag-orders">
      <CardHeader className="space-y-2">
        <CardTitle className="flex items-center justify-between gap-4">
          <span>Tag orders</span>
          <Badge variant="secondary" className="font-normal">
            {loading ? "—" : orders.length}
          </Badge>
        </CardTitle>
        <CardDescription>
          Successful tag purchases ready for processing and PUDO delivery.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row">
            <div className="flex-1">
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search orders (email, city, tag type)…"
              />
            </div>
            <div className="sm:w-[220px]">
              <select
                value={fulfillmentStatus}
                onChange={(e) => setFulfillmentStatus(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label="Fulfillment status"
              >
                <option value="open">Open (default)</option>
                <option value="unfulfilled">Unfulfilled</option>
                <option value="processing">Processing</option>
                <option value="submitted">Submitted</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => fetchOrders({ showSpinner: true })} disabled={loading}>
              Search
            </Button>
            <Button variant="secondary" onClick={() => fetchOrders({ showSpinner: false })} disabled={loading || refreshing}>
              {refreshing ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
        </div>

        {error ? (
          <div className="rounded-lg border bg-destructive/5 p-4 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Skeleton key={idx} className="h-12 w-full" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-lg border bg-muted/20 p-6 text-sm text-muted-foreground">
            No tag orders found.
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border bg-card">
            <div className="hidden grid-cols-12 gap-3 border-b bg-muted/30 px-4 py-3 text-xs font-medium text-muted-foreground lg:grid">
              <div className="col-span-2">Purchased</div>
              <div className="col-span-2">Tag</div>
              <div className="col-span-2">Amount</div>
              <div className="col-span-2">Customer</div>
              <div className="col-span-3">Address</div>
              <div className="col-span-1 text-right">Action</div>
            </div>

            {orders.map((order) => {
              const fulfillment = order.fulfillment || {};
              const status = fulfillment.status || "unfulfilled";
              const shipping = order.shipping || {};
              const fullName = [shipping.name, shipping.surname].filter(Boolean).join(" ").trim();
              const purchasedAt = order.purchasedAt ? new Date(order.purchasedAt).toLocaleString() : "—";

              return (
                <div
                  key={order.paymentId}
                  className="grid grid-cols-12 gap-3 border-b px-4 py-3 last:border-b-0 hover:bg-accent/30"
                >
                  <div className="col-span-12 lg:col-span-2">
                    <div className="text-sm font-medium">{purchasedAt}</div>
                    <div className="truncate font-mono text-[11px] text-muted-foreground">
                      {order.paymentId}
                    </div>
                  </div>

                  <div className="col-span-12 lg:col-span-2">
                    <div className="text-sm font-medium">{order.tagType || "—"}</div>
                    <div className="text-xs text-muted-foreground">{order.packageType || "—"}</div>
                    <div className="mt-1">
                      <Badge variant={badgeVariantForStatus(status)}>{statusLabel(status)}</Badge>
                    </div>
                  </div>

                  <div className="col-span-6 lg:col-span-2">
                    <div className="text-sm font-medium">
                      {order.currency || "ZAR"} {order.amountPaid}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Qty: {Number.isFinite(order.quantity) ? order.quantity : order.pets?.length || 0}
                    </div>
                  </div>

                  <div className="col-span-6 lg:col-span-2">
                    <div className="truncate text-sm font-medium">{fullName || "—"}</div>
                    <div className="truncate text-xs text-muted-foreground">{shipping.email || "—"}</div>
                    <div className="truncate text-xs text-muted-foreground">{shipping.contact || "—"}</div>
                  </div>

                  <div className="col-span-12 lg:col-span-3">
                    <div className="text-sm">{formatAddress(shipping.address)}</div>
                    {Array.isArray(order.pets) && order.pets.length ? (
                      <div className="mt-1 truncate text-xs text-muted-foreground">
                        Pets: {order.pets.map((p) => p?.name).filter(Boolean).join(", ") || "—"}
                      </div>
                    ) : null}
                  </div>

                  <div className="col-span-12 flex justify-end lg:col-span-1">
                    <Button size="sm" variant="outline" onClick={() => openFulfillment(order)}>
                      Edit
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>

      <TagOrderFulfillmentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        order={selectedOrder}
        saving={saving}
        onSave={updateFulfillment}
      />
    </Card>
  );
}

export default TagOrdersSection;

