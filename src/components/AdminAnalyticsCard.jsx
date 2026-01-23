import React, { useCallback, useEffect, useMemo, useState } from "react";
import { BarChart3, Clock, Eye, RefreshCw, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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

function formatNumber(value) {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(value);
}

function formatDecimal(value, digits = 1) {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: digits }).format(value);
}

function AdminAnalyticsCard({ token, className }) {
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null);

  const load = useCallback(
    async ({ showSpinner } = {}) => {
      if (!token) {
        setError("Missing auth token");
        setSummary(null);
        setLoading(false);
        return;
      }

      if (showSpinner) setLoading(true);
      setRefreshing(!showSpinner);
      setError("");

      const res = await fetchAdminAnalyticsSummary({ token, days });
      if (!res.ok) {
        setError(res.error || "Failed to load analytics");
        setSummary(null);
        setLoading(false);
        setRefreshing(false);
        return;
      }
      setSummary(res.data);
      setLoading(false);
      setRefreshing(false);
      setLastUpdatedAt(new Date());
    },
    [days, token]
  );

  useEffect(() => {
    load({ showSpinner: true });
  }, [load]);

  const topPages = useMemo(() => summary?.topPages || [], [summary]);
  const totalSessions = useMemo(() => (Number.isFinite(summary?.totalSessions) ? summary.totalSessions : 0), [summary]);
  const totalTopPages = useMemo(() => topPages.reduce((sum, p) => sum + (p?.count || 0), 0), [topPages]);
  const safeTopPagesTotal = totalTopPages || totalSessions || 1;

  return (
    <Card className={cn(className)}>
      <CardHeader className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              Analytics
            </CardTitle>
            <CardDescription>
              Traffic and engagement over the last {days} days.
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant={days === 7 ? "secondary" : "outline"}
              onClick={() => setDays(7)}
              disabled={loading || refreshing}
            >
              7d
            </Button>
            <Button
              type="button"
              size="sm"
              variant={days === 30 ? "secondary" : "outline"}
              onClick={() => setDays(30)}
              disabled={loading || refreshing}
            >
              30d
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="gap-2"
              onClick={() => load({ showSpinner: false })}
              disabled={loading || refreshing}
            >
              <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
              Refresh
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="outline" className="font-normal">
            Window: {summary?.windowDays ?? days}d
          </Badge>
          <Badge variant="outline" className="font-normal">
            Updated: {lastUpdatedAt ? lastUpdatedAt.toLocaleString() : "—"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {error ? (
          <div className="rounded-lg border bg-destructive/5 p-4 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-xl border bg-card p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Users className="h-4 w-4" />
              Visitors
            </div>
            <div className="mt-2 text-2xl font-semibold tabular-nums">
              {loading ? <Skeleton className="h-8 w-16" /> : formatNumber(summary?.uniqueVisitors)}
            </div>
          </div>
          <div className="rounded-xl border bg-card p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Eye className="h-4 w-4" />
              Sessions
            </div>
            <div className="mt-2 text-2xl font-semibold tabular-nums">
              {loading ? <Skeleton className="h-8 w-16" /> : formatNumber(summary?.totalSessions)}
            </div>
          </div>
          <div className="rounded-xl border bg-card p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="outline">Live</Badge>
              Online now
            </div>
            <div className="mt-2 text-2xl font-semibold tabular-nums">
              {loading ? <Skeleton className="h-8 w-14" /> : formatNumber(summary?.onlineNow)}
            </div>
          </div>
          <div className="rounded-xl border bg-card p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-4 w-4" />
              Avg duration
            </div>
            <div className="mt-2 text-2xl font-semibold tabular-nums">
              {loading ? <Skeleton className="h-8 w-20" /> : formatSeconds(summary?.avgDurationSec)}
            </div>
          </div>
          <div className="rounded-xl border bg-card p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="secondary" className="font-normal">
                Avg
              </Badge>
              Pages / session
            </div>
            <div className="mt-2 text-2xl font-semibold tabular-nums">
              {loading ? <Skeleton className="h-8 w-16" /> : formatDecimal(summary?.avgPageviews, 1)}
            </div>
          </div>
        </div>

        <Separator />

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-2 lg:col-span-2">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-medium">Top pages</div>
              <div className="text-xs text-muted-foreground">
                Based on last page in session
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Path</TableHead>
                    <TableHead className="w-[92px] text-right">Sessions</TableHead>
                    <TableHead className="w-[160px]">Share</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, idx) => (
                      <TableRow key={idx}>
                        <TableCell>
                          <Skeleton className="h-4 w-44" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="ml-auto h-4 w-10" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-2 w-full" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : topPages.length ? (
                    topPages.map((p) => {
                      const count = Number(p?.count || 0);
                      const pct = Math.round((count / safeTopPagesTotal) * 100);
                      return (
                        <TableRow key={p.path}>
                          <TableCell className="max-w-[1px]">
                            <div className="truncate font-mono text-xs">{p.path}</div>
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {formatNumber(count)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={pct} />
                              <div className="w-10 text-right text-xs tabular-nums text-muted-foreground">
                                {pct}%
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="py-6 text-center text-sm text-muted-foreground">
                        No analytics yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">Quick insights</div>
            <div className="space-y-3 rounded-xl border bg-card p-4">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-muted-foreground">Sessions per visitor</span>
                <span className="font-medium tabular-nums">
                  {loading ? "—" : formatDecimal((summary?.totalSessions || 0) / (summary?.uniqueVisitors || 1), 2)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-muted-foreground">Total sessions</span>
                <span className="font-medium tabular-nums">
                  {loading ? "—" : formatNumber(summary?.totalSessions)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-muted-foreground">Avg pageviews</span>
                <span className="font-medium tabular-nums">
                  {loading ? "—" : formatDecimal(summary?.avgPageviews, 1)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-muted-foreground">Online now</span>
                <span className="font-medium tabular-nums">
                  {loading ? "—" : formatNumber(summary?.onlineNow)}
                </span>
              </div>
              <div className="rounded-lg bg-muted/30 p-3 text-xs text-muted-foreground">
                Tip: enable push notifications to keep users engaged with new reports.
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default AdminAnalyticsCard;
