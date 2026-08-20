import type { Offer } from "@/data/offers";

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw06TogGaQrRyBdRGHuvEYqBKPfT9f0AFYcB36t-XwJweaLkuT3-wi55un3ckiPMPZOYQ/exec";

// ── Sheets API ───────────────────────────────────────────────────────────────

async function fetchOffersFromSheets(): Promise<Offer[] | null> {
  try {
    const res = await fetch(`${APPS_SCRIPT_URL}?action=getOffers&_t=${Date.now()}`, { redirect: "follow" });
    if (!res.ok) return null;
    const json = await res.json();
    return Array.isArray(json?.offers) ? json.offers : null;
  } catch { return null; }
}

function saveOffersToSheets(offers: Offer[]): void {
  fetch(APPS_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action: "saveOffers", data: JSON.stringify(offers) }),
  }).catch(() => {});
}

// ── Public API — always fetches from Sheets ──────────────────────────────────

export async function getOffers(): Promise<Offer[]> {
  const remote = await fetchOffersFromSheets();
  return remote ?? [];
}

export async function saveOffers(offers: Offer[]): Promise<void> {
  saveOffersToSheets(offers);
  window.dispatchEvent(new CustomEvent("offersUpdated"));
}

export async function addOffer(offer: Omit<Offer, "id">): Promise<void> {
  const offers = await getOffers();
  offers.push({ id: "offer_" + Date.now(), ...offer });
  await saveOffers(offers);
}

export async function removeOffer(id: string): Promise<void> {
  const offers = (await getOffers()).filter(o => o.id !== id);
  await saveOffers(offers);
}

export async function updateOffer(id: string, updated: Partial<Offer>): Promise<void> {
  const offers = (await getOffers()).map(o => o.id === id ? { ...o, ...updated } : o);
  await saveOffers(offers);
}
