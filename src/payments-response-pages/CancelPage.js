import React from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

const CancelPage = () => {
  return (
    <main className="min-h-screen bg-muted/40 px-4 py-10">
      <div className="mx-auto w-full max-w-2xl">
        <Card className="shadow-sm">
          <CardHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <CardTitle>Payment cancelled</CardTitle>
                <CardDescription>
                  You cancelled the payment process. No charge was made.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <Button asChild className="w-full sm:w-auto">
              <Link to="/dashboard">Back to dashboard</Link>
            </Button>
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <Link to="/prices">View pricing</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default CancelPage;
