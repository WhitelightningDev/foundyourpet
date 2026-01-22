import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";

import { trackAnalyticsEvent } from "@/services/analytics";

function getOrCreateStorageId(key, storage) {
  try {
    const existing = storage.getItem(key);
    if (existing) return existing;
    const uuid =
      typeof window !== "undefined" && window.crypto?.randomUUID
        ? window.crypto.randomUUID()
        : `${Date.now()}_${Math.random().toString(16).slice(2)}`;
    const id = uuid.toString();
    storage.setItem(key, id);
    return id;
  } catch {
    return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
  }
}

function AnalyticsTracker() {
  const location = useLocation();

  const { clientId, sessionId } = useMemo(() => {
    if (typeof window === "undefined") return { clientId: "", sessionId: "" };
    return {
      clientId: getOrCreateStorageId("analyticsClientId", window.localStorage),
      sessionId: getOrCreateStorageId("analyticsSessionId", window.sessionStorage),
    };
  }, []);

  useEffect(() => {
    if (!clientId || !sessionId) return;
    const payload = {
      clientId,
      sessionId,
      eventType: "session_start",
      path: window.location.pathname,
      referrer: document.referrer || "",
      userAgent: navigator.userAgent,
    };

    trackAnalyticsEvent(payload);
    return undefined;
  }, [clientId, sessionId]);

  useEffect(() => {
    if (!clientId || !sessionId) return;
    trackAnalyticsEvent({
      clientId,
      sessionId,
      eventType: "pageview",
      path: location.pathname,
      referrer: document.referrer || "",
      userAgent: navigator.userAgent,
    });
  }, [clientId, sessionId, location.pathname]);

  useEffect(() => {
    if (!clientId || !sessionId) return undefined;

    const interval = setInterval(() => {
      if (document.visibilityState !== "visible") return;
      trackAnalyticsEvent({
        clientId,
        sessionId,
        eventType: "heartbeat",
        path: window.location.pathname,
        userAgent: navigator.userAgent,
      });
    }, 20_000);

    const onVisibility = () => {
      trackAnalyticsEvent({
        clientId,
        sessionId,
        eventType: "heartbeat",
        path: window.location.pathname,
        userAgent: navigator.userAgent,
      });
    };

    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [clientId, sessionId]);

  return null;
}

export default AnalyticsTracker;
