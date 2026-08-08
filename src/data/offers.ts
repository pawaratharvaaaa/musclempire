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
    whatsappMessage: "Hi Muscle Empire! I would like to claim the 25% OFF New Member Transformation Special.",
    isFeatured: true
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
    whatsappMessage: "Hi Muscle Empire! I would like to claim the Duo Membership 50% Off Offer for me and my gym partner.",
    isFeatured: true
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
    whatsappMessage: "Hi Muscle Empire! I would like to claim the 3 Free PT Sessions offer at the Female Gym Branch.",
    isFeatured: true
  }
];
