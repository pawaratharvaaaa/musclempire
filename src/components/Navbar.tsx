import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useLocation } from "wouter";
import logo from "@/assets/images/logo.svg";
import StaggeredMenu from "@/components/ui/StaggeredMenu";

const navLinks = [
  { name: "Reviews", href: "#reviews" },
  { name: "Contact", href: "#contact" },
  { name: "Offers", href: "/offers", isPage: true },
  { name: "Nutrition", href: "/nutrition", isPage: true },
];
const pricingLinks = [
  { name: "Unisex Gym", href: "/unisex-gym-plans" },
  { name: "Female Gym", href: "/female-gym-plans" },
];

/* StaggeredMenu items */
const staggeredItems = [
  ...navLinks.map(l => ({ label: l.name, ariaLabel: `Go to ${l.name}`, link: l.href })),
  { label: "Pricing", ariaLabel: "View pricing plans", link: "#pricing" },
];

const staggeredSocials = [
  { label: "Instagram", link: "https://instagram.com" },
  { label: "YouTube", link: "https://youtube.com" },
  { label: "WhatsApp", link: "https://wa.me/" },
];

function smoothScroll(href: string) {
  const el = document.querySelector(href);
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 76, behavior: "smooth" });
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [nameVisible, setNameVisible] = useState(true);
  const [activeSection, setActiveSection] = useState("home");
  const [pricingOpen, setPricingOpen] = useState(false);
  const pricingRef = useRef<HTMLLIElement>(null);
  const lastScrollY = useRef(0);
  const [, navigate] = useLocation();

  useEffect(() => {
    const fn = () => {
      const current = window.scrollY;
      setScrolled(current > 50);
      if (current > 80) {
        // scrolling down → hide; scrolling up → show
        setNameVisible(current < lastScrollY.current);
      } else {
        setNameVisible(true);
      }
      lastScrollY.current = current;
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && setActiveSection(e.target.id)),
      { threshold: 0.3 }
    );
    document.querySelectorAll("section[id]").forEach(s => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (pricingRef.current && !pricingRef.current.contains(e.target as Node)) setPricingOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const handleNav = (e: React.MouseEvent, href: string, isPage?: boolean) => {
    e.preventDefault();
    setPricingOpen(false);
    if (isPage || href.startsWith("/")) { sessionStorage.setItem("scroll_before_plans", String(window.scrollY)); navigate(href); }
    else setTimeout(() => smoothScroll(href), 10);
  };

  const handleStaggeredItemClick = (item: { label: string; link: string }, e: React.MouseEvent) => {
    e.preventDefault();
    const link = navLinks.find(l => l.name === item.label);
    if (link) {
      if (link.isPage || link.href.startsWith("/")) {
        sessionStorage.setItem("scroll_before_plans", String(window.scrollY));
        navigate(link.href);
      } else {
        setTimeout(() => smoothScroll(link.href), 10);
      }
    } else if (item.link.startsWith("/")) {
      sessionStorage.setItem("scroll_before_plans", String(window.scrollY));
      navigate(item.link);
    } else if (item.link.startsWith("#")) {
      setTimeout(() => smoothScroll(item.link), 10);
    }
  };

  const isAct = (href: string) => activeSection === href.replace("#", "");

  return (
    <>
      {/* Logo and Name in top-left */}
      <motion.div
        className="fixed top-8 left-5 md:left-8 z-50 pointer-events-auto"
        animate={{ opacity: nameVisible ? 1 : 0, y: nameVisible ? 0 : -16 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <a href="/" onClick={e => { e.preventDefault(); navigate("/"); }} className="flex items-center gap-3 group select-none">
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-full bg-[#E8A820]/20 blur-lg group-hover:bg-[#E8A820]/35 transition-all duration-400" />
            <img src={logo} alt="Muscle Empire" className="relative h-11 w-11 rounded-full object-cover border-[1.5px] border-[#E8A820]/55 group-hover:border-[#E8A820] transition-all duration-300" />
          </div>
          <span className="font-display font-black text-[1.12rem] tracking-tight leading-none text-[#E8A820]">Muscle Empire</span>
        </a>
      </motion.div>

      {/* StaggeredMenu (visible at all sizes, toggle button in top-right) */}
      <motion.div
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-[60]"
        animate={{ opacity: nameVisible ? 1 : 0, y: nameVisible ? 0 : -16 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <StaggeredMenu
          position="right"
          isFixed
          items={staggeredItems}
          socialItems={staggeredSocials}
          displaySocials

          menuButtonColor="#F2EFE9"
          openMenuButtonColor="#F2EFE9"
          changeMenuColorOnOpen
          colors={["#1C1C1E", "#252528"]}
          accentColor="#E8A820"
          onItemClick={handleStaggeredItemClick}
          onMenuOpen={() => window.dispatchEvent(new CustomEvent("menuStateChange", { detail: true }))}
          onMenuClose={() => window.dispatchEvent(new CustomEvent("menuStateChange", { detail: false }))}
        />
      </motion.div>
    </>
  );
}
