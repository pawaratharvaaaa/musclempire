import { useState, useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import logo from "@/assets/images/logo.png";

export default function PlanNavbar() {
  const [location, navigate] = useLocation();
  const [nameVisible, setNameVisible] = useState(true);
  const lastScrollY = useRef(0);

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

  const handleBack = () => {
    if (location.startsWith("/products/")) {
      navigate("/products");
    } else {
      navigate("/");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-5 sm:gap-8">
            {/* Back button */}
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-muted-foreground hover:text-[#E8A820] transition-colors text-sm font-bold uppercase tracking-widest cursor-pointer"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Back</span>
            </button>

            {/* Logo + Name — hides on scroll down, shows on scroll up */}
            <motion.a
              href="/"
              onClick={(e) => { e.preventDefault(); navigate("/"); }}
              className="flex items-center gap-3 group"
              animate={{ opacity: nameVisible ? 1 : 0, y: nameVisible ? 0 : -16 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="relative shrink-0">
                <div className="absolute inset-0 rounded-full bg-[#E8A820]/20 blur-lg group-hover:bg-[#E8A820]/35 transition-all duration-400" />
                <img
                  src={logo}
                  alt="Muscle Empire"
                  className="relative h-11 w-11 object-cover rounded-full border-[1.5px] border-[#E8A820]/55 group-hover:border-[#E8A820] transition-all duration-300"
                />
              </div>
              <span className="font-display font-black text-[1.12rem] tracking-tight leading-none text-[#E8A820]">
                Muscle Empire®
              </span>
            </motion.a>
          </div>
          <div />
        </div>
      </div>
    </nav>
  );
}
