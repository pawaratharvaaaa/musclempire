import { useLocation } from "wouter";
import StaggeredMenu from "@/components/ui/StaggeredMenu";

const navLinks = [
  { name: "Branches", href: "/branches", isPage: true },
  { name: "Reviews", href: "#reviews" },
  { name: "Contact", href: "#contact" },
  { name: "Offers", href: "/offers", isPage: true },
  { name: "Nutrition", href: "/nutrition", isPage: true },
];

const staggeredItems = [
  { label: "Branches", ariaLabel: "View branch locations", link: "/branches" },
  { label: "Gallery", ariaLabel: "View gallery", link: "/gallery" },
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

export default function GlobalMenu() {
  const [, navigate] = useLocation();

  const handleItemClick = (item: { label: string; link: string }, e: React.MouseEvent) => {
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

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[60]">
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
        onItemClick={handleItemClick}
        onMenuOpen={() => window.dispatchEvent(new CustomEvent("menuStateChange", { detail: true }))}
        onMenuClose={() => window.dispatchEvent(new CustomEvent("menuStateChange", { detail: false }))}
      />
    </div>
  );
}
