import * as React from "react";

import { cn } from "@/lib/utils";

function clamp(value) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, value));
}

const Progress = React.forwardRef(({ className, value = 0, ...props }, ref) => {
  const pct = clamp(Number(value));
  return (
    <div
      ref={ref}
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-muted", className)}
      {...props}
    >
      <div
        className="h-full w-full flex-1 bg-primary transition-all"
        style={{ transform: `translateX(-${100 - pct}%)` }}
      />
    </div>
  );
});
Progress.displayName = "Progress";

export { Progress };

