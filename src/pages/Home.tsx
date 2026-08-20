import { useLayoutEffect, useState, useEffect } from "react";
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

export default function Home() {
  const [loading, setLoading] = useState(true);

  // Restore scroll before first paint if returning from sub-page
  useLayoutEffect(() => {
    const saved = sessionStorage.getItem("scroll_before_plans");
    if (saved !== null) {
      window.scrollTo(0, parseInt(saved, 10));
      sessionStorage.removeItem("scroll_before_plans");
    }
  }, []);

  // Reset scroll to top if not restoring scroll or scrolling to hash
  useEffect(() => {
    if (!sessionStorage.getItem("scroll_before_plans") && !sessionStorage.getItem("scroll_to_hash")) {
      window.scrollTo(0, 0);
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      const hash = sessionStorage.getItem("scroll_to_hash");
      if (hash) {
        sessionStorage.removeItem("scroll_to_hash");
        setTimeout(() => {
          const el = document.querySelector(hash);
          if (el) {
            const top = el.getBoundingClientRect().top + window.scrollY - 76;
            window.scrollTo({ top, behavior: "smooth" });
          }
        }, 300);
      }
    }
  }, [loading]);

  return (
    <>
      {loading && <Preloader onComplete={() => setLoading(false)} />}

      {/* Always mounted so the slide-up exit reveals the page underneath */}
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
      </div>
    </>
  );
}
