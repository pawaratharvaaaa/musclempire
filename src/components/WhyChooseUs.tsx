import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  {
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80',
    title: 'Expert Trainers',
    description: 'Certified professionals dedicated to your success.',
  },
  {
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&q=80',
    title: 'Personalised Plans',
    description: 'Designed specifically for your unique body and goals.',
  },
  {
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80',
    title: 'Modern Equipment',
    description: 'State-of-the-art machines for optimal performance.',
  },
  {
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&q=80',
    title: 'Strong Community',
    description: 'Train alongside a motivating fitness family.',
  },
  {
    image: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=600&q=80',
    title: 'Flexible Timings',
    description: 'Adapting seamlessly to your demanding lifestyle.',
  },
  {
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80',
    title: 'Group Classes',
    description: 'High-energy sessions to push your limits together.',
  },
  {
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80',
    title: 'Recovery Zone',
    description: 'Dedicated spaces to heal, stretch, and recover.',
  },
  {
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80',
    title: 'Nutrition Bar',
    description: 'Fuel up with premium supplements and fresh smoothies.',
  },
];

// Split into 3 columns (8 items: 3, 2, 3)
const COL_1 = [FEATURES[0], FEATURES[1], FEATURES[2]];
const COL_2 = [FEATURES[3], FEATURES[4]];
const COL_3 = [FEATURES[5], FEATURES[6], FEATURES[7]];

