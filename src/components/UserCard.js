import React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Mail, Shield, User, ArrowRight } from "lucide-react";

function UserCard({ user, badgeVariant, badgeText, onView }) {
  const variantMap = {
    primary: "default",
    secondary: "secondary",
    default: "default",
    outline: "outline",
  };

  const mappedVariant = variantMap[badgeVariant] ?? "secondary";
  const initials = `${user?.name?.[0] ?? ""}${user?.surname?.[0] ?? ""}`.trim() || "U";

  return (
    <Card className="group overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border bg-muted/20 shadow-sm ring-1 ring-primary/10">
              <span className="text-base font-semibold text-primary">{initials}</span>
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold">
                {user?.name} {user?.surname}
              </div>
              <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                <Mail className="h-3.5 w-3.5" />
                <span className="truncate">{user?.email}</span>
              </div>
            </div>
          </div>

          <Badge variant={mappedVariant} className="shrink-0">
            {badgeText}
          </Badge>
        </div>

        <div className="mt-4 grid gap-2 text-sm">
          <div className="flex items-center justify-between gap-3 rounded-lg border bg-card px-3 py-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              {badgeText === "Admin" ? (
                <Shield className="h-4 w-4 text-primary" />
              ) : (
                <User className="h-4 w-4 text-primary" />
              )}
              <span>Role</span>
            </div>
            <span className="font-medium">{badgeText}</span>
          </div>

          {user?.contact ? (
            <div className="flex items-center justify-between gap-3 rounded-lg border bg-card px-3 py-2">
              <span className="text-muted-foreground">Contact</span>
              <span className="font-medium">{user.contact}</span>
            </div>
          ) : null}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-end border-t bg-muted/20 px-5 py-4">
        <Button
          size="sm"
          variant="outline"
          className="gap-2"
          onClick={() => onView(user._id)}
        >
          View details <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}

export default UserCard;
