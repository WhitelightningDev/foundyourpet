function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function guessProtocol(req) {
  const proto = (req.headers["x-forwarded-proto"] || "").toString().split(",")[0].trim();
  if (proto === "http" || proto === "https") return proto;
  return "https";
}

function normalizePetType(value) {
  const normalized = (value || "").toString().toLowerCase().trim();
  if (normalized === "cat") return "cat";
  if (normalized === "dog") return "dog";
  return "other";
}

function absoluteUrl(base, path) {
  if (!base || !path) return "";
  const baseTrimmed = base.replace(/\/+$/, "");
  const pathTrimmed = path.replace(/^\/+/, "");
  return `${baseTrimmed}/${pathTrimmed}`;
}

function resolveOgImageUrl({ report, apiBase, siteUrl, petType }) {
  const raw = (
    report?.photoUrl ||
    report?.photo ||
    report?.photo_path ||
    report?.photoPath ||
    report?.photoURL ||
    ""
  )
    .toString()
    .trim();

  if (raw && raw.startsWith("http")) return raw;
  if (raw && raw.startsWith("data:")) return "";
  if (raw && raw.startsWith("/")) return absoluteUrl(apiBase, raw);
  if (raw) return absoluteUrl(apiBase, raw);

  if (!siteUrl) return "";
  const placeholder = petType === "cat" ? "og-cat.png" : "og-dog.png";
  return absoluteUrl(siteUrl, placeholder);
}

module.exports = async (req, res) => {
  const id = (req.query?.id || "").toString().trim();
  const protocol = guessProtocol(req);
  const host = (req.headers.host || "").toString();
  const siteUrl = host ? `${protocol}://${host}` : "";

  const apiBase =
    process.env.API_BASE_URL ||
    process.env.PUBLIC_API_BASE_URL ||
    process.env.REACT_APP_API_BASE_URL ||
    "https://foundyourpet-backend.onrender.com";

  let report = null;
  try {
    const apiRes = await fetch(`${apiBase.replace(/\\/+$/, "")}/api/reports/public/${encodeURIComponent(id)}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    if (apiRes.ok) {
      const data = await apiRes.json().catch(() => ({}));
      report = data?.report || null;
    }
  } catch {
    // ignore
  }

  const petStatus = (report?.petStatus || "").toString().toLowerCase() === "found" ? "found" : "lost";
  const petType = normalizePetType(report?.petType);
  const petName = (report?.petName || "").toString().trim();
  const location = (report?.location || "").toString().trim();
  const postedBy = (report?.postedBy || report?.firstName || "").toString().trim();

  const title = [
    petName ? `${petName} is ${petStatus}` : `A ${petStatus} pet was reported`,
    location ? `in ${location}` : null,
  ]
    .filter(Boolean)
    .join(" ");

  const description = [
    location ? `Location: ${location}` : null,
    postedBy ? `Posted by: ${postedBy}` : null,
  ]
    .filter(Boolean)
    .join(" • ");

  const imageUrl = resolveOgImageUrl({ report, apiBase, siteUrl, petType });

  const shareUrl = siteUrl ? `${siteUrl}/share/report/${encodeURIComponent(id)}` : "";
  const redirectUrl = siteUrl ? `${siteUrl}/reports?highlight=${encodeURIComponent(id)}` : "";

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=300, s-maxage=300, stale-while-revalidate=86400");

  res.status(200).send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>${escapeHtml(title || "Found Your Pet")}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    ${shareUrl ? `<link rel="canonical" href="${escapeHtml(shareUrl)}" />` : ""}

    <meta property="og:type" content="article" />
    ${shareUrl ? `<meta property="og:url" content="${escapeHtml(shareUrl)}" />` : ""}
    <meta property="og:title" content="${escapeHtml(title || "Found Your Pet")}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    ${
      imageUrl
        ? `
    <meta property="og:image" content="${escapeHtml(imageUrl)}" />
    <meta property="og:image:secure_url" content="${escapeHtml(imageUrl)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${escapeHtml(title || "Found Your Pet")}" />
    `.trim()
        : ""
    }
    <meta property="og:site_name" content="Found Your Pet" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title || "Found Your Pet")}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    ${imageUrl ? `<meta name="twitter:image" content="${escapeHtml(imageUrl)}" />` : ""}

    ${redirectUrl ? `<meta http-equiv="refresh" content="0; url=${escapeHtml(redirectUrl)}" />` : ""}
  </head>
  <body>
    <p style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial; padding: 20px;">
      Redirecting… ${redirectUrl ? `<a href="${escapeHtml(redirectUrl)}">Open the post</a>.` : ""}
    </p>
  </body>
</html>`);
};
