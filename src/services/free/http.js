export async function safeJson(res) {
  return res.json().catch(() => ({}));
}

export async function fetchJson(url, options) {
  const res = await fetch(url, options);
  const data = await safeJson(res);
  return { res, data };
}

