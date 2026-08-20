const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw06TogGaQrRyBdRGHuvEYqBKPfT9f0AFYcB36t-XwJweaLkuT3-wi55un3ckiPMPZOYQ/exec";
const CACHE_KEY = "me_coupons_v2";

export interface Coupon {
  id: string;
  code: string;
  discount: number;
  plans: string[];
  enabled: boolean;
  description?: string;
}

// ── localStorage (instant read/write) ───────────────────────────────────────

function readCache(): Coupon[] {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) || "[]"); } catch { return []; }
}

function writeCache(coupons: Coupon[]): void {
  localStorage.setItem(CACHE_KEY, JSON.stringify(coupons));
}

// ── Sheets (background sync only) ───────────────────────────────────────────

export async function pullFromSheets(): Promise<void> {
  try {
    const res = await fetch(`${APPS_SCRIPT_URL}?action=getCoupons&_t=${Date.now()}`, { redirect: "follow" });
    const json = await res.json();
    if (Array.isArray(json?.coupons)) {
      writeCache(json.coupons);
      window.dispatchEvent(new CustomEvent("couponsUpdated"));
    }
  } catch {}
}

function pushToSheets(coupons: Coupon[]): void {
  fetch(APPS_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action: "saveCoupons", data: JSON.stringify(coupons) }),
  }).catch(() => {});
}

// ── Public API (all synchronous for instant UI) ──────────────────────────────

export function getCoupons(): Coupon[] {
  return readCache();
}

function _save(coupons: Coupon[]): void {
  writeCache(coupons);
  pushToSheets(coupons);
  window.dispatchEvent(new CustomEvent("couponsUpdated"));
}

export function addCoupon(coupon: Omit<Coupon, "id">): void {
  const coupons = readCache();
  if (coupons.find(c => c.code === coupon.code.toUpperCase())) return; // no duplicates
  coupons.push({ id: "coupon_" + Date.now(), ...coupon, code: coupon.code.toUpperCase() });
  _save(coupons);
}

export function updateCoupon(id: string, updated: Partial<Coupon>): void {
  _save(readCache().map(c => c.id === id ? { ...c, ...updated } : c));
}

export function removeCoupon(id: string): void {
  _save(readCache().filter(c => c.id !== id));
}

export function saveCoupons(coupons: Coupon[]): void {
  _save(coupons);
}

export function ensureCouponExists(code: string, discount = 25, description?: string): void {
  const cleanCode = code.toUpperCase().trim();
  if (!cleanCode) return;
  if (!readCache().find(c => c.code === cleanCode)) {
    addCoupon({ code: cleanCode, discount: discount || 20, plans: [], enabled: true, description: description || `Coupon for ${cleanCode}` });
  }
}

export function validateCoupon(code: string, planName: string): { discount: number; coupon: Coupon } | null {
  const coupon = getCoupons().find(c => c.code === code.toUpperCase().trim() && c.enabled);
  if (!coupon) return null;
  if (coupon.plans.length > 0 && !coupon.plans.includes(planName)) return null;
  return { discount: coupon.discount, coupon };
}

// Legacy async compat shims (pricing-table uses async validateCoupon)
export async function syncCouponsFromSheets(): Promise<void> { await pullFromSheets(); }
