const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;

export function formatTimeAgo(input) {
  const date = input instanceof Date ? input : new Date(input);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (!Number.isFinite(seconds)) return "";

  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });

  if (seconds < 10) return "just now";
  if (seconds < MINUTE) return rtf.format(-seconds, "second");
  if (seconds < HOUR) return rtf.format(-Math.floor(seconds / MINUTE), "minute");
  if (seconds < DAY) return rtf.format(-Math.floor(seconds / HOUR), "hour");
  if (seconds < WEEK) return rtf.format(-Math.floor(seconds / DAY), "day");
  return rtf.format(-Math.floor(seconds / WEEK), "week");
}

