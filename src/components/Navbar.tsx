import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import logo from "@/assets/images/logo.svg";

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
        className="flex items-center gap-3 group select-none"
      >
        <div className="relative shrink-0">
          <div className="absolute inset-0 rounded-full bg-[#E8A820]/20 blur-lg group-hover:bg-[#E8A820]/35 transition-all duration-400" />
          <img
            src={logo}
            alt="Muscle Empire"
            className="relative h-11 w-11 rounded-full object-cover border-[1.5px] border-[#E8A820]/55 group-hover:border-[#E8A820] transition-all duration-300"
          />
        </div>
        <span className="font-display font-black text-[1.12rem] tracking-tight leading-none text-[#E8A820]">
          Muscle Empire
        </span>
      </a>
    </motion.div>
  );
}
