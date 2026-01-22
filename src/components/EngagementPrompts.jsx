import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Bell, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import EnableNotificationsButton from "@/components/EnableNotificationsButton";
import { isIOSDevice, isRunningStandalonePwa } from "@/lib/webPush";

const daysSince = (iso) => {
  const ms = Date.now() - (Date.parse(iso || "") || 0);
  return ms / (24 * 60 * 60 * 1000);
};

function shouldShowWithCooldown(key, cooldownDays) {
  try {
    const last = localStorage.getItem(key);
    if (!last) return true;
    return daysSince(last) >= cooldownDays;
  } catch {
    return true;
  }
}

function dismiss(key) {
  try {
    localStorage.setItem(key, new Date().toISOString());
  } catch {
    // ignore
  }
}

function EngagementPrompts({ className }) {
  const location = useLocation();
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState(null);
  const [pushEnabled, setPushEnabled] = useState(() => {
    try {
      return Boolean(localStorage.getItem("pushEnabled"));
    } catch {
      return false;
    }
  });

  const showOnThisRoute = useMemo(() => {
    const path = location.pathname.toLowerCase();
    return path === "/" || path.startsWith("/reports");
  }, [location.pathname]);

  const isInstalled = useMemo(() => isRunningStandalonePwa(), []);
  const isIos = useMemo(() => isIOSDevice(), []);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredInstallPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const canShowInstall =
    showOnThisRoute &&
    !isInstalled &&
    shouldShowWithCooldown("dismissedInstallPromptAt", 3);

  useEffect(() => {
    const sync = () => {
      try {
        setPushEnabled(Boolean(localStorage.getItem("pushEnabled")));
      } catch {
        setPushEnabled(false);
      }
    };

    window.addEventListener("storage", sync);
    window.addEventListener("pushEnabledChanged", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("pushEnabledChanged", sync);
    };
  }, []);

  const canShowPush =
    showOnThisRoute &&
    !pushEnabled &&
    typeof window !== "undefined" &&
    "Notification" in window &&
    window.Notification.permission === "default" &&
    shouldShowWithCooldown("dismissedPushPromptAt", 2);

  if (!canShowInstall && !canShowPush) return null;

  return (
    <div
      className={cn(
        "fixed bottom-4 left-1/2 z-50 w-[min(720px,calc(100%-2rem))] -translate-x-1/2",
        className
      )}
    >
      <Card className="border bg-background/95 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/75">
        <CardContent className="space-y-4 p-4 sm:p-5">
          {canShowInstall ? (
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Download className="h-4 w-4 text-primary" />
                    Install the app
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Install Found Your Pet for a faster experience and easier notifications.
                  </div>
                </div>
                <Button type="button" variant="ghost" size="sm" onClick={() => dismiss("dismissedInstallPromptAt")}>
                  Not now
                </Button>
              </div>

              {deferredInstallPrompt ? (
                <Button
                  type="button"
                  className="w-full sm:w-auto"
                  onClick={async () => {
                    try {
                      await deferredInstallPrompt.prompt();
                      await deferredInstallPrompt.userChoice;
                    } finally {
                      setDeferredInstallPrompt(null);
                      dismiss("dismissedInstallPromptAt");
                    }
                  }}
                >
                  Install
                </Button>
              ) : isIos ? (
                <div className="rounded-lg border bg-muted/20 p-3 text-sm text-muted-foreground">
                  <div className="font-medium text-foreground">iPhone / iPad</div>
                  <div className="mt-1">
                    Open in Safari → Share → <span className="font-medium">Add to Home Screen</span>.
                    Then open the app from your Home Screen.
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border bg-muted/20 p-3 text-sm text-muted-foreground">
                  <div className="font-medium text-foreground">Android / Desktop</div>
                  <div className="mt-1">
                    Use your browser menu → <span className="font-medium">Install app</span> (or “Add to Home screen”).
                  </div>
                </div>
              )}
            </div>
          ) : null}

          {canShowInstall && canShowPush ? <Separator /> : null}

          {canShowPush ? (
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Bell className="h-4 w-4 text-primary" />
                    Enable notifications
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Get alerts when new lost/found reports are posted.
                  </div>
                </div>
                <Button type="button" variant="ghost" size="sm" onClick={() => dismiss("dismissedPushPromptAt")}>
                  Not now
                </Button>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <EnableNotificationsButton className="w-full justify-center sm:w-auto" />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-center sm:w-auto"
                  onClick={() => dismiss("dismissedPushPromptAt")}
                >
                  Dismiss
                </Button>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

export default EngagementPrompts;
