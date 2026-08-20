import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import logo from "@/assets/images/logo.png";

export default function Navbar() {
  const [nameVisible, setNameVisible] = useState(true);
  const lastScrollY = useRef(0);
  const [, navigate] = useLocation();

  useEffect(() => {
    const fn = () => {
      const current = window.scrollY;
      if (current > 80) {
        setNameVisible(current < lastScrollY.current);
      } else {
        setNameVisible(true);
      }
      lastScrollY.current = current;
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <motion.div
      className="fixed top-8 left-5 md:left-8 z-50 pointer-events-auto"
      animate={{ opacity: nameVisible ? 1 : 0, y: nameVisible ? 0 : -16 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <a
        href="/"
        onClick={e => { e.preventDefault(); navigate("/"); }}
        className="flex items-center group select-none"
      >
        <div className="relative shrink-0 flex items-center">
          <img
            src={logo}
            alt="Muscle Empire Gymnasium"
            className="h-16 md:h-20 w-auto object-contain drop-shadow-[0_4px_16px_rgba(232,168,32,0.4)] group-hover:scale-105 transition-all duration-300"
            style={{ imageRendering: "-webkit-optimize-contrast" }}
          />
        </div>
      </a>
    </motion.div>
  );
}
