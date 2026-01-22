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

export const PUBLIC_PET_REPORT_URL = `${API_BASE_URL}${normalizePath(
  process.env.REACT_APP_PUBLIC_PET_REPORT_PATH || "/api/reports/public-pet"
)}`;

export const PUBLIC_REPORTS_FEED_URL = `${API_BASE_URL}${normalizePath(
  process.env.REACT_APP_PUBLIC_REPORTS_FEED_PATH || "/api/reports/public"
)}`;

export const REPORTS_API_PREFIX = `${API_BASE_URL}${normalizePath(
  process.env.REACT_APP_REPORTS_API_PREFIX || "/api/reports"
)}`;

export const reportCommentsUrl = (reportId) => `${REPORTS_API_PREFIX}/${reportId}/comments`;
export const reportReactionsUrl = (reportId) => `${REPORTS_API_PREFIX}/${reportId}/reactions`;
export const reportFlagUrl = (reportId) => `${REPORTS_API_PREFIX}/${reportId}/flag`;
