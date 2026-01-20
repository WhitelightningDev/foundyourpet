import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, CheckCircle2, Home, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { API_BASE_URL } from "../config/api";

const SignupSuccess = () => {
  const location = useLocation();
  const initialEmail = useMemo(() => {
    const fromState = location?.state?.email;
    if (typeof fromState === "string" && fromState.trim()) return fromState.trim();
    try {
      const fromStorage = sessionStorage.getItem("pendingVerificationEmail");
      return (fromStorage || "").trim();
    } catch {
      return "";
    }
  }, [location?.state?.email]);

  const [email, setEmail] = useState(initialEmail);
  const [sending, setSending] = useState(false);

  const resendVerification = async ({ auto, emailOverride } = {}) => {
    const nextEmail = ((emailOverride ?? email) || "").trim();
    if (!nextEmail) {
      toast.error("Enter the email you signed up with.");
      return;
    }

    if (auto) {
      try {
        const lastAttempt = Number(sessionStorage.getItem("verificationEmailLastAttempt") || "0");
        const now = Date.now();
        if (lastAttempt && now - lastAttempt < 60_000) return;
        sessionStorage.setItem("verificationEmailLastAttempt", String(now));
      } catch {
        // no-op
      }
    }

    setSending(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/api/users/resend-verification`, { email: nextEmail });
      const message = res?.data?.message || "If an account exists, we sent a verification email.";
      if (res?.data?.cooldown) toast.message(message);
      else toast.success(message);
      return;
    } catch (err) {
      const status = err?.response?.status;
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.msg ||
        err?.message ||
        "Could not send verification email.";

      // Backwards compatibility: older backends used 429 for cooldown.
      if (status === 429) {
        toast.message(message);
        return;
      }

      toast.error(status ? `${message} (HTTP ${status})` : message);
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (!initialEmail) return;
    setEmail(initialEmail);
    resendVerification({ auto: true, emailOverride: initialEmail });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialEmail]);

  return (
    <main className="relative min-h-[calc(100vh-4rem)] bg-background px-4 py-12 text-foreground sm:py-16">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(27,182,168,0.18),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-[#FFD66B]/45 via-[#FFB55C]/25 to-[#FF8E4A]/25" />

      <div className="mx-auto flex w-full max-w-lg flex-col items-center justify-center">
        <Card className="w-full overflow-hidden shadow-lg shadow-primary/10">
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto flex items-center justify-center gap-3">
              <img
                src="/android-chrome-192x192.png"
                alt="Found Your Pet"
                className="h-12 w-12 rounded-xl border bg-card shadow-sm"
                loading="lazy"
              />
              <div className="text-left">
                <div className="text-sm font-medium leading-none">Found Your Pet</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Account setup
                </div>
              </div>
            </div>

            <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl border bg-card shadow-sm ring-1 ring-primary/10">
              <CheckCircle2 className="h-7 w-7 text-primary" />
            </div>

            <div className="space-y-2">
              <CardTitle className="text-2xl sm:text-3xl">Signup successful</CardTitle>
              <CardDescription className="text-base">
                Check your email to verify your account and complete registration.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            <div className="rounded-xl border bg-card p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-lg border bg-background/60 ring-1 ring-primary/10">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Verify your email</div>
                  <p className="text-sm text-muted-foreground">
                    If you don’t see it, check your spam or promotions folder.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border bg-muted/20 p-4">
              <div className="text-sm font-medium">Resend verification</div>
              <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  type="email"
                  autoComplete="email"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="gap-2"
                  onClick={() => resendVerification()}
                  disabled={sending}
                >
                  <Mail className="h-4 w-4" />
                  {sending ? "Sending…" : "Resend"}
                </Button>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                This triggers a verification email from the backend.
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="w-full gap-2 shadow-md shadow-primary/15 ring-1 ring-primary/10 hover:shadow-primary/20"
            >
              <Link to="/login">
                Go to login <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full gap-2">
              <Link to="/">
                <Home className="h-4 w-4" />
                Return home
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
};

export default SignupSuccess;
