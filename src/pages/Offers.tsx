import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Tag, Clock, Calendar, Zap } from "lucide-react";
import PlanNavbar from "@/components/PlanNavbar";
import Footer from "@/components/Footer";

// ── Offer data — edit here to add/remove offers ───────────────────────────────
const ongoingOffers: Offer[] = [
  // Example — uncomment and fill to add an offer:
  // {
  //   title: "Summer Shred Special",
  //   description: "Get 20% off on quarterly membership. Beat the heat and get in shape this summer.",
  //   discount: "20% OFF",
  //   validTill: "31 July 2026",
  //   cta: "Claim Offer",
  // },
];

const upcomingOffers: Offer[] = [
  // Example — uncomment to add upcoming offer:
  // {
  //   title: "Independence Day Special",
  //   description: "Flat 15% off on annual membership. Freedom to train without limits.",
  //   launchDate: "15 August 2026",
  //   teaser: "Coming soon — save big on your fitness journey.",
  // },
];
// ─────────────────────────────────────────────────────────────────────────────

type Offer = {
  title: string;
  description: string;
  discount?: string;
  validTill?: string;
  launchDate?: string;
  teaser?: string;
  cta?: string;
  image?: string;
};

function OfferCard({ offer, upcoming = false }: { offer: Offer; upcoming?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-card border border-border rounded-xl overflow-hidden flex flex-col hover:border-primary/40 transition-colors shadow-lg"
    >
      {/* Banner */}
      <div className="relative h-44 bg-gradient-to-br from-primary/20 to-yellow-600/10 flex items-center justify-center">
        {offer.image ? (
          <img src={offer.image} alt={offer.title} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <Zap size={48} className="text-primary/40" />
        )}
        {/* Badge */}
        {upcoming ? (
          <span className="absolute top-3 right-3 bg-blue-500 text-white text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full">
            Coming Soon
          </span>
        ) : offer.discount ? (
          <span className="absolute top-3 right-3 bg-primary text-black text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full">
            {offer.discount}
          </span>
        ) : null}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        <h3 className="text-white font-black uppercase tracking-tight text-lg leading-tight">{offer.title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed flex-1">
          {upcoming ? offer.teaser : offer.description}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {upcoming ? (
            <>
              <Calendar size={13} className="text-primary" />
              <span>Launches: <span className="text-white font-bold">{offer.launchDate}</span></span>
            </>
          ) : offer.validTill ? (
            <>
              <Clock size={13} className="text-primary" />
              <span>Valid till: <span className="text-white font-bold">{offer.validTill}</span></span>
            </>
          ) : null}
        </div>

        {/* CTA */}
        {!upcoming && (
          <a
            href="#contact"
            onClick={e => {
              e.preventDefault();
              window.history.back();
              setTimeout(() => {
                const el = document.getElementById("contact");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }, 300);
            }}
            className="w-full flex items-center justify-center bg-primary hover:bg-primary/90 text-black font-black uppercase tracking-widest py-3 rounded-xl text-sm transition-colors mt-1"
          >
            {offer.cta || "Unlock True Yourself"}
          </a>
        )}
      </div>
    </motion.div>
  );
}

function EmptyState({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center mb-5">
        <Tag size={32} className="text-primary/40" />
      </div>
      <h4 className="text-white font-black uppercase tracking-wide text-xl mb-2">{title}</h4>
      <p className="text-muted-foreground text-sm max-w-xs">{desc}</p>
    </div>
  );
}

export default function Offers() {
  const [activeTab, setActiveTab] = useState<"ongoing" | "upcoming">("ongoing");
  const ongoingRef = useRef<HTMLDivElement>(null);
  const upcomingRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => { window.scrollTo(0, 0); }, []);

  // Update active tab based on scroll position
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveTab(entry.target.id as "ongoing" | "upcoming");
          }
        });
      },
      { threshold: 0.4 }
    );
    if (ongoingRef.current) observer.observe(ongoingRef.current);
    if (upcomingRef.current) observer.observe(upcomingRef.current);
    return () => observer.disconnect();
  }, []);

  const scrollTo = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PlanNavbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">

          {/* Header */}
          <div className="text-center mb-10">
            <p className="text-primary font-bold uppercase tracking-[0.2em] text-xs mb-3 flex items-center justify-center gap-2">
              <span className="w-8 h-px bg-primary inline-block" />
              Limited Time
              <span className="w-8 h-px bg-primary inline-block" />
            </p>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-4">
              Exclusive{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-600">
                Offers
              </span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Take advantage of our latest fitness deals and upcoming promotions.
            </p>
          </div>

          {/* Sticky Tabs */}
          <div className="sticky top-20 z-40 bg-background/90 backdrop-blur-md border-b border-border/50 mb-12 -mx-4 px-4 md:-mx-6 md:px-6">
            <div className="flex gap-2 py-3 max-w-xs mx-auto">
              <button
                onClick={() => scrollTo(ongoingRef)}
                className={`flex-1 py-2.5 text-sm font-black uppercase tracking-widest rounded-lg transition-all ${
                  activeTab === "ongoing"
                    ? "bg-primary text-black"
                    : "bg-card text-muted-foreground hover:text-white border border-border"
                }`}
              >
                Ongoing
              </button>
              <button
                onClick={() => scrollTo(upcomingRef)}
                className={`flex-1 py-2.5 text-sm font-black uppercase tracking-widest rounded-lg transition-all ${
                  activeTab === "upcoming"
                    ? "bg-primary text-black"
                    : "bg-card text-muted-foreground hover:text-white border border-border"
                }`}
              >
                Upcoming
              </button>
            </div>
          </div>

          {/* Ongoing Offers */}
          <div id="ongoing" ref={ongoingRef} className="mb-20 scroll-mt-36">
            <h2 className="text-white font-black uppercase tracking-wider text-2xl mb-8 flex items-center gap-3">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              Ongoing Offers
            </h2>
            {ongoingOffers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {ongoingOffers.map((offer, i) => (
                  <OfferCard key={i} offer={offer} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No Ongoing Offers"
                desc="There are currently no active offers. Check back soon!"
              />
            )}
          </div>

          {/* Upcoming Offers */}
          <div id="upcoming" ref={upcomingRef} className="scroll-mt-36">
            <h2 className="text-white font-black uppercase tracking-wider text-2xl mb-8 flex items-center gap-3">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              Upcoming Offers
            </h2>
            {upcomingOffers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingOffers.map((offer, i) => (
                  <OfferCard key={i} offer={offer} upcoming />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No Upcoming Offers"
                desc="Stay tuned! Exciting offers are coming soon."
              />
            )}
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
