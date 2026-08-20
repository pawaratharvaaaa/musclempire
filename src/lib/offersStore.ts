import type { Offer } from "@/data/offers";

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbylqcC98hu82JWfiMKBNJ28heqAqphNVlxUtqJAQNP1Ebdg81QQDblw9i1Z6VEHSM-TmA/exec";
const CACHE_KEY = "me_offers_v2";
const CACHE_TS_KEY = "me_offers_ts";
const CACHE_TTL = 30_000; // 30 seconds — re-pull from Sheets if stale

// ── localStorage (instant) ───────────────────────────────────────────────────

function readCache(): Offer[] {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) || "[]"); } catch { return []; }
}

function writeCache(offers: Offer[]): void {
  localStorage.setItem(CACHE_KEY, JSON.stringify(offers));
  localStorage.setItem(CACHE_TS_KEY, String(Date.now()));
}

function isCacheStale(): boolean {
  const ts = parseInt(localStorage.getItem(CACHE_TS_KEY) || "0", 10);
  return Date.now() - ts > CACHE_TTL;
}

// ── Sheets (background) ──────────────────────────────────────────────────────

export async function pullOffersFromSheets(): Promise<void> {
  try {
    const res = await fetch(`${APPS_SCRIPT_URL}?action=getOffers&_t=${Date.now()}`, {
      redirect: "follow",
      cache: "no-store",
    });
    const text = await res.text();
    const json = JSON.parse(text);
    if (Array.isArray(json?.offers)) {
      writeCache(json.offers);
      window.dispatchEvent(new CustomEvent("offersUpdated"));
    }
  } catch (e) {
    console.warn("[offersStore] pullOffersFromSheets failed:", e);
  }
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

// Auto-pull from Sheets if cache is stale (used by public pages)
export function getOffersAndSync(): Offer[] {
  const cached = readCache();
  if (isCacheStale()) {
    pullOffersFromSheets(); // background refresh
  }
  return cached;
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
