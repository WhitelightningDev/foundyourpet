import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getFcmToken, isFcmSupported } from "@/lib/notifications";
import { registerWebPushToken } from "@/services/notifications";

function EnableNotificationsButton({ className }) {
  const [isWorking, setIsWorking] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    try {
      setIsEnabled(Boolean(localStorage.getItem("fcmToken")));
    } catch {
      setIsEnabled(false);
    }
  }, []);

  const handleEnable = async () => {
    if (typeof window === "undefined") return;
    if (!("Notification" in window)) {
      toast.error("This browser doesn't support notifications.");
      return;
    }

    setIsWorking(true);
    try {
      const supported = await isFcmSupported();
      if (!supported) {
        toast.error("Push notifications aren't configured for this site yet.");
        return;
      }

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        toast.message("Notifications are disabled.");
        return;
      }

      const token = await getFcmToken();
      if (!token) {
        toast.error("Couldn't enable notifications. Missing Firebase settings?");
        return;
      }

      try {
        localStorage.setItem("fcmToken", token);
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
    } finally {
      setIsWorking(false);
    }
  };

  return (
    <Button
      type="button"
      variant={isEnabled ? "secondary" : "outline"}
      className={cn("gap-2", className)}
      onClick={handleEnable}
      disabled={isWorking}
    >
      <Bell className="h-4 w-4" />
      {isEnabled ? "Notifications enabled" : isWorking ? "Enabling…" : "Enable notifications"}
    </Button>
  );
}

export default EnableNotificationsButton;

