import type { Offer } from "@/data/offers";
import type { Offer } from "@/data/offers";
import { activeOffers } from "@/data/offers";

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzt16aWEy6Wq9Unm8mgCL-0V9dp3CEBcB3kNAqWtaFu9Q9_-tAlWyTjGSiRbtMSkGo60Q/exec";
const T = ["ZujXfS4o6t","pRWL2vQmAT","JbEFBaVKCs","1O7UGPqDyk"].join("");
const CACHE_KEY = "me_offers_v2";
const CACHE_TS_KEY = "me_offers_ts";
const CACHE_TTL = 30_000;

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

// â”€â”€ Sheets (background) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export async function pullOffersFromSheets(): Promise<void> {
  try {
    localStorage.removeItem("me_offers_ts");
    const res = await fetch(`${APPS_SCRIPT_URL}?action=getOffers&token=${T}&_t=${Date.now()}`, {
      redirect: "follow",
      cache: "no-store",
    });
    const text = await res.text();
    const json = JSON.parse(text);
    if (Array.isArray(json?.offers)) {
      // If Sheets returns empty, seed with default offers
      const offers = json.offers.length > 0 ? json.offers : activeOffers;
      writeCache(offers);
      window.dispatchEvent(new CustomEvent("offersUpdated"));
    }
  } catch (e) {
    console.warn("[offersStore] pullOffersFromSheets failed:", e);
    // On network failure, seed defaults if cache is empty
    if (readCache().length === 0) {
      writeCache(activeOffers);
      window.dispatchEvent(new CustomEvent("offersUpdated"));
    }
  }
}

function pushToSheets(offers: Offer[]): void {
  const stripped = offers.map(o => ({
    ...o,
    image: o.image?.startsWith("data:") ? "" : (o.image || ""),
  }));
  const data = encodeURIComponent(JSON.stringify(stripped));
  fetch(`${APPS_SCRIPT_URL}?action=saveOffers&token=${T}&data=${data}`, {
    method: "GET",
    mode: "no-cors",
  }).catch(() => {});
}

// â”€â”€ Public API â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export function getOffers(): Offer[] {
  const cached = readCache();
  // Seed defaults if cache empty (before Sheets sync completes)
  if (cached.length === 0) { pullOffersFromSheets(); return []; }
  return cached;
}

export function getOffersAndSync(): Offer[] {
  const cached = readCache();
  if (isCacheStale()) pullOffersFromSheets();
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



