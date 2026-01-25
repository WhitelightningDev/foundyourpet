import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MessageCircle, Plus, RefreshCcw, Search, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import ReportPetModal from "@/components/ReportPetModal";
import ReportCard from "@/components/ReportCard";
import ReportStatusBadge from "@/components/ReportStatusBadge";
import { setReportsLastSeenAt } from "@/lib/reportSeen";
import { freeServices } from "@/services/free";

function ReportsFeed() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchInputRef = useRef(null);
  const scrolledToHighlightRef = useRef(false);
  const [items, setItems] = useState([]);
  const [nextPage, setNextPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  const defaultPetStatus = useMemo(() => {
    const status = String(searchParams.get("status") || "").toLowerCase();
    return status === "found" ? "found" : "lost";
  }, [searchParams]);

  const urlQuery = useMemo(() => (searchParams.get("q") || "").trim(), [searchParams]);
  const highlightId = useMemo(() => (searchParams.get("highlight") || "").trim(), [searchParams]);
  const [queryInput, setQueryInput] = useState(() => urlQuery);

  useEffect(() => {
    setQueryInput(urlQuery);
  }, [urlQuery]);

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
    const shouldFocus = searchParams.get("focus") === "1";
    if (!shouldFocus) return;
    searchInputRef.current?.focus?.();
    const next = new URLSearchParams(searchParams);
    next.delete("focus");
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const shouldLocate = searchParams.get("near") === "1";
    if (!shouldLocate) return;

    const next = new URLSearchParams(searchParams);
    next.delete("near");
    setSearchParams(next, { replace: true });

    if (typeof navigator === "undefined" || !navigator.geolocation) {
      toast.message("Nearby listings aren’t available on this device.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos?.coords?.latitude;
        const lon = pos?.coords?.longitude;
        if (!Number.isFinite(lat) || !Number.isFinite(lon)) return;

        try {
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lon)}&localityLanguage=en`
          );
          const data = await res.json().catch(() => ({}));
          const locality =
            data?.locality ||
            data?.city ||
            data?.principalSubdivision ||
            "";
          const q = String(locality || "").trim();
          if (!q) return;

          const withQ = new URLSearchParams(next);
          withQ.set("q", q);
          setSearchParams(withQ, { replace: true });
          toast.message("Showing listings near you.", { description: q });
        } catch {
          toast.message("Couldn’t detect your area.", { description: "Try searching by suburb or city." });
        }
      },
      () => {
        toast.message("Location permission denied.", { description: "Search by suburb or city instead." });
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 5 * 60 * 1000 }
    );
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    // Visiting the feed marks reports as "seen" for update badge purposes.
    setReportsLastSeenAt(new Date().toISOString());
  }, []);

  const visibleItems = useMemo(() => {
    const q = urlQuery.toLowerCase();
    if (!q) return items;
    return items.filter((r) => {
      const haystack = [
        r?.petStatus,
        r?.location,
        r?.description,
        r?.firstName,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [items, urlQuery]);

  useEffect(() => {
    if (!highlightId) return;
    if (scrolledToHighlightRef.current) return;
    const el = document.getElementById(`report-${highlightId}`);
    if (!el) return;
    scrolledToHighlightRef.current = true;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [highlightId, visibleItems]);

  const stats = useMemo(() => {
    const lost = visibleItems.filter((r) => r.petStatus === "lost").length;
    const found = visibleItems.filter((r) => r.petStatus === "found").length;
    return { lost, found, total: visibleItems.length };
  }, [visibleItems]);

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

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:items-end">
            <form
              className="w-full sm:w-[380px]"
              onSubmit={(e) => {
                e.preventDefault();
                const nextQ = queryInput.trim();
                const next = new URLSearchParams(searchParams);
                if (nextQ) next.set("q", nextQ);
                else next.delete("q");
                setSearchParams(next, { replace: true });
              }}
            >
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  ref={searchInputRef}
                  value={queryInput}
                  onChange={(e) => setQueryInput(e.target.value)}
                  placeholder="Search by area or keyword…"
                  className="pl-9 pr-10"
                  aria-label="Search reports"
                />
                {queryInput.trim() ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
                    onClick={() => {
                      setQueryInput("");
                      const next = new URLSearchParams(searchParams);
                      next.delete("q");
                      setSearchParams(next, { replace: true });
                    }}
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                ) : null}
              </div>
            </form>

            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Total: {stats.total}</Badge>
                <ReportStatusBadge status="lost">Lost: {stats.lost}</ReportStatusBadge>
                <ReportStatusBadge status="found">Found: {stats.found}</ReportStatusBadge>
                {urlQuery ? (
                  <Badge variant="outline" className="truncate">
                    Filter: {urlQuery}
                  </Badge>
                ) : null}
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
        </div>

        <Separator className="my-8" />

        {visibleItems.length ? (
          <div className="grid gap-5 md:grid-cols-2">
            {visibleItems.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                onUpdate={setItems}
                highlighted={Boolean(highlightId) && String(report.id) === highlightId}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                {urlQuery ? "No matches" : "No reports yet"}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {urlQuery
                ? "Try a different keyword, or clear the search to browse everything."
                : "Be the first to submit a report."}
              <div className="mt-4">
                {urlQuery ? (
                  <Button
                    type="button"
                    variant="outline"
                    className="gap-2"
                    onClick={() => {
                      setQueryInput("");
                      const next = new URLSearchParams(searchParams);
                      next.delete("q");
                      setSearchParams(next, { replace: true });
                    }}
                  >
                    <X className="h-4 w-4" />
                    Clear search
                  </Button>
                ) : (
                  <Button type="button" className="gap-2" onClick={() => setReportOpen(true)}>
                    <Plus className="h-4 w-4" />
                    Add post
                  </Button>
                )}
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
        defaultPetStatus={defaultPetStatus}
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
