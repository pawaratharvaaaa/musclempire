import { motion } from "framer-motion";
import { Dumbbell, Users, ArrowRight, Check } from "lucide-react";
import { useLocation } from "wouter";
import unisexBg from "@/assets/images/unisex-bg.png";
import femaleBg from "@/assets/images/female-bg.png";

const gyms = [
  {
    title: "Muscle Empire Gymnasium",
    subtitle: "Unisex",
    Icon: Dumbbell,
    tag: "For everyone",
    tagStyle: "bg-[#E8A820] text-[#1C1C1E]",
    desc: "A complete fitness destination with strength training, cardio, CrossFit, expert trainers, and premium equipment for all fitness levels.",
    price: "Starting from ₹1,500/month",
    features: ["Expert trainers", "Full strength & cardio equipment", "CrossFit sessions", "All fitness levels welcome"],
    href: "/unisex-gym-plans",
    featured: true,
    bgImg: unisexBg,
    accentColor: "#E8A820",
    glowColor: "rgba(232,168,32,0.15)",
  },
  {
    title: "Muscle Empire Crossfit Studio",
    subtitle: "Female only",
    Icon: Users,
    tag: "Ladies only",
    tagStyle: "bg-pink-500/15 text-pink-400 border border-pink-500/30",
    desc: "A dedicated women's space offering strength training, CrossFit, weight management, and personal coaching in a comfortable environment.",
    price: "Starting from ₹1,500/month",
    features: ["Women-only environment", "Personal coaching", "Weight management", "Crossfit & strength training"],
    href: "/female-gym-plans",
    featured: false,
    bgImg: femaleBg,
    accentColor: "#ec4899",
    glowColor: "rgba(236,72,153,0.15)",
  },
];

export default function Pricing() {
  const [, navigate] = useLocation();

  return (
    <section id="pricing" className="py-28 bg-[#1C1C1E] relative overflow-hidden">
      {/* Golden grid background */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(232,168,32,0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(232,168,32,0.12) 1px, transparent 1px)
          `,
          backgroundSize: "36px 36px",
        }}
      />
      {/* Central golden radial glow over the grid */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(232,168,32,0.10) 0%, transparent 75%)",
        }}
      />
      {/* Vignette to fade grid at edges */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, #1C1C1E 100%)",
        }}
      />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />

      <div className="max-w-7xl mx-auto px-5 md:px-8 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-xl mx-auto mb-16"
        >
          <div className="eyebrow justify-center mb-4">Membership plans</div>
          <h2 className="font-display font-black text-white text-[clamp(2rem,4.5vw,2.9rem)] mb-4">
            Invest in <span className="text-gold-gradient">yourself</span>
          </h2>
          <p className="text-white/50 text-[1rem] leading-relaxed">
            Two world-class facilities. One goal — your transformation.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {gyms.map((gym, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className={`group relative flex flex-col rounded-[22px] p-8 border transition-all duration-300 overflow-hidden hover:-translate-y-2 ${
                gym.featured
                  ? "bg-[#232325]/90 border-[#E8A820]/30 shadow-[0_0_50px_rgba(0,0,0,0.3)] hover:border-[#E8A820]/60 hover:shadow-[0_20px_50px_rgba(232,168,32,0.15)]"
                  : "bg-[#1a1018]/90 border-pink-500/20 shadow-[0_0_50px_rgba(0,0,0,0.3)] hover:border-pink-500/40 hover:shadow-[0_20px_50px_rgba(236,72,153,0.15)]"
              }`}
            >
              {/* Background Image Layer */}
              <div className="absolute inset-0 -z-20 overflow-hidden rounded-[22px] pointer-events-none">
                <div 
                  className="w-full h-full bg-cover bg-center transition-all duration-700 opacity-[0.07] group-hover:opacity-[0.16] group-hover:scale-110"
                  style={{ backgroundImage: `url(${gym.bgImg})` }}
                />
              </div>

              {/* Tint Overlay for contrast */}
              <div 
                className={`absolute inset-0 -z-10 rounded-[22px] transition-opacity duration-300 pointer-events-none ${
                  gym.featured 
                    ? "bg-gradient-to-b from-[#232325]/85 via-[#232325]/95 to-[#232325]" 
                    : "bg-gradient-to-b from-[#1a1018]/85 via-[#1a1018]/95 to-[#1a1018]"
                }`} 
              />

              {/* Tag */}
              <span className={`absolute top-6 right-6 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full z-10 ${gym.tagStyle}`}>
                {gym.tag}
              </span>

              {/* Accent glow on hover */}
              <div 
                className="absolute inset-0 rounded-[22px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
                style={{ 
                  background: `radial-gradient(circle at 50% 20%, ${gym.glowColor} 0%, transparent 60%)` 
                }} 
              />

              {/* Icon */}
              <div className={`w-[52px] h-[52px] rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 ${
                gym.featured ? "bg-[#E8A820]/14 text-[#E8A820]" : "bg-pink-500/[0.12] text-pink-400"
              }`}>
                <gym.Icon size={24} />
              </div>

              <h3 className="text-white font-black text-[1.2rem] tracking-tight mb-1 pr-20 z-10">{gym.title}</h3>
              <p className={`text-[11px] font-bold uppercase tracking-widest mb-5 z-10 ${gym.featured ? "text-[#E8A820]" : "text-pink-400"}`}>
                {gym.subtitle}
              </p>

              <div className={`w-8 h-[1.5px] mb-5 rounded-full z-10 transition-all duration-300 group-hover:w-16 ${gym.featured ? "bg-[#E8A820]" : "bg-pink-500/40"}`} />

              <p className="text-white/45 text-[0.875rem] leading-relaxed mb-6 flex-1 z-10">{gym.desc}</p>

              {/* Features */}
              <ul className="space-y-2 mb-7 z-10">
                {gym.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2.5 text-[0.85rem] text-white/60 transition-colors duration-300 group-hover:text-white/80">
                    <Check size={13} className={gym.featured ? "text-[#E8A820]" : "text-pink-400"} strokeWidth={3} />
                    {f}
                  </li>
                ))}
              </ul>

              {/* Price */}
              <div className={`mb-5 px-5 py-3.5 rounded-xl border text-white font-black text-[1.05rem] z-10 transition-all duration-300 ${
                gym.featured
                  ? "bg-[#E8A820]/[0.05] border-[#E8A820]/15 group-hover:bg-[#E8A820]/[0.10] group-hover:border-[#E8A820]/30"
                  : "bg-pink-500/[0.04] border-pink-500/15 group-hover:bg-pink-500/[0.08] group-hover:border-pink-500/30"
              }`}>
                {gym.price}
              </div>

              {/* CTA */}
              <button
                onClick={() => { sessionStorage.setItem("scroll_before_plans", String(window.scrollY)); navigate(gym.href); }}
                className={`w-full flex items-center justify-center gap-2 font-bold text-[13px] h-[52px] rounded-xl transition-all duration-300 z-10 ${
                  gym.featured
                    ? "btn-gold group-hover:shadow-[0_10px_25px_rgba(232,168,32,0.25)]"
                    : "text-white font-bold hover:-translate-y-0.5 group-hover:shadow-[0_10px_25px_rgba(236,72,153,0.25)]"
                }`}
                style={!gym.featured ? {
                  background: "linear-gradient(135deg, #ec4899, #db2777)",
                  boxShadow: "0 4px 20px rgba(236,72,153,0.25)",
                } : undefined}
              >
                View all plans <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
