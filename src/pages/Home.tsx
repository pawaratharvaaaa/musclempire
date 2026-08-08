import { useLayoutEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import WhyChooseUs from "@/components/WhyChooseUs";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";
import OfferPopup from "@/components/OfferPopup";

export default function Home() {
  const [loading, setLoading] = useState(true);

  // Restore scroll before first paint — no flash at position 0
  useLayoutEffect(() => {
    const saved = sessionStorage.getItem("scroll_before_plans");
    if (saved !== null) {
      window.scrollTo(0, parseInt(saved, 10));
      sessionStorage.removeItem("scroll_before_plans");
    }
    // Always show the offer popup on every home page load/reload
    sessionStorage.removeItem("muscle_empire_offer_modal_dismissed");
  }, []);

  return (
    <>
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      
      {!loading && (
        <div className="min-h-[100dvh] w-full bg-background text-foreground selection:bg-primary selection:text-black">
          <Navbar />
          <main>
            <Hero />
            <About />
            <Services />
            <WhyChooseUs />
            <Pricing />
            <Testimonials />
            <Contact />
          </main>
          <Footer />
          <OfferPopup />
        </div>
      )}
    </>
  );
}