function FeatureCard({ feature, index }: { feature: any, index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="group flex flex-col mb-10"
    >
      <div className="rounded-3xl overflow-hidden mb-5 relative aspect-[4/5] bg-black/5">
        <img 
          src={feature.image} 
          alt={feature.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
      </div>
      <h3 className="font-display font-black text-2xl text-black mb-2">{feature.title}</h3>
      <p className="text-black/60 text-sm leading-relaxed">{feature.description}</p>
    </motion.div>
  );
}

export default function WhyChooseUs() {
  const containerRef = useRef<HTMLDivElement>(null);
  const col1Ref = useRef<HTMLDivElement>(null);
  const col2Ref = useRef<HTMLDivElement>(null);
  const col3Ref = useRef<HTMLDivElement>(null);
  
  // Mobile Carousel State
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sentinelsRef = useRef<(HTMLDivElement | null)[]>([]);
  const scrollZoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Mobile Intersection Observer for Sentinels
    const mm = gsap.matchMedia();
    
    mm.add("(max-width: 767px)", () => {
      const visibleSentinels = new Set<number>();
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const idx = parseInt(entry.target.getAttribute('data-slide') || '0', 10);
          if (entry.isIntersecting) {
            visibleSentinels.add(idx);
          } else {
            visibleSentinels.delete(idx);
          }
        });

        if (visibleSentinels.size > 0) {
          const minVisible = Math.min(...Array.from(visibleSentinels));
          setIsVisible(true);
          setActiveIndex(minVisible);
        } else {
          setIsVisible(false);
        }
      }, { threshold: 0.3 });

      sentinelsRef.current.forEach(s => {
        if (s) observer.observe(s);
      });

      return () => observer.disconnect();
    });

    return () => mm.revert();
  }, []);

  useEffect(() => {
    // Only run parallax on desktop
    const mm = gsap.matchMedia();
    
    mm.add("(min-width: 768px)", () => {
      const ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2, // Smooth scrubbing
          animation: gsap.timeline()
            .to(col1Ref.current, { y: "10%", ease: "none" }, 0)
            .to(col2Ref.current, { y: "25%", ease: "none" }, 0)
            .to(col3Ref.current, { y: "15%", ease: "none" }, 0)
        });
      });
      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  // Lock body scroll on mobile when popup is completely active, but wait - 
  // We don't want to lock body scroll because they need to scroll the sentinels!
  // The original script doesn't lock body scroll, it just overlays.
  
  // Touch swipe logic
  const [touchStartX, setTouchStartX] = useState(0);
  const handleTouchStart = (e: React.TouchEvent) => setTouchStartX(e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) {
      if (dx < 0 && activeIndex < FEATURES.length - 1) setActiveIndex(activeIndex + 1);
      else if (dx > 0 && activeIndex > 0) setActiveIndex(activeIndex - 1);
    }
  };

  return (
    <section ref={containerRef} className="bg-white pt-16 pb-40 overflow-hidden relative" id="why-us">
      {/* Decorative gradient blur in background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-30 pointer-events-none blur-[100px]"
           style={{ background: "radial-gradient(circle, #E8A820 0%, transparent 60%)" }} />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <p className="text-[#C8900A] text-sm font-black uppercase tracking-[0.25em] mb-4">
            The Empire Standard
          </p>
          <h2 className="font-display font-black text-black text-5xl md:text-7xl leading-tight mb-6">
            Why train <br className="hidden md:block" />
            <span className="text-[#C8900A]">with us?</span>
          </h2>
          <p className="text-black/50 text-lg">
            Experience world-class facilities designed to elevate your fitness journey.
          </p>
        </div>

        {/* Parallax Grid (Desktop Only) */}
        <div className="hidden md:grid grid-cols-3 gap-8 lg:gap-14 items-start mb-16">
          {/* Column 1 */}
          <div ref={col1Ref} className="flex flex-col md:mt-0">
            {COL_1.map((f, i) => (
              <FeatureCard key={`col1-${i}`} feature={f} index={i} />
            ))}
          </div>

          {/* Column 2 */}
          <div ref={col2Ref} className="flex flex-col md:mt-12">
            {COL_2.map((f, i) => (
              <FeatureCard key={`col2-${i}`} feature={f} index={i + 3} />
            ))}
          </div>

          {/* Column 3 */}
          <div ref={col3Ref} className="flex flex-col md:mt-6">
            {COL_3.map((f, i) => (
              <FeatureCard key={`col3-${i}`} feature={f} index={i + 5} />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Scroll Sentinels (Invisible) */}
      <div ref={scrollZoneRef} className="block md:hidden">
        {FEATURES.map((_, i) => (
          <div 
            key={`sentinel-${i}`}
            ref={(el) => (sentinelsRef.current[i] = el)}
            data-slide={i}
            className="h-[80vh] w-full pointer-events-none"
          />
        ))}
      </div>

      {/* Mobile Fixed Carousel Popup */}
      <div 
        className={`fixed inset-0 z-50 pointer-events-none transition-all duration-700 block md:hidden ${isVisible ? 'opacity-100 delay-[500ms]' : 'opacity-0 delay-0'}`}
      >
        {/* Dimmer */}
        <div 
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-all duration-700 pointer-events-auto ${isVisible ? 'opacity-100 delay-[500ms]' : 'opacity-0 delay-0'}`}
        />

        {/* Popup Content */}
        <div 
          className={`absolute left-1/2 top-1/2 w-[100vw] h-[100vh] sm:w-[90vw] max-w-[400px] sm:h-auto p-4 sm:p-6 pb-8 flex flex-col justify-center items-center transition-all duration-700 pointer-events-auto ${isVisible ? 'scale-100 -translate-x-1/2 -translate-y-1/2 blur-none delay-[500ms]' : 'scale-95 -translate-x-1/2 translate-y-[-40%] blur-md delay-0'}`}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Track Wrapper */}
          <div className="w-[290px] xs:w-[330px] sm:w-[360px] h-[460px] xs:h-[520px] sm:h-[560px] rounded-[24px] overflow-hidden relative mt-8">
            <motion.div 
              className="absolute top-0 bottom-0 left-0 flex items-center gap-[12px]"
              animate={{ x: `calc(50% - ${activeIndex * (100 / FEATURES.length)}% - 50%)` }}
              style={{ width: `${FEATURES.length * 100}%` }}
              transition={{ ease: [0.22, 0.61, 0.36, 1], duration: 0.8 }}
            >
              {FEATURES.map((feature, i) => {
                const isActive = i === activeIndex;
                return (
                  <div 
                    key={`card-${i}`} 
                    className="relative w-full h-full rounded-2xl overflow-hidden transition-all duration-700 shrink-0 shadow-2xl"
                    style={{
                      transform: isActive ? 'scale(1)' : 'scale(0.92)',
                      opacity: isActive ? 1 : 0.7,
                      flex: `0 0 calc(${100 / FEATURES.length}% - ${12 * (FEATURES.length - 1) / FEATURES.length}px)`
                    }}
                    onClick={() => setActiveIndex(i)}
                  >
                    <img 
                      src={feature.image} 
                      alt={feature.title} 
                      className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ${isActive ? 'scale-[1.08]' : 'scale-100'}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
                    
                    <div className={`absolute bottom-0 left-0 right-0 p-5 pt-10 transition-all duration-500 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                      <p className="text-[#E8A820] text-[0.6rem] font-bold uppercase tracking-widest mb-1">{feature.title}</p>
                      <h3 className="font-display font-medium text-white text-xl leading-tight mb-2">{feature.title}</h3>
                      <p className="text-white/60 text-xs leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
