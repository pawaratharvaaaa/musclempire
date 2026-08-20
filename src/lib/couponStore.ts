const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw06TogGaQrRyBdRGHuvEYqBKPfT9f0AFYcB36t-XwJweaLkuT3-wi55un3ckiPMPZOYQ/exec";

export interface Coupon {
  id: string;
  code: string;
  discount: number;
  plans: string[];           // [] means all plans
  enabled: boolean;
  description?: string;
}

// ── Sheets API ───────────────────────────────────────────────────────────────

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
}

// ── Public API — always fetches from Sheets ──────────────────────────────────

export async function getCoupons(): Promise<Coupon[]> {
  const remote = await fetchCouponsFromSheets();
  return remote ?? [];
}

export async function saveCoupons(coupons: Coupon[]): Promise<void> {
  saveCouponsToSheets(coupons);
  window.dispatchEvent(new CustomEvent("couponsUpdated"));
}

export async function addCoupon(coupon: Omit<Coupon, "id">): Promise<void> {
  const coupons = await getCoupons();
  coupons.push({ id: "coupon_" + Date.now(), ...coupon });
  await saveCoupons(coupons);
}

export async function updateCoupon(id: string, updated: Partial<Coupon>): Promise<void> {
  const coupons = (await getCoupons()).map(c => c.id === id ? { ...c, ...updated } : c);
  await saveCoupons(coupons);
}

export async function removeCoupon(id: string): Promise<void> {
  const coupons = (await getCoupons()).filter(c => c.id !== id);
  await saveCoupons(coupons);
}

export async function validateCoupon(code: string, planName: string): Promise<{ discount: number; coupon: Coupon } | null> {
  const coupons = await getCoupons();
  const coupon = coupons.find(c => c.code === code.toUpperCase().trim() && c.enabled);
  if (!coupon) return null;
  if (coupon.plans.length > 0 && !coupon.plans.includes(planName)) return null;
  return { discount: coupon.discount, coupon };
}

export async function ensureCouponExists(code: string, discount: number = 25, description?: string): Promise<void> {
  const cleanCode = code.toUpperCase().trim();
  if (!cleanCode) return;
  const coupons = await getCoupons();
  if (!coupons.find(c => c.code === cleanCode)) {
    await addCoupon({ code: cleanCode, discount: discount || 20, plans: [], enabled: true, description: description || `Coupon for ${cleanCode}` });
  }
}

// Sync alias for pricing-table (background fetch, no-op if not needed)
export async function syncCouponsFromSheets(): Promise<void> {
  // No-op: getCoupons always fetches fresh from Sheets
}
