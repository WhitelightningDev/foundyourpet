function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function isRunningStandalonePwa() {
  if (typeof window === "undefined") return false;
  const isStandaloneDisplayMode =
    window.matchMedia?.("(display-mode: standalone)")?.matches || false;
  // iOS legacy
  const isIosStandalone = window.navigator?.standalone === true;
  return isStandaloneDisplayMode || isIosStandalone;
}

export function isIOSDevice() {
  if (typeof navigator === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

export function isWebPushSupported() {
  if (typeof window === "undefined") return false;
  return (
    "Notification" in window &&
    "serviceWorker" in navigator &&
    "PushManager" in window
  );
}

export async function registerPushServiceWorker() {
  if (typeof window === "undefined") return null;
  if (!("serviceWorker" in navigator)) return null;
  try {
    return await navigator.serviceWorker.register("/push-sw.js");
  } catch {
    return null;
  }
}

export async function getWebPushSubscription() {
  if (!isWebPushSupported()) return null;
  const registration = await registerPushServiceWorker();
  if (!registration) return null;
  try {
    return await registration.pushManager.getSubscription();
  } catch {
    return null;
  }
}

export async function unsubscribeFromWebPush() {
  const subscription = await getWebPushSubscription();
  if (!subscription) return { ok: true, endpoint: null };
  const endpoint = subscription.endpoint || null;
  try {
    await subscription.unsubscribe();
    return { ok: true, endpoint };
  } catch (error) {
    return { ok: false, endpoint, error: error?.message || "Failed to unsubscribe" };
  }
}

export async function subscribeToWebPush({ vapidPublicKey } = {}) {
  const key = vapidPublicKey || process.env.REACT_APP_WEB_PUSH_PUBLIC_KEY;
  if (!key) {
    return { ok: false, error: "Missing REACT_APP_WEB_PUSH_PUBLIC_KEY" };
  }

  if (!isWebPushSupported()) {
    return { ok: false, error: "Web Push is not supported in this browser." };
  }

  const registration = await registerPushServiceWorker();
  if (!registration) return { ok: false, error: "Service worker registration failed." };

  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(key),
    });
    return { ok: true, subscription };
  } catch (err) {
    return { ok: false, error: err?.message || "Failed to subscribe to push." };
  }
}
