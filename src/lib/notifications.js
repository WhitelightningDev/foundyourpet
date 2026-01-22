import { getToken, isSupported, onMessage, getMessaging } from "firebase/messaging";
import { getFirebaseApp, isFirebaseConfigured } from "@/lib/firebase";

export async function isFcmSupported() {
  if (!isFirebaseConfigured()) return false;
  try {
    return await isSupported();
  } catch {
    return false;
  }
}

export async function registerFcmServiceWorker() {
  if (typeof window === "undefined") return null;
  if (!("serviceWorker" in navigator)) return null;
  try {
    return await navigator.serviceWorker.register("/firebase-messaging-sw.js");
  } catch {
    return null;
  }
}

export async function getFcmToken() {
  const vapidKey = process.env.REACT_APP_FIREBASE_VAPID_KEY;
  if (!vapidKey) return null;

  const supported = await isFcmSupported();
  if (!supported) return null;

  const app = getFirebaseApp();
  if (!app) return null;

  const registration = await registerFcmServiceWorker();
  const messaging = getMessaging(app);

  try {
    return await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: registration || undefined,
    });
  } catch {
    return null;
  }
}

export async function listenForForegroundMessages(handler) {
  const supported = await isFcmSupported();
  if (!supported) return () => {};

  const app = getFirebaseApp();
  if (!app) return () => {};

  const messaging = getMessaging(app);
  return onMessage(messaging, handler);
}

