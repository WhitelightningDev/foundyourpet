import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { isFirebaseConfigured } from "@/lib/firebase";
import { getFcmToken } from "@/lib/notifications";
import {
  isIOSDevice,
  isRunningStandalonePwa,
  isWebPushSupported,
  subscribeToWebPush,
  unsubscribeFromWebPush,
} from "@/lib/webPush";
import {
  fetchWebPushPublicKey,
  registerWebPushSubscription,
  registerWebPushToken,
  unregisterPushToken,
  unregisterWebPushSubscription,
} from "@/services/notifications";

function EnableNotificationsButton({ className }) {
  const [isWorking, setIsWorking] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    try {
      setIsEnabled(Boolean(localStorage.getItem("pushEnabled")));
    } catch {
      setIsEnabled(false);
    }
  }, []);

  const handleDisable = async () => {
    if (typeof window === "undefined") return;
    setIsWorking(true);
    try {
      const localSub = (() => {
        try {
          const raw = localStorage.getItem("webPushSubscription");
          return raw ? JSON.parse(raw) : null;
        } catch {
          return null;
        }
      })();

      const unsubRes = await unsubscribeFromWebPush();
      const endpoint = unsubRes.endpoint || localSub?.endpoint || null;

      if (endpoint) {
        await unregisterWebPushSubscription(endpoint);
      }

      const fcmToken = (() => {
        try {
          return localStorage.getItem("fcmToken");
        } catch {
          return null;
        }
      })();

      if (fcmToken) {
        await unregisterPushToken(fcmToken);
      }

      try {
        localStorage.removeItem("webPushSubscription");
        localStorage.removeItem("fcmToken");
        localStorage.removeItem("pushEnabled");
      } catch {
        // ignore
      }

      setIsEnabled(false);
      try {
        window.dispatchEvent(new Event("pushEnabledChanged"));
      } catch {
        // ignore
      }
      toast.message("Notifications disabled.");
    } finally {
      setIsWorking(false);
    }
  };

  const handleEnable = async () => {
    if (typeof window === "undefined") return;
    if (!("Notification" in window)) {
      toast.error("This browser doesn't support notifications.");
      return;
    }

    setIsWorking(true);
    try {
      if (isIOSDevice() && !isRunningStandalonePwa()) {
        toast.message("Install this app to enable notifications on iPhone/iPad.", {
          description: "Use Safari → Share → Add to Home Screen, then open the app from your Home Screen.",
        });
        return;
      }

      // Preferred for PWAs/desktop: standards-based Web Push.
      if (isWebPushSupported()) {
        const keyRes = process.env.REACT_APP_WEB_PUSH_PUBLIC_KEY
          ? { ok: true, publicKey: process.env.REACT_APP_WEB_PUSH_PUBLIC_KEY }
          : await fetchWebPushPublicKey();

        if (!keyRes.ok) {
          toast.error("Push notifications aren't configured for this site yet.", {
            description:
              keyRes.error ||
              "Set WEB_PUSH_VAPID_PUBLIC_KEY/WEB_PUSH_VAPID_PRIVATE_KEY on the backend and redeploy.",
          });
          return;
        }

        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          toast.message("Notifications are disabled.");
          return;
        }

        const subRes = await subscribeToWebPush({ vapidPublicKey: keyRes.publicKey });
        if (!subRes.ok) {
          toast.error("Couldn't enable notifications.", { description: subRes.error });
          return;
        }

        try {
          localStorage.setItem("webPushSubscription", JSON.stringify(subRes.subscription));
          localStorage.setItem("pushEnabled", "true");
        } catch {
          // ignore
        }

        const regRes = await registerWebPushSubscription(subRes.subscription);
        if (!regRes.ok) {
          toast.message("Notifications enabled, but server registration failed.", {
            description: regRes.error,
          });
          setIsEnabled(true);
          return;
        }

        toast.success("Notifications enabled.");
        setIsEnabled(true);
        try {
          window.dispatchEvent(new Event("pushEnabledChanged"));
        } catch {
          // ignore
        }
        return;
      }

      // Fallback: FCM token (useful for Android/Chrome, not supported in all browsers).
      if (!isFirebaseConfigured()) {
        toast.error("Push notifications aren't configured for this site yet.", {
          description: "Missing Web Push VAPID key and Firebase config.",
        });
        return;
      }

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        toast.message("Notifications are disabled.");
        return;
      }

      const token = await getFcmToken();
      if (!token) {
        toast.error("Couldn't enable notifications.");
        return;
      }

      try {
        localStorage.setItem("fcmToken", token);
        localStorage.setItem("pushEnabled", "true");
      } catch {
        // ignore
      }

      const res = await registerWebPushToken(token);
      if (!res.ok) {
        toast.message("Notifications enabled, but server registration failed.", {
          description: res.error,
        });
        setIsEnabled(true);
        return;
      }

      toast.success("Notifications enabled.");
      setIsEnabled(true);
      try {
        window.dispatchEvent(new Event("pushEnabledChanged"));
      } catch {
        // ignore
      }
    } finally {
      setIsWorking(false);
    }
  };

  return (
    <Button
      type="button"
      variant={isEnabled ? "secondary" : "outline"}
      className={cn("gap-2", className)}
      onClick={isEnabled ? handleDisable : handleEnable}
      disabled={isWorking}
    >
      <Bell className="h-4 w-4" />
      {isEnabled ? (isWorking ? "Disabling…" : "Disable notifications") : isWorking ? "Enabling…" : "Enable notifications"}
    </Button>
  );
}

export default EnableNotificationsButton;
