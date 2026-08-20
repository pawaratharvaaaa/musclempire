const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw06TogGaQrRyBdRGHuvEYqBKPfT9f0AFYcB36t-XwJweaLkuT3-wi55un3ckiPMPZOYQ/exec";

const COUPONS_KEY = "me_coupons_data";
const COUPONS_TS_KEY = "me_coupons_ts";
const COUPONS_TTL = 5 * 60 * 1000; // 5 minutes

export interface Coupon {
  id: string;
  code: string;
  discount: number;          // percentage
  plans: string[];           // [] means all plans
  enabled: boolean;
  description?: string;
}

const DEFAULT_COUPONS: Coupon[] = [
  {
    id: "coupon_default_1",
    code: "MUSCLEMPIRE25",
    discount: 25,
    plans: ["Half Yearly", "Yearly"],
    enabled: true,
    description: "25% off on Half Yearly & Yearly plans",
  },
  {
    id: "coupon_default_2",
    code: "TRANSFORM25",
    discount: 25,
    plans: [],
    enabled: true,
    description: "25% off New Member Transformation Special",
  },
  {
    id: "coupon_default_3",
    code: "DUOBANK50",
    discount: 50,
    plans: [],
    enabled: true,
    description: "50% off second membership for Duo Fitness Challenge",
  },
  {
    id: "coupon_default_4",
    code: "FEMALEVIP",
    discount: 30,
    plans: [],
    enabled: true,
    description: "Female Gym VIP Special Pass",
  },
];

// ── Sheets API (inline to avoid circular imports) ────────────────────────────

async function fetchCouponsFromSheets(): Promise<Coupon[] | null> {
  try {
    const res = await fetch(`${APPS_SCRIPT_URL}?action=getCoupons&_t=${Date.now()}`, { redirect: "follow" });
    if (!res.ok) return null;
    const json = await res.json();
    return Array.isArray(json?.coupons) ? json.coupons : null;
  } catch { return null; }
}

function saveCouponsToSheets(coupons: Coupon[]): void {
  fetch(APPS_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action: "saveCoupons", data: JSON.stringify(coupons) }),
  }).catch(() => {});
  // Also fire as GET in case POST body isn't parsed
  const qs = new URLSearchParams({ action: "saveCoupons", data: JSON.stringify(coupons) }).toString();
  fetch(`${APPS_SCRIPT_URL}?${qs}`, { method: "GET", mode: "no-cors" }).catch(() => {});
}

// ── Local helpers ────────────────────────────────────────────────────────────

function getLocal(): Coupon[] {
  try {
    const stored = localStorage.getItem(COUPONS_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return [];
}

function saveLocal(coupons: Coupon[]): void {
  localStorage.setItem(COUPONS_KEY, JSON.stringify(coupons));
  localStorage.setItem(COUPONS_TS_KEY, String(Date.now()));
}

function isCacheStale(): boolean {
  const ts = parseInt(localStorage.getItem(COUPONS_TS_KEY) || "0", 10);
  return Date.now() - ts > COUPONS_TTL;
}

/** Merge defaults — always present on every device */
function mergeDefaults(coupons: Coupon[]): Coupon[] {
  const merged = [...coupons];
  DEFAULT_COUPONS.forEach(def => {
    if (!merged.find(c => c.code === def.code)) merged.push(def);
  });
  return merged;
}

// ── Public API ───────────────────────────────────────────────────────────────

/** Background sync from Sheets — updates localStorage + fires event */
export async function syncCouponsFromSheets(): Promise<void> {
  if (!isCacheStale()) return;
  const remote = await fetchCouponsFromSheets();
  if (remote && remote.length > 0) {
    saveLocal(remote);
    window.dispatchEvent(new CustomEvent("couponsUpdated"));
  }
}

export function getCoupons(): Coupon[] {
  return mergeDefaults(getLocal());
}

export function saveCoupons(coupons: Coupon[]): void {
  saveLocal(coupons);
  saveCouponsToSheets(coupons);
  window.dispatchEvent(new CustomEvent("couponsUpdated"));
}

export function addCoupon(coupon: Omit<Coupon, "id">): void {
  const coupons = getLocal();
  coupons.push({ id: "coupon_" + Date.now(), ...coupon });
  saveCoupons(coupons);
}

export function updateCoupon(id: string, updated: Partial<Coupon>): void {
  const coupons = getLocal().map(c => c.id === id ? { ...c, ...updated } : c);
  saveCoupons(coupons);
}

export function removeCoupon(id: string): void {
  saveCoupons(getLocal().filter(c => c.id !== id));
}

/** Validate a code, returns discount or null */
export function validateCoupon(code: string, planName: string): { discount: number; coupon: Coupon } | null {
  const coupons = getCoupons();
  const coupon = coupons.find(c => c.code === code.toUpperCase().trim() && c.enabled);
  if (!coupon) return null;
  if (coupon.plans.length > 0 && !coupon.plans.includes(planName)) return null;
  return { discount: coupon.discount, coupon };
}

/** Ensures a coupon code for an offer is registered */
export function ensureCouponExists(code: string, discount: number = 25, description?: string): void {
  const cleanCode = code.toUpperCase().trim();
  if (!cleanCode) return;
  const coupons = getLocal();
  if (!coupons.find(c => c.code === cleanCode)) {
    addCoupon({ code: cleanCode, discount: discount || 20, plans: [], enabled: true, description: description || `Coupon for ${cleanCode}` });
  }
}
