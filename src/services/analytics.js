import { API_BASE_URL } from "@/config/api";

const ANALYTICS_TRACK_URL = `${API_BASE_URL}/api/analytics/track`;

export async function trackAnalyticsEvent(payload) {
  try {
    await fetch(ANALYTICS_TRACK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch {
    // ignore
  }
}

