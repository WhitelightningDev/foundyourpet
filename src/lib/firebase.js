import { initializeApp, getApp, getApps } from "firebase/app";

export function getFirebaseConfig() {
  return {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
  };
}

export function isFirebaseConfigured() {
  const config = getFirebaseConfig();
  return Object.values(config).every(Boolean);
}

export function getFirebaseApp() {
  if (!isFirebaseConfigured()) return null;
  if (getApps().length) return getApp();
  return initializeApp(getFirebaseConfig());
}

