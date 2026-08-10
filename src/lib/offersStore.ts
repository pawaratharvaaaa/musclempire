import { activeOffers as defaultOffers, Offer } from "@/data/offers";

const OFFERS_KEY = "me_offers_data";

export function getOffers(): Offer[] {
  try {
    const stored = localStorage.getItem(OFFERS_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return defaultOffers;
}

export function saveOffers(offers: Offer[]): void {
  localStorage.setItem(OFFERS_KEY, JSON.stringify(offers));
  window.dispatchEvent(new CustomEvent("offersUpdated"));
}

export function addOffer(offer: Omit<Offer, "id">): void {
  const offers = getOffers();
  const id = "offer_" + Date.now();
  offers.push({ id, ...offer });
  saveOffers(offers);
}

export function removeOffer(id: string): void {
  const offers = getOffers().filter(o => o.id !== id);
  saveOffers(offers);
}

export function updateOffer(id: string, updated: Partial<Offer>): void {
  const offers = getOffers().map(o => o.id === id ? { ...o, ...updated } : o);
  saveOffers(offers);
}
