import { API_BASE_URL } from "@/config/api";

export async function fetchAdminReports({ token, page = 1, limit = 12, status = "", hidden } = {}) {
  if (!token) return { ok: false, error: "Missing auth token" };

  const url = new URL(`${API_BASE_URL}/api/reports/admin`);
  url.searchParams.set("page", String(page));
  url.searchParams.set("limit", String(limit));
  if (status) url.searchParams.set("status", status);
  if (hidden === true) url.searchParams.set("hidden", "true");
  if (hidden === false) url.searchParams.set("hidden", "false");

  try {
    const res = await fetch(url.toString(), {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { ok: false, error: data?.message || "Failed to load reports" };
    }
    const data = await res.json().catch(() => ({}));
    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: error?.message || "Network error" };
  }
}

export async function deleteAdminReport({ token, reportId }) {
  if (!token) return { ok: false, error: "Missing auth token" };
  if (!reportId) return { ok: false, error: "Missing reportId" };

  try {
    const res = await fetch(`${API_BASE_URL}/api/reports/${reportId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { ok: false, error: data?.message || "Failed to delete report" };
    }
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error?.message || "Network error" };
  }
}

export async function setReportHidden({ token, reportId, hidden }) {
  if (!token) return { ok: false, error: "Missing auth token" };
  if (!reportId) return { ok: false, error: "Missing reportId" };

  const path = hidden ? "hide" : "unhide";
  try {
    const res = await fetch(`${API_BASE_URL}/api/reports/${reportId}/${path}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { ok: false, error: data?.message || "Failed to update report" };
    }
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error?.message || "Network error" };
  }
}

