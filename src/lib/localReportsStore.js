import { fileToJpegDataUrl } from "@/lib/image";

const STORAGE_KEY = "publicPetReports";

function safeJsonParse(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function getStore() {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  const parsed = safeJsonParse(raw, []);
  return Array.isArray(parsed) ? parsed : [];
}

function setStore(reports) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
}

export function getLocalReport(reportId) {
  const reports = getStore();
  return reports.find((r) => r.id === reportId) || null;
}

function uid() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `r_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export async function addLocalReport({
  petName,
  petType,
  firstName,
  lastName,
  phoneNumber,
  petStatus,
  location,
  description,
  photoFile,
}) {
  const photoDataUrl = photoFile ? await fileToJpegDataUrl(photoFile).catch(() => null) : null;
  const now = new Date().toISOString();

  const report = {
    id: uid(),
    petName: petName || "",
    petType: (petType || "dog").toString().trim().toLowerCase(),
    firstName: firstName || "",
    lastName: lastName || "",
    phoneNumber: phoneNumber || "",
    petStatus: petStatus || "lost",
    location: location || "",
    description: description || "",
    photoUrl: photoDataUrl,
    createdAt: now,
    reactions: { like: 0, heart: 0, help: 0 },
    myReaction: null,
    comments: [],
    flags: [],
  };

  const reports = getStore();
  setStore([report, ...reports]);
  return report;
}

export function listLocalReports({ page = 1, limit = 10 } = {}) {
  const reports = getStore().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const start = Math.max(0, (page - 1) * limit);
  const items = reports.slice(start, start + limit);
  const hasMore = start + limit < reports.length;
  return { ok: true, items, nextPage: hasMore ? page + 1 : null, total: reports.length };
}

export function addLocalComment(reportId, { name = "", text }) {
  const reports = getStore();
  const idx = reports.findIndex((r) => r.id === reportId);
  if (idx === -1) return { ok: false, error: "Report not found" };
  const comment = { id: uid(), name, text, createdAt: new Date().toISOString() };
  const next = [...reports];
  next[idx] = { ...next[idx], comments: [...(next[idx].comments || []), comment] };
  setStore(next);
  return { ok: true, comment, report: next[idx] };
}

export function toggleLocalReaction(reportId, reactionType) {
  const allowed = ["like", "heart", "help", "seen", "helped"];
  if (!allowed.includes(reactionType)) return { ok: false, error: "Invalid reaction" };

  const reports = getStore();
  const idx = reports.findIndex((r) => r.id === reportId);
  if (idx === -1) return { ok: false, error: "Report not found" };

  const current = reports[idx];
  const reactions = { like: 0, heart: 0, help: 0, seen: 0, helped: 0, ...(current.reactions || {}) };
  const myReaction = current.myReaction || null;

  let nextMyReaction = reactionType;
  if (myReaction === reactionType) nextMyReaction = null;

  if (myReaction && reactions[myReaction] > 0) reactions[myReaction] -= 1;
  if (nextMyReaction) reactions[nextMyReaction] += 1;

  const next = [...reports];
  next[idx] = { ...current, reactions, myReaction: nextMyReaction };
  setStore(next);
  return { ok: true, report: next[idx] };
}

export function flagLocalReport(reportId, { reason = "", details = "" } = {}) {
  const reports = getStore();
  const idx = reports.findIndex((r) => r.id === reportId);
  if (idx === -1) return { ok: false, error: "Report not found" };

  const flag = { id: uid(), reason, details, createdAt: new Date().toISOString() };
  const next = [...reports];
  next[idx] = { ...next[idx], flags: [...(next[idx].flags || []), flag] };
  setStore(next);
  return { ok: true, flag };
}
