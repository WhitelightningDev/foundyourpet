import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import ReportCard from "@/components/ReportCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { freeServices } from "@/services/free";

export default function ReportShare() {
  const { reportId: reportIdParam } = useParams();
  const reportId = useMemo(() => decodeURIComponent(String(reportIdParam || "")), [reportIdParam]);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError("");

      const res = await freeServices.reports.fetchPublicReport({ reportId });
      if (!active) return;

      if (!res?.ok || !res.report) {
        setItems([]);
        setError(res?.error || "That report isn’t available.");
        setLoading(false);
        return;
      }

      setItems([res.report]);
      setLoading(false);
    }

    if (!reportId) {
      setItems([]);
      setError("Missing report link.");
      setLoading(false);
      return () => {
        active = false;
      };
    }

    load();
    return () => {
      active = false;
    };
  }, [reportId]);

  return (
    <main className="bg-background px-3 py-10 text-foreground sm:px-4 sm:py-16">
      <div className="mx-auto w-full max-w-4xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Pet Report</h1>
            <p className="text-sm text-muted-foreground">Open the full feed to react or leave a comment.</p>
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link to={`/reports?highlight=${encodeURIComponent(reportId)}`}>View in feed</Link>
            </Button>
            <Button asChild className="w-full sm:w-auto">
              <Link to="/reports">Browse reports</Link>
            </Button>
          </div>
        </div>

        <Separator className="my-6" />

        {loading ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Loading…</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">Fetching the latest report details.</CardContent>
          </Card>
        ) : error ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Report not available</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div>{error}</div>
              <Button asChild className="w-full sm:w-auto">
                <Link to="/reports">Go to reports</Link>
              </Button>
            </CardContent>
          </Card>
        ) : items[0] ? (
          <ReportCard report={items[0]} onUpdate={setItems} highlighted />
        ) : null}
      </div>
    </main>
  );
}

