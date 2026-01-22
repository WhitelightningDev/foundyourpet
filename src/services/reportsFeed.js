import { API_BASE_URL } from "@/config/api";
import {
  PUBLIC_REPORTS_FEED_URL,
  reportCommentsUrl,
  reportFlagUrl,
  reportReactionsUrl,
} from "@/config/notifications";
import {
  addLocalComment,
  addLocalReport,
  flagLocalReport,
  getLocalReport,
  listLocalReports,
  toggleLocalReaction,
} from "@/lib/localReportsStore";

function normalizeReport(report) {
  if (!report) return null;
  const id = report.id || report._id;
  if (!id) return null;

  const rawPhoto = report.photoUrl || report.photo || report.photoDataUrl;
  const photoUrl =
    typeof rawPhoto === "string" && rawPhoto.startsWith("http")
      ? rawPhoto
      : typeof rawPhoto === "string" && rawPhoto.startsWith("data:")
        ? rawPhoto
        : typeof rawPhoto === "string" && rawPhoto
          ? `${API_BASE_URL}${rawPhoto}`
          : null;

  return {
    id,
    firstName: report.firstName || report.name || "Anonymous",
    petStatus: (report.petStatus || report.status || "lost").toLowerCase(),
    location: report.location || "",
    createdAt: report.createdAt || report.created_at || report.timestamp || new Date().toISOString(),
    photoUrl,
    description: report.description || "",
    reactions: report.reactions || { like: 0, heart: 0, help: 0, seen: 0, helped: 0 },
    myReaction: report.myReaction || null,
    comments: Array.isArray(report.comments) ? report.comments : [],
    commentsCount: Number.isFinite(report.commentsCount)
      ? report.commentsCount
      : Array.isArray(report.comments)
        ? report.comments.length
        : 0,
  };
}

export async function fetchPublicReports({ page = 1, limit = 10 } = {}) {
  const url = new URL(PUBLIC_REPORTS_FEED_URL);
  url.searchParams.set("page", String(page));
  url.searchParams.set("limit", String(limit));

  try {
    const res = await fetch(url.toString(), { method: "GET" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json().catch(() => ({}));
    const items = (data?.items || data?.reports || data || []).map(normalizeReport).filter(Boolean);

    const nextPage =
      data?.nextPage ??
      (items.length === limit ? page + 1 : null);

    return { ok: true, items, nextPage };
  } catch {
    return listLocalReports({ page, limit });
  }
}

export async function createPublicReportFallbackToLocal(form) {
  return addLocalReport(form);
}

export async function postComment({ reportId, name, text }) {
  try {
    const res = await fetch(reportCommentsUrl(reportId), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, text }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json().catch(() => ({}));
    const report = normalizeReport(data?.report);
    const comment = data?.comment || null;
    return { ok: true, data, report, comment };
  } catch {
    return addLocalComment(reportId, { name, text });
  }
}

export async function fetchComments({ reportId, page = 1, limit = 20 } = {}) {
  try {
    const url = new URL(reportCommentsUrl(reportId));
    url.searchParams.set("page", String(page));
    url.searchParams.set("limit", String(limit));

    const res = await fetch(url.toString(), { method: "GET" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json().catch(() => ({}));
    const items = Array.isArray(data?.items) ? data.items : [];
    const nextPage = data?.nextPage ?? null;
    return { ok: true, items, nextPage };
  } catch {
    const local = getLocalReport(reportId);
    const items = Array.isArray(local?.comments) ? local.comments : [];
    return { ok: true, items, nextPage: null };
  }
}

export async function toggleReaction({ reportId, reactionType }) {
  try {
    const res = await fetch(reportReactionsUrl(reportId), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reaction: reactionType }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json().catch(() => ({}));
    const report = normalizeReport(data?.report);
    return { ok: true, data, report };
  } catch {
    return toggleLocalReaction(reportId, reactionType);
  }
}

export async function flagReport({ reportId, reason, details }) {
  try {
    const res = await fetch(reportFlagUrl(reportId), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason, details }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json().catch(() => ({}));
    return { ok: true, data };
  } catch {
    return flagLocalReport(reportId, { reason, details });
  }
}
