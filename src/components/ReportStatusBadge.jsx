import React from "react";
import { AlertTriangle, CheckCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function ReportStatusBadge({ status, className, children }) {
  const normalized = String(status || "").toLowerCase();
  const isFound = normalized === "found";

  const Icon = isFound ? CheckCircle : AlertTriangle;
  const label = children ?? (isFound ? "Found" : "Lost");

  return (
    <Badge
      className={cn(
        "gap-1.5",
        isFound
          ? "border-emerald-300/70 bg-emerald-100 text-emerald-950 hover:bg-emerald-100 dark:border-emerald-500/40 dark:bg-emerald-500/15 dark:text-emerald-200 dark:hover:bg-emerald-500/15"
          : "border-yellow-300/80 bg-yellow-100 text-yellow-950 hover:bg-yellow-100 dark:border-yellow-500/40 dark:bg-yellow-500/15 dark:text-yellow-200 dark:hover:bg-yellow-500/15",
        className
      )}
    >
      <Icon
        className={cn(
          "h-3.5 w-3.5",
          isFound ? "text-emerald-600 dark:text-emerald-300" : "text-yellow-600 dark:text-yellow-300"
        )}
      />
      <span className="capitalize">{label}</span>
    </Badge>
  );
}
