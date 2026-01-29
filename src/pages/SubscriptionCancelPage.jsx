import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const SubscriptionCancelPage = () => {
  return (
    <main className="min-h-screen bg-muted/40 px-4 py-10">
      <div className="mx-auto w-full max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Subscription cancelled</CardTitle>
            <CardDescription>
              You cancelled the PayFast checkout. No subscription was activated.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild>
              <Link to="/select-tag/standard">Try again</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default SubscriptionCancelPage;
