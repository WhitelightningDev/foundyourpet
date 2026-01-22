const LAST_PUSH_KEY = "lastPushMessage";

export function getLastPushMessage() {
  try {
    const raw = localStorage.getItem(LAST_PUSH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setLastPushMessage(message) {
  try {
    localStorage.setItem(LAST_PUSH_KEY, JSON.stringify(message));
  } catch {
    // ignore
  }

  try {
    window.dispatchEvent(new Event("pushMessageReceived"));
  } catch {
    // ignore
  }
}

