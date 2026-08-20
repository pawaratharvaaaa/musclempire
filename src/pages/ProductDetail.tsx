import { useState, useRef, useLayoutEffect, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useLocation } from "wouter";
import PlanNavbar from "@/components/PlanNavbar";
import Footer from "@/components/Footer";
import { products } from "@/data/products";

const WA_NUMBER = "919773053632";

function ImageSlider({ images, name }: { images: string[]; name: string }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const touchStartX = useRef<number | null>(null);

  const prev = () => { if (current > 0) { setDirection(-1); setCurrent(c => c - 1); } };
  const next = () => { if (current < images.length - 1) { setDirection(1); setCurrent(c => c + 1); } };

  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 40) next();
    if (diff < -40) prev();
    touchStartX.current = null;
  };

  return (
    <div
      className="relative w-full overflow-hidden bg-white select-none rounded-xl"
      style={{ aspectRatio: "1/1" }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={{
            enter: (d: number) => ({ x: d * 100 + "%", opacity: 0 }),
            center: { x: 0, opacity: 1 },
            exit: (d: number) => ({ x: d * -100 + "%", opacity: 0 }),
          }}
          initial="enter" animate="center" exit="exit"
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img src={images[current]} alt={`${name} ${current + 1}`} className="w-full h-full object-contain" />
        </motion.div>
      </AnimatePresence>

      {current > 0 && (
        <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 hover:bg-black/80 text-white flex items-center justify-center rounded-full z-10">
          <ChevronLeft size={20} />
        </button>
      )}
      {current < images.length - 1 && (
        <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 hover:bg-black/80 text-white flex items-center justify-center rounded-full z-10">
          <ChevronRight size={20} />
        </button>
      )}

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {images.map((_, i) => (
          <div key={i} className={`h-1.5 rounded-full transition-all ${i === current ? "w-5 bg-primary" : "w-1.5 bg-black/40"}`} />
        ))}
      </div>
    </div>
  );
}

export default function ProductDetail({ params }: { params: { id: string } }) {
  const [, navigate] = useLocation();
  const [expanded, setExpanded] = useState(false);
  const savedScroll = useRef(0);

  const product = products.find(p => p.id === Number(params.id));

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-white text-xl font-bold">Product not found.</p>
      </div>
    );
  }

  // Short = first 3-4 lines (first paragraph split into sentences)
  const paragraphs = product.description.split("\n\n");
  const shortDesc = paragraphs.slice(0, 2).join("\n\n");

  const waMsg = encodeURIComponent(
    `Hi! I'm interested in *${product.name} (${product.subtitle})*. Please share more details.`
  );

  const toggleExpand = () => {
    if (expanded) {
      setExpanded(false);
      window.scrollTo({ top: savedScroll.current, behavior: "instant" as ScrollBehavior });
    } else {
      savedScroll.current = window.scrollY;
      setExpanded(true);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PlanNavbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-6 max-w-2xl">

          {/* Image slider */}
          <div className="mb-6">
            <ImageSlider images={product.images} name={product.name} />
          </div>

          {/* Name & price */}
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white leading-tight mb-1">
            {product.name}
          </h1>
          <p className="text-primary text-sm font-bold uppercase tracking-widest mb-3">{product.subtitle}</p>
          <p className="text-2xl font-black text-white mb-6">{product.price}</p>

          {/* Description */}
          <div className="text-muted-foreground text-sm leading-relaxed mb-6">
            <p className="whitespace-pre-line">
              {expanded ? product.description : shortDesc}
            </p>
            <button
              onClick={toggleExpand}
              className="text-primary font-bold uppercase tracking-widest text-xs mt-3 hover:underline"
            >
              {expanded ? "Show Less ↑" : "Show More ↓"}
            </button>
          </div>

          {/* Shop Now */}
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${waMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-black uppercase tracking-widest py-4 rounded-xl transition-colors text-base"
          >
            <FaWhatsapp size={22} />
            Shop Now on WhatsApp
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}
