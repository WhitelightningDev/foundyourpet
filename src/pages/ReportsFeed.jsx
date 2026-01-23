import React, { useCallback, useEffect, useMemo, useState } from "react";
import { MessageCircle, Plus, RefreshCcw } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ReportPetModal from "@/components/ReportPetModal";
import ReportCard from "@/components/ReportCard";
import ReportStatusBadge from "@/components/ReportStatusBadge";
import { setReportsLastSeenAt } from "@/lib/reportSeen";
import { freeServices } from "@/services/free";

function ReportsFeed() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [nextPage, setNextPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  const hasMore = Boolean(nextPage);

  const loadPage = useCallback(
    async (pageToLoad, { replace = false } = {}) => {
      setIsLoading(true);
      try {
        const res = await freeServices.reports.fetchPublicReports({ page: pageToLoad, limit: 8 });
        if (!res?.ok) {
          toast.error("Couldn't load reports.");
          return;
        }

        setItems((prev) => (replace ? res.items : [...prev, ...res.items]));
        setNextPage(res.nextPage || null);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadPage(1, { replace: true });
  }, [loadPage]);

  useEffect(() => {
    const shouldOpen = searchParams.get("new") === "1";
    if (!shouldOpen) return;
    setReportOpen(true);
    const next = new URLSearchParams(searchParams);
    next.delete("new");
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    // Visiting the feed marks reports as "seen" for update badge purposes.
    setReportsLastSeenAt(new Date().toISOString());
  }, []);

  const stats = useMemo(() => {
    const lost = items.filter((r) => r.petStatus === "lost").length;
    const found = items.filter((r) => r.petStatus === "found").length;
    return { lost, found, total: items.length };
  }, [items]);

  return (
    <main className="relative bg-background px-4 py-12 text-foreground sm:py-16">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(27,182,168,0.14),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-[#FFD66B]/35 via-[#FFB55C]/15 to-[#FF8E4A]/15" />

      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Community Reports
            </h1>
            <p className="text-sm text-muted-foreground">
              Public lost and found pet reports. Help by commenting, reacting, or flagging incorrect content.
            </p>
          </div>

            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Total: {stats.total}</Badge>
                <ReportStatusBadge status="lost">Lost: {stats.lost}</ReportStatusBadge>
                <ReportStatusBadge status="found">Found: {stats.found}</ReportStatusBadge>
              </div>
            <div className="flex gap-2">
              <Button type="button" className="gap-2" onClick={() => setReportOpen(true)}>
                <Plus className="h-4 w-4" />
                Add post
              </Button>
              <Button
                type="button"
                variant="outline"
                className="gap-2"
                disabled={isLoading}
                onClick={() => loadPage(1, { replace: true })}
              >
                <RefreshCcw className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {items.length ? (
          <div className="grid gap-5 md:grid-cols-2">
            {items.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                onUpdate={setItems}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                No reports yet
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Be the first to submit a report.
              <div className="mt-4">
                <Button type="button" className="gap-2" onClick={() => setReportOpen(true)}>
                  <Plus className="h-4 w-4" />
                  Add post
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-10 flex items-center justify-center">
          {hasMore ? (
            <Button
              type="button"
              size="lg"
              variant="secondary"
              disabled={isLoading}
              onClick={() => loadPage(nextPage)}
            >
              {isLoading ? "Loading…" : "Load more"}
            </Button>
          ) : items.length ? (
            <div className="text-sm text-muted-foreground">You’ve reached the end.</div>
          ) : null}
        </div>
      </div>

      <ReportPetModal
        open={reportOpen}
        onOpenChange={setReportOpen}
        onSubmitted={({ report, raw } = {}) => {
          if (report) {
            setItems((prev) => [report, ...prev.filter((r) => r.id !== report.id)]);
          }

          // If we stored locally, keep the local post visible.
          if (raw?.data?.local) return;

          // Otherwise reload from the source of truth after posting.
          loadPage(1, { replace: true });
        }}
      />
    </main>
  );
}

export default ReportsFeed;
