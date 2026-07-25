import { useEffect, useRef } from "react";
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

        {/* Parallax Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-14 items-start mb-16">
          
          {/* Column 1 */}
          <div ref={col1Ref} className="flex flex-col md:mt-0">
            {COL_1.map((f, i) => (
              <FeatureCard key={i} feature={f} index={i} />
            ))}
          </div>

          {/* Column 2 */}
          <div ref={col2Ref} className="flex flex-col md:mt-12">
            {COL_2.map((f, i) => (
              <FeatureCard key={i} feature={f} index={i + 3} />
            ))}
          </div>

          {/* Column 3 */}
          <div ref={col3Ref} className="flex flex-col md:mt-6">
            {COL_3.map((f, i) => (
              <FeatureCard key={i} feature={f} index={i + 5} />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
