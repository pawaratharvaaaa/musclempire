const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyVfFmJLP1AUrm7Fm3VDiwoWLYMMNvaqZuzY6caLQi7sBeaKDDWJoArRphAdcfKP3bulA/exec";
const T = ["ME97","73","GYM"].join("");
const CACHE_KEY = "me_coupons_v2";
const CACHE_TS_KEY = "me_coupons_ts";
const CACHE_TTL = 30_000; // 30 seconds

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
  localStorage.setItem(CACHE_TS_KEY, String(Date.now()));
}

function isCacheStale(): boolean {
  const ts = parseInt(localStorage.getItem(CACHE_TS_KEY) || "0", 10);
  return Date.now() - ts > CACHE_TTL;
}

// ── Sheets (background sync only) ───────────────────────────────────────────

export async function pullFromSheets(): Promise<void> {
  try {
    const res = await fetch(`${APPS_SCRIPT_URL}?action=getCoupons&token=${T}&_t=${Date.now()}`, {
      redirect: "follow",
      cache: "no-store",
    });
    const text = await res.text();
    const json = JSON.parse(text);
    if (Array.isArray(json?.coupons)) {
      writeCache(json.coupons as Coupon[]);
      window.dispatchEvent(new CustomEvent("couponsUpdated"));
    }
  } catch (e) {
    console.warn("[couponStore] pullFromSheets failed:", e);
  }
}

function pushToSheets(coupons: Coupon[]): void {
  const data = encodeURIComponent(JSON.stringify(coupons));
  fetch(`${APPS_SCRIPT_URL}?action=saveCoupons&token=${T}&data=${data}`, {
    method: "GET",
    mode: "no-cors",
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
  const existing = readCache().find(c => c.code === cleanCode);
  if (existing) {
    // Update discount if it changed
    if (existing.discount !== (discount || 20)) {
      updateCoupon(existing.id, { discount: discount || 20 });
    }
  } else {
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

// Auto-pull from Sheets if cache is stale (used by public pages)
export function getCouponsAndSync(): Coupon[] {
  const cached = readCache();
  if (isCacheStale()) {
    pullFromSheets(); // background refresh
  }
  return cached;
}
