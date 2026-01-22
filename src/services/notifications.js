import { NOTIFICATIONS_REGISTER_URL } from "@/config/notifications";

export async function registerWebPushToken(token) {
  if (!token) return { ok: false, error: "Missing token" };

  try {
    const res = await fetch(NOTIFICATIONS_REGISTER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        platform: "web",
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { ok: false, error: data?.message || "Failed to register token" };
    }

    return { ok: true };
  } catch (error) {
    return { ok: false, error: error?.message || "Network error" };
  }
}

