import React, { useEffect, useMemo, useState } from "react";
import { BarChart3, Clock, Eye, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { fetchAdminAnalyticsSummary } from "@/services/adminAnalytics";

function formatSeconds(seconds) {
  if (!Number.isFinite(seconds)) return "—";
  const s = Math.round(seconds);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${m}m ${rem}s`;
}

function AdminAnalyticsCard({ token, className }) {
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError("");
      const res = await fetchAdminAnalyticsSummary({ token, days });
      if (!active) return;
      if (!res.ok) {
        setError(res.error || "Failed to load analytics");
        setSummary(null);
        setLoading(false);
        return;
      }
      setSummary(res.data);
      setLoading(false);
    };

    load();
    return () => {
      active = false;
    };
  }, [token, days]);

  const topPages = useMemo(() => summary?.topPages || [], [summary]);

  return (
    <Card className={cn(className)}>
      <CardHeader className="space-y-2">
        <CardTitle className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            Analytics
          </span>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant={days === 7 ? "secondary" : "outline"}
              onClick={() => setDays(7)}
            >
              7d
            </Button>
            <Button
              type="button"
              size="sm"
              variant={days === 30 ? "secondary" : "outline"}
              onClick={() => setDays(30)}
            >
              30d
            </Button>
          </div>
        </CardTitle>
        <CardDescription>Traffic and engagement over the last {days} days.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error ? (
          <div className="rounded-lg border bg-destructive/5 p-4 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-4">
          <div className="rounded-xl border bg-card p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Users className="h-4 w-4" />
              Visitors
            </div>
            <div className="mt-2 text-2xl font-semibold">
              {loading ? "—" : summary?.uniqueVisitors ?? "—"}
            </div>
          </div>
          <div className="rounded-xl border bg-card p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Eye className="h-4 w-4" />
              Sessions
            </div>
            <div className="mt-2 text-2xl font-semibold">
              {loading ? "—" : summary?.totalSessions ?? "—"}
            </div>
          </div>
          <div className="rounded-xl border bg-card p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-4 w-4" />
              Avg duration
            </div>
            <div className="mt-2 text-2xl font-semibold">
              {loading ? "—" : formatSeconds(summary?.avgDurationSec)}
            </div>
          </div>
          <div className="rounded-xl border bg-card p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="outline">Live</Badge>
              Online now
            </div>
            <div className="mt-2 text-2xl font-semibold">
              {loading ? "—" : summary?.onlineNow ?? "—"}
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="text-sm font-medium">Top pages (by last page in session)</div>
          {loading ? (
            <div className="text-sm text-muted-foreground">Loading…</div>
          ) : topPages.length ? (
            <div className="flex flex-wrap gap-2">
              {topPages.map((p) => (
                <Badge key={p.path} variant="secondary" className="font-normal">
                  {p.path} • {p.count}
                </Badge>
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">No analytics yet.</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default AdminAnalyticsCard;

