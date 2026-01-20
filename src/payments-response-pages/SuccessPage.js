import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Loader2 } from "lucide-react";

const SuccessPage = () => {
  const [params] = useSearchParams();
  const [details, setDetails] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [finalizing, setFinalizing] = useState(false);

  const paymentId = params.get("paymentId");
  const token = useMemo(() => localStorage.getItem("authToken"), []);
  const attemptsRef = useRef(0);
  const pollTimeoutRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const clearTimer = () => {
      if (pollTimeoutRef.current) clearTimeout(pollTimeoutRef.current);
      pollTimeoutRef.current = null;
    };

    const needsFinalize = (data) => {
      const status = data?.status;
      const kind = data?.kind;
      const pets = Array.isArray(data?.pets) ? data.pets : [];
      const membershipActive = !!data?.membership?.active;

      if (status !== "successful") return true;
      if (kind === "membership") return pets.length === 0 || !membershipActive;
      return false;
    };

    const poll = async () => {
      if (cancelled) return;

      if (!paymentId) {
        setError("Missing payment reference. Please contact support if you were charged.");
        setLoading(false);
        return;
      }

      if (!token) {
        setError("Please log in again to view your receipt.");
        setLoading(false);
        return;
      }

      const isFirstLoad = attemptsRef.current === 0;
      if (isFirstLoad) setLoading(true);

      try {
        const { data } = await axios.get(
          `${API_BASE_URL}/api/payment/details/${paymentId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!data.success) {
          setError("Could not retrieve payment details.");
          setLoading(false);
          return;
        }

        setDetails(data.data);
        setError("");

        const shouldContinue = needsFinalize(data.data);
        setFinalizing(shouldContinue);

        if (shouldContinue && attemptsRef.current < 18) {
          attemptsRef.current += 1;
          const delayMs = Math.min(2500, 800 + attemptsRef.current * 250);
          clearTimer();
          pollTimeoutRef.current = setTimeout(poll, delayMs);
        }
      } catch (err) {
        const status = err?.response?.status;
        if (status === 401 || status === 403) {
          setError("Please log in again to view your receipt.");
        } else {
          setError("Error fetching payment details.");
        }
      } finally {
        if (isFirstLoad) setLoading(false);
      }
    };

    attemptsRef.current = 0;
    clearTimer();
    poll();

    return () => {
      cancelled = true;
      clearTimer();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentId, token]);

  if (loading) {
    return (
      <main className="min-h-screen bg-muted/40 px-4 py-10">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading your receipt…</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-muted/40 px-4 py-10">
        <div className="mx-auto w-full max-w-2xl">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Payment received</CardTitle>
              <CardDescription>We couldn&apos;t load your receipt details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button asChild className="w-full sm:w-auto">
                  <Link to="/login">Log in</Link>
                </Button>
                <Button variant="outline" asChild className="w-full sm:w-auto">
                  <Link to="/contact">Contact support</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  const userName = [details?.user?.name, details?.user?.surname].filter(Boolean).join(" ").trim();
  const pets = Array.isArray(details?.pets) ? details.pets : [];
  const draftPet = details?.petDraft;
  const amountPaid = details?.amountPaid;
  const packageType = details?.packageType;
  const isMembership = details?.kind === "membership";
  const membershipActive = details?.membership?.active;

  return (
    <main className="min-h-screen bg-muted/40 px-4 py-10">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <Card className="shadow-sm">
          <CardHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <CheckCircle className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <CardTitle>Payment successful</CardTitle>
                <CardDescription>
                  {userName ? `Thanks, ${userName}.` : "Thanks!"} Your order has been confirmed.
                </CardDescription>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Reference: {paymentId}</Badge>
              {packageType ? <Badge variant="outline">{packageType}</Badge> : null}
              {typeof amountPaid !== "undefined" ? (
                <Badge variant="outline">Paid: R{amountPaid}</Badge>
              ) : null}
              {details?.status ? (
                <Badge variant={details.status === "successful" ? "default" : "secondary"}>
                  Status: {details.status}
                </Badge>
              ) : null}
            </div>
          </CardHeader>

          <CardContent className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <Button asChild className="w-full sm:w-auto">
              <Link to="/dashboard">Go to dashboard</Link>
            </Button>
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <Link to="/manage-pets">Manage pets</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Receipt details</CardTitle>
            <CardDescription>Summary of your payment and enrollment.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {finalizing ? (
              <div className="flex items-start gap-3 rounded-lg border bg-muted/40 p-3 text-sm text-muted-foreground">
                <Loader2 className="mt-0.5 h-4 w-4 animate-spin" />
                <div>
                  <p className="font-medium text-foreground">Finalizing your payment…</p>
                  <p className="mt-1">
                    We&apos;re waiting for Yoco confirmation and finishing updates in your account. This usually takes a few seconds.
                  </p>
                </div>
              </div>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border bg-background p-3">
                <p className="text-xs text-muted-foreground">Package</p>
                <p className="mt-1 text-sm font-medium">{packageType || "—"}</p>
              </div>
              <div className="rounded-lg border bg-background p-3">
                <p className="text-xs text-muted-foreground">Amount paid</p>
                <p className="mt-1 text-sm font-medium">
                  {typeof amountPaid !== "undefined" ? `R${amountPaid}` : "—"}
                </p>
              </div>
              <div className="rounded-lg border bg-background p-3">
                <p className="text-xs text-muted-foreground">Pets</p>
                <p className="mt-1 text-sm font-medium">{pets.length}</p>
              </div>
            </div>

            {isMembership ? (
              <div className="space-y-2">
                <Separator />
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium">Membership</p>
                    <p className="text-sm text-muted-foreground">
                      Activation can take a moment after payment.
                    </p>
                  </div>
                  <Badge variant={membershipActive ? "default" : "secondary"}>
                    {membershipActive ? "Active" : "Pending"}
                  </Badge>
                </div>
              </div>
            ) : null}

            {pets.length ? (
              <div className="space-y-2">
                <Separator />
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Pets enrolled</p>
                  <Badge variant="secondary">{pets.length}</Badge>
                </div>
                <div className="space-y-2">
                  {pets.map((pet) => (
                    <div
                      key={pet._id || `${pet.name}-${pet.breed}-${pet.species}`}
                      className="flex items-start justify-between gap-4 rounded-lg border bg-background p-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{pet.name || "Pet"}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {[pet.breed, pet.species].filter(Boolean).join(" • ") || "—"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : draftPet ? (
              <div className="space-y-2">
                <Separator />
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Pet being created</p>
                  <Badge variant="secondary">Pending</Badge>
                </div>
                <div className="rounded-lg border bg-background p-3">
                  <p className="text-sm font-medium">{draftPet.name || "Pet"}</p>
                  <p className="text-xs text-muted-foreground">
                    {[draftPet.breed, draftPet.species].filter(Boolean).join(" • ") || "—"}
                  </p>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default SuccessPage;
