import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const PetListSkeleton = ({ count = 3 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <Card
          key={index}
          className="shadow-sm"
        >
          <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
            <Skeleton className="h-16 w-16 rounded-full" />

            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-28" />
            </div>

            <div className="flex flex-wrap gap-2 sm:justify-end">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-24" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PetListSkeleton;
