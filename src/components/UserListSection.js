import React from "react";

import { Badge } from "@/components/ui/badge";
import UserCard from "./UserCard";

function UserListSection({ title, users, badgeVariant, badgeText, onView }) {
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
          <p className="text-sm text-muted-foreground">
            {badgeText} accounts • {users.length} total
          </p>
        </div>
        <Badge variant={badgeVariant === "default" ? "default" : "secondary"} className="w-fit">
          {users.length}
        </Badge>
      </div>

      {users.length === 0 ? (
        <div className="rounded-lg border bg-muted/20 p-6 text-sm text-muted-foreground">
          No users found.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <UserCard
              key={user._id}
              user={user}
              badgeVariant={badgeVariant}
              badgeText={badgeText}
              onView={onView}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default UserListSection;
