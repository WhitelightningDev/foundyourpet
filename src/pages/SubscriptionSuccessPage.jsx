import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const SubscriptionSuccessPage = () => {
  const token = useMemo(() => localStorage.getItem("authToken"), []);
  const [status, setStatus] = useState("checking");
  const [error, setError] = useState("");
  const attemptsRef = useRef(0);
  const timerRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const clearTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = null;
    };

    const poll = async () => {
      if (cancelled) return;

      if (!token) {
        setError("Please log in again to confirm your subscription.");
        setStatus("error");
        return;
      }

      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/subscriptions/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const subscriptions = Array.isArray(data?.subscriptions) ? data.subscriptions : [];
        const monthly = subscriptions.find((s) => (s?.planKey || "").toString().toUpperCase() === "MONTHLY");
        const isActive = (monthly?.status || "").toString().toLowerCase() === "active";

        if (isActive) {
          setStatus("active");
          setError("");
          return;
        }

        if (attemptsRef.current >= 18) {
          setStatus("pending");
          return;
        }

        attemptsRef.current += 1;
        const delayMs = Math.min(4000, 800 + attemptsRef.current * 250);
        clearTimer();
        timerRef.current = setTimeout(poll, delayMs);
      } catch (err) {
        const code = err?.response?.status;
        if (code === 401 || code === 403) {
          setError("Please log in again to confirm your subscription.");
          setStatus("error");
        } else {
          setError("Could not confirm subscription yet. Please try again in a moment.");
          setStatus("pending");
        }
      }
    };

    attemptsRef.current = 0;
    clearTimer();
    poll();

    return () => {
      cancelled = true;
      clearTimer();
    };
  }, [token]);

  const isChecking = status === "checking";
  const isActive = status === "active";

  return (
    <main className="min-h-screen bg-muted/40 px-4 py-10">
      <div className="mx-auto w-full max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
            <CardDescription>
              PayFast will confirm your subscription via ITN. This can take a minute.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isChecking ? (
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Checking subscription status…</p>
              </div>
            ) : null}

            {isActive ? (
              <div className="space-y-3">
                <p className="text-sm">Your subscription is active.</p>
                <div className="flex gap-2">
                  <Button asChild>
                    <Link to="/dashboard">Go to dashboard</Link>
                  </Button>
                  <Button variant="secondary" asChild>
                    <Link to="/select-tag/standard">Order tags</Link>
                  </Button>
                </div>
              </div>
            ) : null}

            {!isChecking && !isActive && !error ? (
              <div className="space-y-3">
                <p className="text-sm">
                  Your payment return was received. We&apos;re still waiting for PayFast to confirm via ITN.
                </p>
                <Button onClick={() => window.location.reload()}>Check again</Button>
              </div>
            ) : null}

            {error ? (
              <div className="space-y-3">
                <p className="text-sm text-red-600">{error}</p>
                <Button asChild>
                  <Link to="/login">Log in</Link>
                </Button>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default SubscriptionSuccessPage;
