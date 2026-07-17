import { FaWhatsapp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const DEMO_MSG = encodeURIComponent(
  "Hi! I'd like to book a FREE demo session at Muscle Empire Gymnasium. Please share the available slots."
);
const DEMO_LINK = `https://wa.me/919773053632?text=${DEMO_MSG}`;

export default function DemoBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleMenuStateChange = (e: Event) => {
      const customEvent = e as CustomEvent<boolean>;
      setMenuOpen(customEvent.detail);
    };
    window.addEventListener("menuStateChange", handleMenuStateChange);
    return () => window.removeEventListener("menuStateChange", handleMenuStateChange);
  }, []);

  return (
    <AnimatePresence>
      {!menuOpen && (
        <motion.div
          className="fixed bottom-5 left-0 right-0 z-[998] flex items-center justify-center px-4 pointer-events-none"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="pointer-events-auto text-white/85 text-[13px] sm:text-sm font-medium text-center drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
            Book a{" "}
            <a
              href={DEMO_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#25D366] font-bold hover:underline"
            >
              free demo session
            </a>{" "}
            for{" "}
            <span className="text-[#E8A820] font-bold">FREE</span>{" "}
            and{" "}
            <a
              href={DEMO_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#25D366] font-bold uppercase tracking-wide hover:underline"
            >
              <FaWhatsapp size={13} />
              Book now
            </a>
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
