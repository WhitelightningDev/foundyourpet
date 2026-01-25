import { API_BASE_URL } from "./api";

const normalizePath = (path) => {
  if (!path) return "";
  return path.startsWith("/") ? path : `/${path}`;
};

export const NOTIFICATIONS_REGISTER_URL = `${API_BASE_URL}${normalizePath(
  process.env.REACT_APP_NOTIFICATIONS_REGISTER_PATH || "/api/notifications/register"
)}`;

export const WEB_PUSH_SUBSCRIBE_URL = `${API_BASE_URL}${normalizePath(
  process.env.REACT_APP_WEB_PUSH_SUBSCRIBE_PATH || "/api/notifications/webpush/subscribe"
)}`;

export const WEB_PUSH_PUBLIC_KEY_URL = `${API_BASE_URL}${normalizePath(
  process.env.REACT_APP_WEB_PUSH_PUBLIC_KEY_PATH || "/api/notifications/webpush/public-key"
)}`;

export const WEB_PUSH_UNSUBSCRIBE_URL = `${API_BASE_URL}${normalizePath(
  process.env.REACT_APP_WEB_PUSH_UNSUBSCRIBE_PATH || "/api/notifications/webpush/unsubscribe"
)}`;

export const NOTIFICATIONS_UNREGISTER_URL = `${API_BASE_URL}${normalizePath(
  process.env.REACT_APP_NOTIFICATIONS_UNREGISTER_PATH || "/api/notifications/unregister"
)}`;
