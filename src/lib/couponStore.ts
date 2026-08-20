const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw06TogGaQrRyBdRGHuvEYqBKPfT9f0AFYcB36t-XwJweaLkuT3-wi55un3ckiPMPZOYQ/exec";

const COUPONS_KEY = "me_coupons_data";
const COUPONS_TS_KEY = "me_coupons_ts";
const COUPONS_TTL = 3 * 60 * 1000; // 3 minutes

export interface Coupon {
  id: string;
  code: string;
  discount: number;
  plans: string[];           // [] means all plans
  enabled: boolean;
  description?: string;
}

// Hardcoded defaults — always available as fallback on any device
// These are ONLY used when Sheets returns empty AND localStorage is empty
const DEFAULT_COUPONS: Coupon[] = [
  { id: "coupon_default_1", code: "MUSCLEMPIRE25", discount: 25, plans: ["Half Yearly", "Yearly"], enabled: true, description: "25% off on Half Yearly & Yearly plans" },
  { id: "coupon_default_2", code: "TRANSFORM25",   discount: 25, plans: [], enabled: true, description: "25% off New Member Transformation Special" },
  { id: "coupon_default_3", code: "DUOBANK50",     discount: 50, plans: [], enabled: true, description: "50% off second membership for Duo Fitness Challenge" },
  { id: "coupon_default_4", code: "FEMALEVIP",     discount: 30, plans: [], enabled: true, description: "Female Gym VIP Special Pass" },
];

// ── Local cache ──────────────────────────────────────────────────────────────

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

// ── Sheets API ───────────────────────────────────────────────────────────────

export async function fetchCouponsFromSheets(): Promise<Coupon[] | null> {
  try {
    const res = await fetch(`${APPS_SCRIPT_URL}?action=getCoupons&_t=${Date.now()}`, { redirect: "follow" });
    if (!res.ok) return null;
    const json = await res.json();
    return Array.isArray(json?.coupons) ? json.coupons : null;
  } catch { return null; }
}

function saveCouponsToSheets(coupons: Coupon[]): void {
  // Single POST only — no duplicate requests
  fetch(APPS_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action: "saveCoupons", data: JSON.stringify(coupons) }),
  }).catch(() => {});
}

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Get coupons — from localStorage cache.
 * Falls back to DEFAULT_COUPONS only if cache is completely empty.
 * Does NOT merge defaults — so deletions are respected.
 */
export function getCoupons(): Coupon[] {
  const local = getLocal();
  return local.length > 0 ? local : DEFAULT_COUPONS;
}

/**
 * Sync from Sheets in background. Updates local cache + fires event.
 * Call this on page load to get latest coupons on any device.
 */
export async function syncCouponsFromSheets(): Promise<void> {
  if (!isCacheStale()) return;
  const remote = await fetchCouponsFromSheets();
  if (remote !== null) {
    // remote can be [] — respect that (all coupons deleted)
    saveLocal(remote.length > 0 ? remote : DEFAULT_COUPONS);
    window.dispatchEvent(new CustomEvent("couponsUpdated"));
  }
}

/**
 * Force-sync from Sheets regardless of cache age. Use in admin panel on mount.
 */
export async function forceSyncCouponsFromSheets(): Promise<Coupon[]> {
  const remote = await fetchCouponsFromSheets();
  if (remote !== null) {
    const toSave = remote.length > 0 ? remote : DEFAULT_COUPONS;
    saveLocal(toSave);
    return toSave;
  }
  return getCoupons();
}

export function saveCoupons(coupons: Coupon[]): void {
  saveLocal(coupons);
  saveCouponsToSheets(coupons);
  window.dispatchEvent(new CustomEvent("couponsUpdated"));
}

export function addCoupon(coupon: Omit<Coupon, "id">): void {
  const coupons = getCoupons();
  coupons.push({ id: "coupon_" + Date.now(), ...coupon });
  saveCoupons(coupons);
}

export function updateCoupon(id: string, updated: Partial<Coupon>): void {
  const coupons = getCoupons().map(c => c.id === id ? { ...c, ...updated } : c);
  saveCoupons(coupons);
}

export function removeCoupon(id: string): void {
  saveCoupons(getCoupons().filter(c => c.id !== id));
}

export function validateCoupon(code: string, planName: string): { discount: number; coupon: Coupon } | null {
  const coupons = getCoupons();
  const coupon = coupons.find(c => c.code === code.toUpperCase().trim() && c.enabled);
  if (!coupon) return null;
  if (coupon.plans.length > 0 && !coupon.plans.includes(planName)) return null;
  return { discount: coupon.discount, coupon };
}

export function ensureCouponExists(code: string, discount: number = 25, description?: string): void {
  const cleanCode = code.toUpperCase().trim();
  if (!cleanCode) return;
  const coupons = getCoupons();
  if (!coupons.find(c => c.code === cleanCode)) {
    addCoupon({ code: cleanCode, discount: discount || 20, plans: [], enabled: true, description: description || `Coupon for ${cleanCode}` });
  }
}
