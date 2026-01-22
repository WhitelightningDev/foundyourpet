import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";

import { API_BASE_URL } from "../config/api";
import TagOrderFulfillmentDialog from "./TagOrderFulfillmentDialog";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const statusLabel = (status) => {
  const normalized = (status || "unfulfilled").toString().toLowerCase();
  if (normalized === "unfulfilled") return "Unfulfilled";
  if (normalized === "processing") return "Processing";
  if (normalized === "submitted") return "Submitted to PUDO";
  if (normalized === "shipped") return "Shipped";
  if (normalized === "delivered") return "Delivered";
  if (normalized === "cancelled") return "Cancelled";
  return normalized || "Unfulfilled";
};

const normalizeStatus = (status) =>
  (status || "unfulfilled").toString().trim().toLowerCase();

const extractTotalFromResponse = (response) => {
  const candidates = [
    response?.data?.data?.total,
    response?.data?.data?.count,
    response?.data?.data?.page?.total,
    response?.data?.data?.pagination?.total,
    response?.data?.pagination?.total,
    response?.data?.total,
    response?.data?.count,
  ];
  for (const value of candidates) {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim() !== "" && Number.isFinite(Number(value))) {
      return Number(value);
    }
  }
  return null;
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
  const [countsLoading, setCountsLoading] = useState(false);

  const [qInput, setQInput] = useState("");
  const [q, setQ] = useState("");
  const [statusTab, setStatusTab] = useState("unfulfilled");
  const [tabCounts, setTabCounts] = useState({});

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [saving, setSaving] = useState(false);

  const statusTabs = useMemo(
    () => [
      { value: "all", label: "All" },
      { value: "unfulfilled", label: "Unfulfilled" },
      { value: "processing", label: "Processing" },
      { value: "submitted", label: "Submitted" },
      { value: "shipped", label: "Shipped" },
      { value: "delivered", label: "Delivered" },
      { value: "cancelled", label: "Cancelled" },
    ],
    []
  );

  const fetchOrders = useCallback(
    async ({ showSpinner, tab, query } = {}) => {
      if (!token) return;
      if (showSpinner) setLoading(true);
      setRefreshing(!showSpinner);
      setError("");
      try {
        const resolvedTab = (tab || "all").toString();
        const resolvedQuery = (query || "").toString().trim();
        const res = await axios.get(`${API_BASE_URL}/api/payment/admin/tag-orders`, {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            q: resolvedQuery || undefined,
            fulfillmentStatus: resolvedTab === "all" ? undefined : resolvedTab,
            limit: 50,
            skip: 0,
          },
        });
        const nextOrders = res.data?.data?.orders || [];
        setOrders(nextOrders);
        const total = extractTotalFromResponse(res);
        setTabCounts((prev) => ({
          ...prev,
          [resolvedTab]: total ?? nextOrders.length,
        }));
      } catch (err) {
        console.error("Failed to load tag orders:", err);
        setError(err?.response?.data?.message || "Failed to load tag orders");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [token]
  );

  useEffect(() => {
    fetchOrders({ showSpinner: true, tab: statusTab, query: q });
  }, [fetchOrders, q, statusTab]);

  useEffect(() => {
    if (!token) return undefined;
    let mounted = true;

    const loadCounts = async () => {
      setCountsLoading(true);
      const resolvedQuery = (q || "").toString().trim();
      const requests = statusTabs.map((t) =>
        axios.get(`${API_BASE_URL}/api/payment/admin/tag-orders`, {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            q: resolvedQuery || undefined,
            fulfillmentStatus: t.value === "all" ? undefined : t.value,
            limit: 1,
            skip: 0,
          },
        })
      );

      const results = await Promise.allSettled(requests);
      if (!mounted) return;

      const next = {};
      results.forEach((result, idx) => {
        const tab = statusTabs[idx]?.value;
        if (!tab || result.status !== "fulfilled") return;
        const total = extractTotalFromResponse(result.value);
        if (total != null) next[tab] = total;
      });

      if (Object.keys(next).length) {
        setTabCounts((prev) => ({ ...prev, ...next }));
      }

      setCountsLoading(false);
    };

    loadCounts();
    return () => {
      mounted = false;
    };
  }, [q, statusTabs, token]);

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
      const nextStatus = normalizeStatus(updatedPayment?.fulfillment?.status || payload?.status);
      if (updatedPayment?._id) {
        setOrders((prev) =>
          prev.map((o) => (o.paymentId === updatedPayment._id ? { ...o, fulfillment: updatedPayment.fulfillment } : o))
        );
      }
      if (statusTab !== "all" && nextStatus && nextStatus !== statusTab) {
        setStatusTab(nextStatus);
      } else {
        await fetchOrders({ showSpinner: false, tab: statusTab, query: q });
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
        <Tabs value={statusTab} onValueChange={setStatusTab}>
          <div className="overflow-x-auto pb-1">
            <TabsList className="w-max justify-start gap-1">
              {statusTabs.map((t) => (
                <TabsTrigger key={t.value} value={t.value}>
                  <span className="flex items-center gap-2">
                    <span>{t.label}</span>
                    <span className="rounded-md bg-background/70 px-1.5 py-0.5 text-[11px] text-foreground shadow-sm ring-1 ring-border">
                      {(() => {
                        const cached = tabCounts?.[t.value];
                        if (typeof cached === "number") return cached;
                        if (!loading && t.value === statusTab) return orders.length;
                        if (countsLoading) return "…";
                        return 0;
                      })()}
                    </span>
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row">
            <div className="flex-1">
              <Input
                value={qInput}
                onChange={(e) => setQInput(e.target.value)}
                placeholder="Search orders (email, city, tag type)…"
                onKeyDown={(e) => {
                  if (e.key !== "Enter") return;
                  e.preventDefault();
                  setQ(qInput);
                }}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setQ(qInput)}
              disabled={loading}
            >
              Search
            </Button>
            <Button
              variant="secondary"
              onClick={() => fetchOrders({ showSpinner: false, tab: statusTab, query: q })}
              disabled={loading || refreshing}
            >
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
          <div className="rounded-xl border bg-card">
            {(() => {
              const showPudoColumns = ["all", "processing", "submitted", "shipped", "delivered"].includes(statusTab);
              const gridCols = showPudoColumns
                ? "lg:grid-cols-[180px_170px_130px_220px_200px_200px_1fr_auto]"
                : "lg:grid-cols-[180px_170px_130px_220px_1fr_auto]";
              const rowGrid = `grid gap-3 ${gridCols}`;
              return (
                <div className="overflow-x-auto">
                  <div className={showPudoColumns ? "min-w-[1400px]" : "min-w-[1100px]"}>
                    <div
                      className={`hidden lg:grid ${gridCols} gap-3 border-b bg-muted/30 px-4 py-3 text-xs font-medium text-muted-foreground`}
                    >
                      <div>Purchased</div>
                      <div>Tag</div>
                      <div>Amount</div>
                      <div>Customer</div>
                      {showPudoColumns ? (
                        <>
                          <div>PUDO shipment ID</div>
                          <div>PUDO tracking #</div>
                        </>
                      ) : null}
                      <div>Address</div>
                      <div className="text-right">Action</div>
                    </div>

                    {orders.map((order) => {
                      const fulfillment = order.fulfillment || {};
                      const pudo = fulfillment?.pudo || {};
                      const status = fulfillment.status || "unfulfilled";
                      const shipping = order.shipping || {};
                      const fullName = [shipping.name, shipping.surname].filter(Boolean).join(" ").trim();
                      const purchasedAt = order.purchasedAt ? new Date(order.purchasedAt).toLocaleString() : "—";

                      return (
                        <div
                          key={order.paymentId}
                          className={`${rowGrid} border-b px-4 py-3 last:border-b-0 hover:bg-accent/30`}
                        >
                          <div>
                            <div className="text-xs font-medium text-muted-foreground lg:hidden">Purchased</div>
                            <div className="text-sm font-medium">{purchasedAt}</div>
                            <div className="truncate font-mono text-[11px] text-muted-foreground">
                              {order.paymentId}
                            </div>
                          </div>

                          <div>
                            <div className="text-xs font-medium text-muted-foreground lg:hidden">Tag</div>
                            <div className="text-sm font-medium">{order.tagType || "—"}</div>
                            <div className="text-xs text-muted-foreground">{order.packageType || "—"}</div>
                            <div className="mt-1">
                              <Badge variant={badgeVariantForStatus(status)}>{statusLabel(status)}</Badge>
                            </div>
                          </div>

                          <div>
                            <div className="text-xs font-medium text-muted-foreground lg:hidden">Amount</div>
                            <div className="text-sm font-medium">
                              {order.currency || "ZAR"} {order.amountPaid}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Qty: {Number.isFinite(order.quantity) ? order.quantity : order.pets?.length || 0}
                            </div>
                          </div>

                          <div>
                            <div className="text-xs font-medium text-muted-foreground lg:hidden">Customer</div>
                            <div className="truncate text-sm font-medium">{fullName || "—"}</div>
                            <div className="truncate text-xs text-muted-foreground">{shipping.email || "—"}</div>
                            <div className="truncate text-xs text-muted-foreground">{shipping.contact || "—"}</div>
                          </div>

                          {showPudoColumns ? (
                            <>
                              <div>
                                <div className="text-xs font-medium text-muted-foreground lg:hidden">PUDO shipment ID</div>
                                <div className="truncate font-mono text-sm">{pudo?.shipmentId || "—"}</div>
                              </div>
                              <div>
                                <div className="text-xs font-medium text-muted-foreground lg:hidden">PUDO tracking #</div>
                                <div className="truncate font-mono text-sm">{pudo?.trackingNumber || "—"}</div>
                                {pudo?.labelUrl ? (
                                  <div className="mt-1">
                                    <a
                                      href={pudo.labelUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-xs font-medium text-primary underline-offset-4 hover:underline"
                                    >
                                      Open label
                                    </a>
                                  </div>
                                ) : null}
                              </div>
                            </>
                          ) : null}

                          <div>
                            <div className="text-xs font-medium text-muted-foreground lg:hidden">Address</div>
                            <div className="text-sm">{formatAddress(shipping.address)}</div>
                            {Array.isArray(order.pets) && order.pets.length ? (
                              <div className="mt-1 truncate text-xs text-muted-foreground">
                                Pets: {order.pets.map((p) => p?.name).filter(Boolean).join(", ") || "—"}
                              </div>
                            ) : null}
                          </div>

                          <div className="flex justify-end lg:justify-end">
                            <Button size="sm" variant="outline" onClick={() => openFulfillment(order)}>
                              Edit
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
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
