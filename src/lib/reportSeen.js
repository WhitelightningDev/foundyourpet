const LAST_SEEN_KEY = "reportsLastSeenAt";
const LAST_LATEST_KEY = "reportsLastLatestAt";

export function getReportsLastSeenAt() {
  try {
    return localStorage.getItem(LAST_SEEN_KEY);
  } catch {
    return null;
  }
}

export function setReportsLastSeenAt(isoString) {
  try {
    localStorage.setItem(LAST_SEEN_KEY, isoString);
  } catch {
    // ignore
  }
}

export function getReportsLastLatestAt() {
  try {
    return localStorage.getItem(LAST_LATEST_KEY);
  } catch {
    return null;
  }
}

export function setReportsLastLatestAt(isoString) {
  try {
    localStorage.setItem(LAST_LATEST_KEY, isoString);
  } catch {
    // ignore
  }
}

export function ensureReportsLastSeenInitialized() {
  const existing = getReportsLastSeenAt();
  if (existing) return existing;
  const now = new Date().toISOString();
  setReportsLastSeenAt(now);
  return now;
}

