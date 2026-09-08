export interface Offer {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  discount: string;
  badge: string;
  validTill: string;
  ctaText: string;
  whatsappMessage: string;
  isFeatured?: boolean;
  showInPopup?: boolean;
  image?: string;
  couponCode?: string;
  status?: "active" | "upcoming" | "expired";
}

export const activeOffers: Offer[] = [
  {
    id: "offer_new_member_25",
    title: "New Member Special",
    subtitle: "Start Your Transformation Today",
    description: "Get 25% flat discount on Half Yearly & Yearly Unisex Gym memberships. Includes trainer assistance & personalized guidance!",
    discount: "25% OFF",
    badge: "Limited Time",
    validTill: "2026-12-31",
    ctaText: "Claim 25% OFF",
    whatsappMessage: "Hi Muscle Empire! I would like to claim the New Member Special offer (25% OFF, Code: MUSCLEMPIRE25).",
    couponCode: "MUSCLEMPIRE25",
    isFeatured: true,
    showInPopup: true,
    status: "active"
  },
  {
    id: "offer_crossfit_20",
    title: "CrossFit Power Pass",
    subtitle: "High Intensity Training",
    description: "Save 20% on Gym + CrossFit combined plans. Boost your stamina, endurance, and muscular strength with expert coaches.",
    discount: "20% OFF",
    badge: "Popular Deal",
    validTill: "2026-12-31",
    ctaText: "Claim Deal",
    whatsappMessage: "Hi Muscle Empire! I would like to claim the CrossFit Power Pass offer (20% OFF, Code: CROSSFIT20).",
    couponCode: "CROSSFIT20",
    isFeatured: true,
    showInPopup: true,
    status: "active"
  },
  {
    id: "offer_women_transform",
    title: "Women's Transformation Deal",
    subtitle: "Female CrossFit Studio",
    description: "Exclusive 20% discount for ladies joining Muscle Empire Crossfit Studio. Includes personal coaching and weight management.",
    discount: "20% OFF",
    badge: "Ladies Special",
    validTill: "2026-12-31",
    ctaText: "Claim Offer",
    whatsappMessage: "Hi Muscle Empire! I would like to claim the Women's Transformation Deal (20% OFF, Code: FEMALEFIT).",
    couponCode: "FEMALEFIT",
    isFeatured: true,
    showInPopup: true,
    status: "active"
  }
];

export const defaultExpiredOffers: Offer[] = [];
