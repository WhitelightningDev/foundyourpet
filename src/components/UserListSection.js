import React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function UserListSection({ title, users, badgeVariant, badgeText, onView }) {
  const initialsFor = (user) =>
    `${user?.name?.[0] ?? ""}${user?.surname?.[0] ?? ""}`.trim() || "U";

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
        <div className="overflow-hidden rounded-xl border bg-card">
          <div className="hidden grid-cols-12 gap-3 border-b bg-muted/30 px-4 py-3 text-xs font-medium text-muted-foreground md:grid">
            <div className="col-span-4">User</div>
            <div className="col-span-4">Email</div>
            <div className="col-span-2">Contact</div>
            <div className="col-span-1">Role</div>
            <div className="col-span-1 text-right">Action</div>
          </div>

          {users.map((user) => (
            <div
              key={user._id}
              className="grid grid-cols-12 items-center gap-3 border-b px-4 py-3 last:border-b-0 hover:bg-accent/30"
            >
              <div className="col-span-12 md:col-span-4">
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl border bg-muted/20 text-xs font-semibold text-primary ring-1 ring-primary/10">
                    {initialsFor(user)}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">
                      {user?.name} {user?.surname}
                    </div>
                    <div className="truncate text-xs text-muted-foreground md:hidden">
                      {user?.email}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-12 hidden truncate text-sm md:col-span-4 md:block">
                {user?.email}
              </div>

              <div className="col-span-6 truncate text-sm text-muted-foreground md:col-span-2">
                {user?.contact || "—"}
              </div>

              <div className="col-span-6 flex justify-end md:col-span-1 md:justify-start">
                <Badge variant={badgeVariant === "default" ? "default" : "secondary"}>
                  {badgeText}
                </Badge>
              </div>

              <div className="col-span-12 flex justify-end md:col-span-1">
                <Button size="sm" variant="outline" onClick={() => onView(user._id)}>
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default UserListSection;
