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
