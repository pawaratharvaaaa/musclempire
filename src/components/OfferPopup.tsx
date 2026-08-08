import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Tag, Sparkles, Clock, ArrowRight, MessageSquare, Flame } from "lucide-react";
import { useLocation } from "wouter";
import { activeOffers, Offer } from "@/data/offers";

const OWNER_PHONE = "919773053632";

export default function OfferPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [, navigate] = useLocation();

  useEffect(() => {
    // Check if popup was already dismissed in this session
    const isDismissed = sessionStorage.getItem("muscle_empire_offer_modal_dismissed");
    if (!isDismissed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1400); // 1.4 second smooth entry delay
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("muscle_empire_offer_modal_dismissed", "true");
  };

  const handleClaimWhatsApp = (offer: Offer) => {
    const text = encodeURIComponent(offer.whatsappMessage);
    window.open(`https://wa.me/${OWNER_PHONE}?text=${text}`, "_blank");
    handleClose();
  };

  const handleViewAllOffers = () => {
    handleClose();
    navigate("/offers");
  };

  const currentOffer = activeOffers[currentIndex] || activeOffers[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-[#1C1C1E] border border-[#E8A820]/40 rounded-3xl p-6 sm:p-8 shadow-[0_25px_70px_rgba(232,168,32,0.15)] text-white z-10 overflow-hidden"
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#E8A820]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-neutral-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer z-20"
              aria-label="Close offers popup"
            >
              <X size={18} />
            </button>

            {/* Modal Header Badge */}
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#E8A820]/15 border border-[#E8A820]/40 text-[#E8A820] text-xs font-black uppercase tracking-widest">
                <Sparkles size={13} />
                <span>{currentOffer.badge}</span>
              </span>
              <span className="flex items-center gap-1 text-[11px] text-neutral-400 font-semibold bg-white/[0.04] px-2.5 py-1 rounded-full">
                <Flame size={12} className="text-[#E8A820]" />
                Exclusive Web Deal
              </span>
            </div>

            {/* Offer Main Details */}
            <div className="mb-6">
              <div className="inline-block bg-gradient-to-r from-[#E8A820] to-yellow-500 text-black px-4 py-1.5 rounded-xl font-black text-xl sm:text-2xl uppercase tracking-tight mb-3 shadow-lg">
                {currentOffer.discount}
              </div>

              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mb-2 leading-snug">
                {currentOffer.title}
              </h2>

              <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed mb-4">
                {currentOffer.description}
              </p>

              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <Clock size={14} className="text-[#E8A820]" />
                <span>Valid until: <strong className="text-white">{currentOffer.validTill}</strong></span>
              </div>
            </div>

            {/* Carousel Dots if multiple offers */}
            {activeOffers.length > 1 && (
              <div className="flex items-center justify-center gap-2 mb-6">
                {activeOffers.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      currentIndex === idx ? "w-6 bg-[#E8A820]" : "w-2 bg-white/20"
                    }`}
                    aria-label={`Go to offer ${idx + 1}`}
                  />
                ))}
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => handleClaimWhatsApp(currentOffer)}
                className="w-full sm:flex-1 h-12 bg-[#E8A820] hover:bg-[#d49518] text-black font-black uppercase tracking-wider text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer"
              >
                <MessageSquare size={16} />
                <span>{currentOffer.ctaText}</span>
              </button>

              <button
                onClick={handleViewAllOffers}
                className="w-full sm:w-auto px-5 h-12 bg-white/5 hover:bg-white/10 text-white font-bold uppercase tracking-wider text-xs rounded-xl border border-white/10 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>All Offers</span>
                <ArrowRight size={14} className="text-[#E8A820]" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
