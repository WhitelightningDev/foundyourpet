import {
  NOTIFICATIONS_REGISTER_URL,
  WEB_PUSH_PUBLIC_KEY_URL,
  WEB_PUSH_SUBSCRIBE_URL,
} from "@/config/notifications";

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

export async function registerWebPushSubscription(subscription) {
  if (!subscription) return { ok: false, error: "Missing subscription" };

  try {
    const res = await fetch(WEB_PUSH_SUBSCRIBE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subscription,
        platform: "web",
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { ok: false, error: data?.message || "Failed to register subscription" };
    }

    return { ok: true };
  } catch (error) {
    return { ok: false, error: error?.message || "Network error" };
  }
}

export async function fetchWebPushPublicKey() {
  try {
    const res = await fetch(WEB_PUSH_PUBLIC_KEY_URL, { method: "GET" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { ok: false, error: data?.message || "Web Push not configured" };
    }
    const data = await res.json().catch(() => ({}));
    const publicKey = data?.publicKey || null;
    if (!publicKey) return { ok: false, error: "Missing public key" };
    return { ok: true, publicKey };
  } catch (error) {
    return { ok: false, error: error?.message || "Network error" };
  }
}
