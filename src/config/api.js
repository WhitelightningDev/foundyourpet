export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "https://foundyourpet-backend.onrender.com";

const defaultSiteUrl = "https://www.foundyourpet.co.za";

export const PUBLIC_SITE_URL = (
  process.env.REACT_APP_PUBLIC_SITE_URL || defaultSiteUrl
).replace(/\/+$/, "");
