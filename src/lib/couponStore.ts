const COUPONS_KEY = "me_coupons_data";

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
];

export function getCoupons(): Coupon[] {
  try {
    const stored = localStorage.getItem(COUPONS_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return DEFAULT_COUPONS;
}

export function saveCoupons(coupons: Coupon[]): void {
  localStorage.setItem(COUPONS_KEY, JSON.stringify(coupons));
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

/** Validate a code against stored coupons, returns discount % or null */
export function validateCoupon(code: string, planName: string): { discount: number; coupon: Coupon } | null {
  const coupons = getCoupons();
  const coupon = coupons.find(c => c.code === code.toUpperCase().trim() && c.enabled);
  if (!coupon) return null;
  if (coupon.plans.length > 0 && !coupon.plans.includes(planName)) return null;
  return { discount: coupon.discount, coupon };
}
