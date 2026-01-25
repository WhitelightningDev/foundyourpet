import React, { useEffect, useMemo, useState } from "react";
import { AlertTriangle, EyeOff, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import ReportPhoto from "@/components/ReportPhoto";
import ReportStatusBadge from "@/components/ReportStatusBadge";
import { cn } from "@/lib/utils";
import { formatTimeAgo } from "@/lib/timeAgo";
import { deleteAdminReport, fetchAdminReports, setReportHidden } from "@/services/adminReports";

function AdminReportsCard({ token, className }) {
  const [items, setItems] = useState([]);
  const [nextPage, setNextPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [query, setQuery] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [workingId, setWorkingId] = useState(null);

  const load = async ({ page = 1, replace = false } = {}) => {
    setLoading(true);
    setError("");
    const res = await fetchAdminReports({
      token,
      page,
      limit: 12,
      status: statusFilter || "",
    });
    if (!res.ok) {
      setError(res.error || "Failed to load reports");
      setLoading(false);
      return;
    }

    setItems((prev) => (replace ? res.data.items : [...prev, ...res.data.items]));
    setNextPage(res.data.nextPage || null);
    setLoading(false);
  };

  useEffect(() => {
    load({ page: 1, replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, token]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((r) => {
      const haystack = [r.firstName, r.lastName, r.phoneNumber, r.location, r.petStatus]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [items, query]);

  const hasMore = Boolean(nextPage);

  const confirmDelete = async () => {
    if (!deleteId) return;
    setWorkingId(deleteId);
    try {
      const res = await deleteAdminReport({ token, reportId: deleteId });
      if (!res.ok) {
        toast.error("Couldn't delete report.", { description: res.error });
        return;
      }
      setItems((prev) => prev.filter((r) => r.id !== deleteId));
      toast.success("Report deleted.");
      setDeleteId(null);
    } finally {
      setWorkingId(null);
    }
  };

  const toggleHidden = async (report) => {
    setWorkingId(report.id);
    try {
      const res = await setReportHidden({ token, reportId: report.id, hidden: !report.isHidden });
      if (!res.ok) {
        toast.error("Couldn't update report.", { description: res.error });
        return;
      }
      setItems((prev) =>
        prev.map((r) => (r.id === report.id ? { ...r, isHidden: !r.isHidden } : r))
      );
    } finally {
      setWorkingId(null);
    }
  };

  return (
    <>
      <Card className={cn(className)}>
        <CardHeader className="space-y-2">
          <CardTitle className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-primary" />
              Reported pets
            </span>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant={statusFilter === "" ? "secondary" : "outline"}
                onClick={() => setStatusFilter("")}
              >
                All
              </Button>
              <Button
                type="button"
                size="sm"
                variant={statusFilter === "lost" ? "secondary" : "outline"}
                onClick={() => setStatusFilter("lost")}
              >
                Lost
              </Button>
              <Button
                type="button"
                size="sm"
                variant={statusFilter === "found" ? "secondary" : "outline"}
                onClick={() => setStatusFilter("found")}
              >
                Found
              </Button>
            </div>
          </CardTitle>
          <CardDescription>Moderate public lost/found reports.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, phone, location…"
              className="sm:max-w-sm"
            />
            <Button type="button" variant="outline" disabled={loading} onClick={() => load({ page: 1, replace: true })}>
              Refresh
            </Button>
          </div>

          {error ? (
            <div className="rounded-lg border bg-destructive/5 p-4 text-sm text-destructive">
              {error}
            </div>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((r) => (
              <div key={r.id} className="overflow-hidden rounded-xl border bg-card">
                <div className="grid grid-cols-5">
                  <div className="col-span-2">
                    <ReportPhoto
                      photoUrl={r.photoUrl}
                      petType={r.petType}
                      alt="Reported pet"
                      className="h-full min-h-24"
                      imgClassName="h-full min-h-24"
                    />
                  </div>
                  <div className="col-span-3 space-y-2 p-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <ReportStatusBadge status={r.petStatus} />
                      <Badge variant="outline">{formatTimeAgo(r.createdAt)}</Badge>
                      {r.isHidden ? <Badge variant="outline">Hidden</Badge> : null}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">{r.firstName}</span>{" "}
                      <span className="text-muted-foreground">• {r.location}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Comments: {r.commentsCount} • Flags: {r.flagsCount}
                    </div>

                    <Separator />

                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="gap-2"
                        disabled={workingId === r.id}
                        onClick={() => toggleHidden(r)}
                      >
                        <EyeOff className="h-4 w-4" />
                        {r.isHidden ? "Unhide" : "Hide"}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        className="gap-2"
                        disabled={workingId === r.id}
                        onClick={() => setDeleteId(r.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {loading && !items.length ? (
            <div className="text-sm text-muted-foreground">Loading…</div>
          ) : null}

          <div className="flex items-center justify-center">
            {hasMore ? (
              <Button
                type="button"
                variant="secondary"
                disabled={loading}
                onClick={() => load({ page: nextPage })}
              >
                {loading ? "Loading…" : "Load more"}
              </Button>
            ) : items.length ? (
              <div className="text-sm text-muted-foreground">End of results.</div>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Dialog open={Boolean(deleteId)} onOpenChange={(open) => (!open ? setDeleteId(null) : null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete report?</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-muted-foreground">
            This permanently deletes the report and its comments/reactions/flags.
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" disabled={workingId === deleteId} onClick={confirmDelete}>
              {workingId === deleteId ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AdminReportsCard;
