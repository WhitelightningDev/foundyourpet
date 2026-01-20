import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

import { API_BASE_URL } from "../config/api";
import { AuthContext } from "../context/AuthContext";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const STEPS = [
  { key: "unfulfilled", label: "Unfulfilled" },
  { key: "processing", label: "Processing" },
  { key: "submitted", label: "Submitted to PUDO" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
];

const normalizeStatus = (status) => (status || "unfulfilled").toString().trim().toLowerCase();

const statusBadgeVariant = (status) => {
  const s = normalizeStatus(status);
  if (s === "delivered") return "default";
  if (s === "cancelled") return "destructive";
  return "secondary";
};

function DeliveryTimeline({ status }) {
  const current = normalizeStatus(status);
  if (current === "cancelled") {
    return (
      <div className="rounded-lg border bg-destructive/5 p-3 text-sm text-destructive">
        This order was cancelled.
      </div>
    );
  }

  const currentIndex = Math.max(
    0,
    STEPS.findIndex((s) => s.key === current)
  );

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {STEPS.map((step, idx) => {
          const isDone = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const variant = isDone ? "default" : isCurrent ? "secondary" : "outline";
          return (
            <Badge key={step.key} variant={variant}>
              {step.label}
            </Badge>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">
        Current status: <span className="font-medium">{current}</span>
      </p>
    </div>
  );
}

function TagOrderTracking() {
  const { paymentId } = useParams();
  const { token: contextToken } = useContext(AuthContext);
  const token = useMemo(() => contextToken || localStorage.getItem("authToken"), [contextToken]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [order, setOrder] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchOrder = async () => {
      if (!token) return;
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`${API_BASE_URL}/api/payment/tag-orders/${paymentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!mounted) return;
        setOrder(res.data?.data || null);
      } catch (err) {
        if (!mounted) return;
        console.error("Failed to load tag order:", err);
        setError(err?.response?.data?.message || "Failed to load tag order");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchOrder();
    return () => {
      mounted = false;
    };
  }, [paymentId, token]);

  const shipping = order?.shipping || null;
  const fulfillment = order?.fulfillment || null;
  const pudo = fulfillment?.pudo || null;
  const status = fulfillment?.status || "unfulfilled";

  const address = shipping?.address || null;
  const addressLine = address
    ? [address.street, address.city, address.province, address.postalCode, address.country]
        .filter(Boolean)
        .join(", ")
    : "—";

  const copy = async (value) => {
    try {
      await navigator.clipboard.writeText(String(value || ""));
      alert("Copied to clipboard");
    } catch {
      alert("Copy failed");
    }
  };

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Tag delivery tracking</h1>
          <p className="text-sm text-muted-foreground">
            Track the delivery status of your tag order.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/dashboard">Back to dashboard</Link>
        </Button>
      </div>

      {loading ? (
        <Card>
          <CardHeader>
            <CardTitle>Loading…</CardTitle>
            <CardDescription>Please wait.</CardDescription>
          </CardHeader>
        </Card>
      ) : error ? (
        <div className="rounded-lg border bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      ) : !order ? (
        <div className="rounded-lg border bg-muted/20 p-6 text-sm text-muted-foreground">
          Order not found.
        </div>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader className="space-y-2">
              <CardTitle className="flex flex-wrap items-center justify-between gap-3">
                <span>Order</span>
                <Badge variant={statusBadgeVariant(status)}>{normalizeStatus(status)}</Badge>
              </CardTitle>
              <CardDescription className="font-mono text-xs">{order.paymentId}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <DeliveryTimeline status={status} />

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Tag</p>
                  <p className="mt-1 text-sm font-medium">{order.tagType || "—"}</p>
                  <p className="text-sm text-muted-foreground">{order.packageType || "—"}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Amount paid</p>
                  <p className="mt-1 text-sm font-medium">
                    {order.currency || "ZAR"} {order.amountPaid}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Delivery address</p>
                  <p className="mt-1 text-sm">{addressLine}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Pets</p>
                  <p className="mt-1 text-sm">
                    {(order.pets || []).map((p) => p?.name).filter(Boolean).join(", ") || "—"}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">PUDO shipment ID</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-mono">{pudo?.shipmentId || "—"}</p>
                    {pudo?.shipmentId ? (
                      <Button type="button" size="sm" variant="outline" onClick={() => copy(pudo.shipmentId)}>
                        Copy
                      </Button>
                    ) : null}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">PUDO tracking number</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-mono">{pudo?.trackingNumber || "—"}</p>
                    {pudo?.trackingNumber ? (
                      <Button type="button" size="sm" variant="outline" onClick={() => copy(pudo.trackingNumber)}>
                        Copy
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>

              {pudo?.labelUrl ? (
                <div className="pt-2">
                  <Button asChild>
                    <a href={pudo.labelUrl} target="_blank" rel="noreferrer">
                      Open shipping label
                    </a>
                  </Button>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}

export default TagOrderTracking;

