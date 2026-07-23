import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Trophy, Clock, Target, Users2, Activity } from "lucide-react";

const STEPS = [
  { Icon: Trophy,       title: "Expert trainers",    desc: "Certified coaches with years of competitive experience who push you past every limit.",          iconColor: "#F9A825", glow: "rgba(249,168,37,.22)", bg: "rgba(249,168,37,.09)" },
  { Icon: Target,       title: "Personalised plans", desc: "No cookie-cutter routines. Every programme is designed around your unique body and goals.",       iconColor: "#4ADE80", glow: "rgba(74,222,128,.20)",  bg: "rgba(74,222,128,.09)" },
  { Icon: Activity,     title: "Modern equipment",   desc: "Top-tier machines and an extensive free-weight range — everything you need.",                     iconColor: "#60A5FA", glow: "rgba(96,165,250,.20)",  bg: "rgba(96,165,250,.09)" },
  { Icon: Users2,       title: "Strong community",   desc: "Train alongside driven people who share your relentless pursuit of progress.",                    iconColor: "#C084FC", glow: "rgba(192,132,252,.20)", bg: "rgba(192,132,252,.09)"},
  { Icon: Clock,        title: "Flexible timings",   desc: "Open 6 AM to 10 PM — your schedule is never an excuse to skip a session.",                       iconColor: "#F87171", glow: "rgba(248,113,113,.20)", bg: "rgba(248,113,113,.09)"},
  { Icon: CheckCircle2, title: "Pro assessment",     desc: "Full body composition and movement analysis before day one.",                                     iconColor: "#34D399", glow: "rgba(52,211,153,.20)",  bg: "rgba(52,211,153,.09)" },
];
const N = STEPS.length;

/* ── Card ───────────────────────────────────────────────────── */
function Card({ step }: { step: typeof STEPS[0] }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative rounded-[20px] flex flex-col p-7 overflow-hidden cursor-default"
      style={{
        background: `radial-gradient(circle at 35% 30%, ${hovered ? step.glow : "transparent"} 0%, transparent 60%), #ffffff`,
        border: `1.5px solid ${hovered ? step.iconColor + "60" : "rgba(0,0,0,0.08)"}`,
        boxShadow: hovered ? `0 16px 48px rgba(0,0,0,.10), 0 0 40px ${step.glow}` : "0 2px 12px rgba(0,0,0,.06)",
        transition: "border-color .3s, box-shadow .3s, background .3s",
        minHeight: 200,
      }}
    >
      <div className="absolute top-0 left-[18%] right-[18%] h-px pointer-events-none"
        style={{ background: `linear-gradient(90deg,transparent,${step.iconColor},transparent)`, opacity: hovered ? 0.65 : 0.2, transition:"opacity .3s" }} />
      <div className="absolute bottom-4 right-4 pointer-events-none" style={{ color: step.iconColor, opacity: hovered ? 0.12 : 0.05, transition:"opacity .3s" }}>
        <step.Icon size={90} strokeWidth={0.7} />
      </div>
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 shrink-0 z-10"
        style={{ background: step.bg, color: step.iconColor, boxShadow: hovered ? `0 0 20px ${step.iconColor}44` : "none", transition:"box-shadow .3s" }}>
        <step.Icon size={24} strokeWidth={2} />
      </div>
      <h3 className="font-display font-black text-[1.1rem] leading-snug mb-2 z-10 relative"
        style={{ color: hovered ? step.iconColor : "#1C1C1E", transition:"color .3s" }}>
        {step.title}
      </h3>
      <p className="text-black/45 text-[0.82rem] leading-relaxed z-10">{step.desc}</p>
    </motion.div>
  );
}

/* ── Mobile auto-scroll carousel (no touch interference) ────── */
function MobileCarousel() {
  const [active, setActive] = useState(0);
  const autoRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    autoRef.current = setInterval(() => setActive(a => (a + 1) % N), 2800);
    return () => clearInterval(autoRef.current);
  }, []);

  const s = STEPS[active];

  return (
    <div className="flex flex-col items-center gap-5">
      {/* card */}
      <div className="relative w-full" style={{ height: 220 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div
              className="rounded-[20px] flex flex-col p-6 overflow-hidden relative w-full"
              style={{
                background: `radial-gradient(circle at 35% 30%, ${s.glow} 0%, transparent 60%), #ffffff`,
                border: `1.5px solid ${s.iconColor}55`,
                boxShadow: `0 8px 32px rgba(0,0,0,.10), 0 0 36px ${s.glow}`,
                minHeight: 200,
              }}
            >
              <div className="absolute top-0 left-[18%] right-[18%] h-px pointer-events-none"
                style={{ background: `linear-gradient(90deg,transparent,${s.iconColor},transparent)` }} />
              <div className="absolute bottom-3 right-3 pointer-events-none" style={{ color: s.iconColor, opacity: 0.1 }}>
                <s.Icon size={80} strokeWidth={0.7} />
              </div>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 shrink-0 z-10"
                style={{ background: s.bg, color: s.iconColor }}>
                <s.Icon size={22} strokeWidth={2} />
              </div>
              <h3 className="font-display font-black text-[1.05rem] leading-snug mb-1 z-10" style={{ color: s.iconColor }}>
                {s.title}
              </h3>
              <p className="text-black/45 text-[0.82rem] leading-relaxed z-10">{s.desc}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* dots — no interaction needed */}
      <div className="flex gap-2">
        {STEPS.map((step, i) => (
          <div key={i} className="rounded-full transition-all duration-300"
            style={{ width: i === active ? 22 : 7, height: 7,
              background: i === active ? step.iconColor : "rgba(255,255,255,.2)" }} />
        ))}
      </div>
    </div>
  );
}

/* ── Section ─────────────────────────────────────────────────── */
export default function WhyChooseUs() {
  return (
    <section id="why-us" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 55% at 50% 50%, rgba(232,168,32,.05) 0%, transparent 70%)" }} />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-black/[0.06] to-transparent" />

      <div className="max-w-7xl mx-auto px-5 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-xl mx-auto mb-14"
        >
          <div className="eyebrow justify-center mb-4">The Empire standard</div>
          <h2 className="font-display font-black text-[#1C1C1E] text-[clamp(2rem,4.5vw,2.9rem)]">
            Why train <span className="text-gold-gradient">with us?</span>
          </h2>
        </motion.div>

        {/* Desktop: 3×2 grid */}
        <div className="hidden md:grid grid-cols-3 gap-5">
          {STEPS.map((step, i) => (
            <motion.div key={i} transition={{ delay: i * 0.07 }}>
              <Card step={step} />
            </motion.div>
          ))}
        </div>

        {/* Mobile: auto-scroll carousel */}
        <div className="md:hidden">
          <MobileCarousel />
        </div>
      </div>
    </section>
  );
}
