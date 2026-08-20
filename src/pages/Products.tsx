import { useEffect, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import { useLocation } from "wouter";
import PlanNavbar from "@/components/PlanNavbar";
import Footer from "@/components/Footer";
import { products } from "@/data/products";

const WA_NUMBER = "919773053632";

export default function Products() {
  const [, navigate] = useLocation();

  useLayoutEffect(() => {
    const saved = sessionStorage.getItem("scroll_before_product_detail");
    if (saved) {
      window.scrollTo(0, parseInt(saved, 10));
      sessionStorage.removeItem("scroll_before_product_detail");
    }
  }, []);

  useEffect(() => {
    const saved = sessionStorage.getItem("scroll_before_product_detail");
    if (!saved) window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PlanNavbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-6">

          {/* Header */}
          <div className="mb-8">
            <p className="text-primary font-bold uppercase tracking-[0.2em] text-sm mb-2 flex items-center gap-2">
              <span className="w-8 h-px bg-primary inline-block" />
              Our Store
            </p>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-2">
              Gym{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-600">
                Products
              </span>
            </h1>
            <p className="text-muted-foreground text-sm">
              Tap any product to view details.
            </p>
          </div>

          {/* Grid — 2 cols mobile like Amazon/Flipkart */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {products.map((product) => {
              const waMsg = encodeURIComponent(
                `Hi! I'm interested in *${product.name} (${product.subtitle})*. Please share more details.`
              );

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className="bg-card border border-border rounded-xl overflow-hidden flex flex-col hover:border-primary/40 transition-colors shadow-md"
                >
                  {/* Clickable image — smaller aspect ratio */}
                  <button
                    onClick={() => {
                      sessionStorage.setItem("scroll_before_product_detail", String(window.scrollY));
                      navigate(`/products/${product.id}`);
                    }}
                    className="w-full bg-white overflow-hidden"
                    style={{ aspectRatio: "4/3" }}
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                    />
                  </button>

                  {/* Info */}
                  <div className="p-2.5 flex flex-col gap-1 flex-1">
                    <h3 className="text-primary font-black uppercase tracking-tight text-sm leading-tight line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-white/70 text-xs font-medium leading-tight">{product.subtitle}</p>
                    <p className="text-white font-black text-base mt-0.5">{product.price}</p>

                    {/* Shop Now */}
                    <a
                      href={`https://wa.me/${WA_NUMBER}?text=${waMsg}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto w-full flex items-center justify-center gap-1 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-black uppercase tracking-wider py-2 rounded-lg transition-colors text-xs"
                    >
                      <FaWhatsapp size={13} />
                      Shop Now
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
