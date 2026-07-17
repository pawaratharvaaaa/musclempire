import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import logo from "@/assets/images/logo.svg";

export default function PlanNavbar() {
  const [location, navigate] = useLocation();

  const handleBack = () => {
    // If on a product detail page, go back to /products
    if (location.startsWith("/products/")) {
      navigate("/products");
    } else {
      // For all other plan pages, go home (scroll restored by Home.tsx useLayoutEffect)
      navigate("/");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50 shadow-sm">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a
            href="/"
            onClick={(e) => { e.preventDefault(); navigate("/"); }}
            className="flex items-center gap-3 group"
          >
            <img
              src={logo}
              alt="Muscle Empire"
              className="h-14 w-14 object-cover rounded-full border-2 border-primary group-hover:scale-105 transition-transform shrink-0"
            />
            <span className="font-display font-black text-lg sm:text-2xl tracking-tighter uppercase text-primary">
              Muscle Empire
            </span>
          </a>

          {/* Back button */}
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm font-bold uppercase tracking-widest"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Back</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
