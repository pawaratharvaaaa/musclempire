import type { Offer } from "@/data/offers";

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbylqcC98hu82JWfiMKBNJ28heqAqphNVlxUtqJAQNP1Ebdg81QQDblw9i1Z6VEHSM-TmA/exec";
const CACHE_KEY = "me_offers_v2";

// ── localStorage (instant) ───────────────────────────────────────────────────

function readCache(): Offer[] {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) || "[]"); } catch { return []; }
}

function writeCache(offers: Offer[]): void {
  localStorage.setItem(CACHE_KEY, JSON.stringify(offers));
}

// ── Sheets (background) ──────────────────────────────────────────────────────

export async function pullOffersFromSheets(): Promise<void> {
  try {
    const res = await fetch(`${APPS_SCRIPT_URL}?action=getOffers&_t=${Date.now()}`, { redirect: "follow" });
    const json = await res.json();
    if (Array.isArray(json?.offers)) {
      writeCache(json.offers);
      window.dispatchEvent(new CustomEvent("offersUpdated"));
    }
  } catch {}
}

function pushToSheets(offers: Offer[]): void {
  fetch(APPS_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action: "saveOffers", data: JSON.stringify(offers) }),
  }).catch(() => {});
}

// ── Public API (synchronous for instant UI) ──────────────────────────────────

export function getOffers(): Offer[] {
  return readCache();
}

function _save(offers: Offer[]): void {
  writeCache(offers);
  pushToSheets(offers);
  window.dispatchEvent(new CustomEvent("offersUpdated"));
}

export function saveOffers(offers: Offer[]): void { _save(offers); }

export function addOffer(offer: Omit<Offer, "id">): void {
  const offers = readCache();
  offers.push({ id: "offer_" + Date.now(), ...offer });
  _save(offers);
}

export function removeOffer(id: string): void {
  _save(readCache().filter(o => o.id !== id));
}

export function updateOffer(id: string, updated: Partial<Offer>): void {
  _save(readCache().map(o => o.id === id ? { ...o, ...updated } : o));
}
