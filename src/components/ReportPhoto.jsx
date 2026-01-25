import React from "react";
import { Cat, Dog, PawPrint } from "lucide-react";

import { cn } from "@/lib/utils";

function normalizePetType(value) {
  const normalized = String(value || "").toLowerCase();
  if (normalized === "cat") return "cat";
  if (normalized === "dog") return "dog";
  return "unknown";
}

export default function ReportPhoto({ photoUrl, petType, alt, className, imgClassName }) {
  const normalizedPetType = normalizePetType(petType);

  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={alt}
        className={cn("w-full object-cover", imgClassName, className)}
        loading="lazy"
      />
    );
  }

  const Icon = normalizedPetType === "cat" ? Cat : normalizedPetType === "dog" ? Dog : PawPrint;
  const label = alt || (normalizedPetType === "cat" ? "Cat" : normalizedPetType === "dog" ? "Dog" : "Pet");

  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        "flex w-full items-center justify-center bg-muted/30 text-muted-foreground",
        className
      )}
    >
      <div className="flex flex-col items-center gap-2">
        <Icon className="h-10 w-10" />
        <div className="text-xs font-medium">{label}</div>
      </div>
    </div>
  );
}

