import type { Offer } from "@/data/offers";
import { activeOffers } from "@/data/offers";
import { APPS_SCRIPT_URL } from "@/lib/sheets";

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

// ── Sheets (background) ───────────────────────────────────────────────────────

export async function pullOffersFromSheets(retry = 1): Promise<Offer[]> {
  for (let attempt = 0; attempt <= retry; attempt++) {
    try {
      localStorage.removeItem("me_offers_ts");
      const res = await fetch(`${APPS_SCRIPT_URL}?action=getOffers&token=${T}&_t=${Date.now()}`, {
        redirect: "follow",
        cache: "no-store",
      });
      const text = await res.text();
      const json = JSON.parse(text);
      if (Array.isArray(json?.offers)) {
        const offers = json.offers;
        writeCache(offers);
        window.dispatchEvent(new CustomEvent("offersUpdated"));
        return offers;
      }
    } catch (e) {
      console.warn("[offersStore] pullOffersFromSheets failed attempt:", attempt, e);
      if (attempt < retry) await new Promise(r => setTimeout(r, 800));
    }
  }
  const current = readCache();
  if (current.length === 0) {
    writeCache(activeOffers);
    window.dispatchEvent(new CustomEvent("offersUpdated"));
    return activeOffers;
  }
  return current;
}

function pushToSheets(offers: Offer[]): void {
  const stripped = offers.map(o => ({
    ...o,
    image: o.image?.startsWith("data:") ? "" : (o.image || ""),
  }));
  fetch(APPS_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action: "saveOffers", token: T, data: JSON.stringify(stripped) }),
  }).catch(() => {});
}

// ── Public API ────────────────────────────────────────────────────────────────

export function getOffers(): Offer[] {
  const cached = readCache();
  if (cached.length === 0 || isCacheStale()) {
    pullOffersFromSheets();
  }
  return cached.length > 0 ? cached : activeOffers;
}

export function getOffersAndSync(): Offer[] {
  const cached = readCache();
  pullOffersFromSheets();
  return cached.length > 0 ? cached : activeOffers;
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





