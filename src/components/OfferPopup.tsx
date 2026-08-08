import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Clock, ArrowRight, MessageSquare, Flame } from "lucide-react";
import { useLocation } from "wouter";
import { activeOffers, Offer } from "@/data/offers";

const OWNER_PHONE = "919773053632";

export default function OfferPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [, navigate] = useLocation();

  useEffect(() => {
    const isDismissed = sessionStorage.getItem("muscle_empire_offer_modal_dismissed");
    if (!isDismissed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1400);
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl z-10 overflow-hidden"
          >
            {/* Top accent strip */}
            <div className="h-1 w-full bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800" />

            <div className="p-6 sm:p-8">
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close offers popup"
              >
                <X size={16} />
              </button>

              {/* Header badges */}
              <div className="flex items-center gap-2 mb-5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-900 text-white text-[11px] font-bold uppercase tracking-widest">
                  <Sparkles size={11} />
                  {currentOffer.badge}
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-[11px] font-semibold">
                  <Flame size={11} className="text-orange-400" />
                  Exclusive Deal
                </span>
              </div>

              {/* Discount badge */}
              <div className="inline-block bg-gray-900 text-white px-4 py-1.5 rounded-lg font-black text-xl sm:text-2xl uppercase tracking-tight mb-3">
                {currentOffer.discount}
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-gray-900 mb-2 leading-tight">
                {currentOffer.title}
              </h2>

              {/* Description */}
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                {currentOffer.description}
              </p>

              {/* Valid until */}
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
                <Clock size={13} />
                <span>
                  Valid until:{" "}
                  <strong className="text-gray-700">{currentOffer.validTill}</strong>
                </span>
              </div>

              {/* Carousel dots */}
              {activeOffers.length > 1 && (
                <div className="flex items-center justify-center gap-2 mb-6">
                  {activeOffers.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        currentIndex === idx
                          ? "w-6 bg-gray-900"
                          : "w-2 bg-gray-300"
                      }`}
                      aria-label={`Go to offer ${idx + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleClaimWhatsApp(currentOffer)}
                  className="flex-1 h-11 bg-gray-900 hover:bg-gray-700 text-white font-bold uppercase tracking-wider text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
                >
                  <MessageSquare size={15} />
                  {currentOffer.ctaText}
                </button>

                <button
                  onClick={handleViewAllOffers}
                  className="h-11 px-5 bg-white hover:bg-gray-50 text-gray-700 font-bold uppercase tracking-wider text-xs rounded-xl border border-gray-200 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  All Offers
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
