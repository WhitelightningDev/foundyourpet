import { API_BASE_URL } from "@/config/api";

export async function fetchAdminAnalyticsSummary({ token, days = 7 } = {}) {
  if (!token) return { ok: false, error: "Missing auth token" };

  const url = new URL(`${API_BASE_URL}/api/analytics/admin/summary`);
  url.searchParams.set("days", String(days));

  try {
    const res = await fetch(url.toString(), {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { ok: false, error: data?.message || "Failed to load analytics" };
    }

    const data = await res.json().catch(() => ({}));
    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: error?.message || "Network error" };
  }
}

