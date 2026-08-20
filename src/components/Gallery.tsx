import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";

export const GALLERY_IMAGES = [
  { src: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80", alt: "Main gym floor", span: "col-span-2 row-span-2" },
  { src: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80", alt: "Weight training area", span: "col-span-1 row-span-1" },
  { src: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80", alt: "Cardio zone", span: "col-span-1 row-span-1" },
  { src: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80", alt: "Group class", span: "col-span-1 row-span-2" },
  { src: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&q=80", alt: "Personal training", span: "col-span-1 row-span-1" },
  { src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80", alt: "Locker room", span: "col-span-1 row-span-1" },
  { src: "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=800&q=80", alt: "Free weights", span: "col-span-2 row-span-1" },
  { src: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80", alt: "Gym entrance", span: "col-span-1 row-span-1" },
  { src: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80", alt: "Bench press", span: "col-span-1 row-span-1" },
  { src: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&q=80", alt: "Dumbbell rack", span: "col-span-1 row-span-1" },
  { src: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80", alt: "Stretching area", span: "col-span-2 row-span-1" },
  { src: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800&q=80", alt: "Trainer session", span: "col-span-1 row-span-1" },
];

// First 5 images shown on home page
const PREVIEW_IMAGES = GALLERY_IMAGES.slice(0, 5);

export function GalleryLightbox({ images, index, onClose }: {
  images: typeof GALLERY_IMAGES;
  index: number;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(index);
  const prev = () => setCurrent(i => (i - 1 + images.length) % images.length);
  const next = () => setCurrent(i => (i + 1) % images.length);

  return (
    <motion.div
      className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <button className="absolute top-5 right-5 text-white/70 hover:text-white p-2" onClick={onClose}>
        <X size={28} />
      </button>
      <button className="absolute left-4 md:left-8 text-white/70 hover:text-white p-2" onClick={e => { e.stopPropagation(); prev(); }}>
        <ChevronLeft size={36} />
      </button>
      <button className="absolute right-4 md:right-8 text-white/70 hover:text-white p-2" onClick={e => { e.stopPropagation(); next(); }}>
        <ChevronRight size={36} />
      </button>
      <motion.img
        key={current}
        src={images[current].src.replace("w=800", "w=1400")}
        alt={images[current].alt}
        className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
        initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }} transition={{ duration: 0.25 }}
        onClick={e => e.stopPropagation()}
      />
      <div className="absolute bottom-6 text-white/40 text-sm">{current + 1} / {images.length}</div>
    </motion.div>
  );
}

export default function Gallery() {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [, navigate] = useLocation();

  return (
    <section id="gallery" className="bg-[#111] py-28 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />

      <div className="max-w-7xl mx-auto px-5 md:px-8 mb-14 relative z-10">
        <div className="text-center max-w-xl mx-auto">
          <div className="eyebrow justify-center mb-4 text-[#E8A820] border-[#E8A820]/20 bg-[#E8A820]/10">Our Space</div>
          <h2 className="font-display font-black text-white text-[clamp(2.5rem,5vw,3.5rem)] leading-none mb-6">
            Inside the <br /><span className="text-gold-gradient">Empire</span>
          </h2>
          <p className="text-white/50 text-lg leading-relaxed">Take a look at the world-class facilities waiting for you.</p>
        </div>
      </div>

      {/* Preview grid — 5 images */}
      <div className="max-w-7xl mx-auto px-5 md:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[220px] gap-3 md:gap-4">
          {PREVIEW_IMAGES.map((img, i) => (
            <motion.div
              key={i}
              className={`${img.span} relative overflow-hidden rounded-2xl cursor-pointer group`}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              onClick={() => setLightbox(i)}
            >
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${img.src})` }} />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white text-sm font-semibold tracking-wide bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm">View</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All button */}
        <div className="flex justify-center mt-10">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/gallery")}
            className="flex items-center gap-3 bg-[#E8A820] hover:bg-[#d4971a] text-black font-black uppercase tracking-widest px-8 py-4 rounded-2xl text-sm transition-colors"
          >
            View Full Gallery
            <ArrowRight size={18} />
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {lightbox !== null && (
          <GalleryLightbox images={PREVIEW_IMAGES} index={lightbox} onClose={() => setLightbox(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
