import newMemberOffer from "@/assets/images/new_member_offer.jpg";
import duoOffer from "@/assets/images/duo_offer.jpg";
import femaleOffer from "@/assets/images/female_offer.jpg";

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
  image?: string;
  couponCode?: string;
  status?: "active" | "upcoming" | "expired";
}

export const activeOffers: Offer[] = [
  {
    id: "new-member-shred",
    title: "New Member Transformation Special",
    subtitle: "Unlock Your Ultimate Physique",
    description: "Enroll this month and get 25% OFF on Annual Unisex & Female Gym Memberships + Free Personal Nutrition Plan!",
    discount: "25% OFF",
    badge: "Limited Time Special",
    validTill: "31 August 2026",
    ctaText: "Claim 25% Discount",
    whatsappMessage: "Hi Muscle Empire! I would like to claim the 25% OFF New Member Transformation Special with Coupon TRANSFORM25.",
    isFeatured: true,
    image: newMemberOffer,
    couponCode: "TRANSFORM25",
    status: "active"
  },
  {
    id: "duo-membership",
    title: "Duo Fitness Challenge",
    subtitle: "Train Together, Save Big",
    description: "Bring a gym partner or friend! Get 50% OFF on the second membership when you join together.",
    discount: "50% OFF 2ND PASS",
    badge: "Duo Offer",
    validTill: "Limited Slots",
    ctaText: "Claim Duo Offer",
    whatsappMessage: "Hi Muscle Empire! I would like to claim the Duo Membership 50% Off Offer with Coupon DUOBANK50.",
    isFeatured: true,
    image: duoOffer,
    couponCode: "DUOBANK50",
    status: "active"
  },
  {
    id: "female-exclusive-pass",
    title: "Female Gym VIP Pass",
    subtitle: "100% Private Women's Fitness Wing",
    description: "3 Free Personal Training Sessions + Customized Body Composition Assessment with any 3-Month Female Gym Membership.",
    discount: "3 FREE PT SESSIONS",
    badge: "Female Gym Exclusive",
    validTill: "Valid This Month",
    ctaText: "Claim Female Pass",
    whatsappMessage: "Hi Muscle Empire! I would like to claim the Female Gym Pass offer with Coupon FEMALEVIP.",
    isFeatured: true,
    image: femaleOffer,
    couponCode: "FEMALEVIP",
    status: "active"
  }
];

export const defaultExpiredOffers: Offer[] = [
  {
    id: "monsoon-madness-2026",
    title: "Monsoon Fitness Blowout",
    subtitle: "Heavy Rain, Heavy Gain",
    description: "Flat 40% OFF on 6-Month Unisex Pass + Free Gym Duffle Bag & Shaker.",
    discount: "40% OFF",
    badge: "Expired Offer",
    validTill: "31 July 2026",
    ctaText: "Offer Expired",
    whatsappMessage: "Hi Muscle Empire!",
    couponCode: "MONSOON40",
    status: "expired"
  },
  {
    id: "summer-shred-2026",
    title: "Summer Shred 90-Day Challenge",
    subtitle: "Beach Body Transformation",
    description: "Enroll in the 90-Day Fat Loss BootCamp with Dedicated Personal Trainer.",
    discount: "35% OFF",
    badge: "Expired Offer",
    validTill: "30 June 2026",
    ctaText: "Offer Expired",
    whatsappMessage: "Hi Muscle Empire!",
    couponCode: "SHRED35",
    status: "expired"
  }
];
