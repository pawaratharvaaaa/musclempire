import { motion } from "framer-motion";

export default function CTA() {
  const goto = (href: string) => {
    const el = document.querySelector(href);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 76, behavior: "smooth" });
  };

  return (
    <section className="relative py-32 bg-[#1C1C1E] overflow-hidden">

      {/* Animated radial glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(255,193,7,0.11) 0%, transparent 68%)" }}
        animate={{ scale: [1, 1.14, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Fine grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.022]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto"
        >
          {/* Eyebrow pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E8A820]/[0.08] border border-[#E8A820]/18 text-[#E8A820] text-[10.5px] font-bold uppercase tracking-[0.18em] mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8A820] animate-pulse" />
            Your transformation starts today
          </div>

          <h2 className="font-display font-black text-white text-[clamp(2.6rem,7.5vw,5rem)] leading-[1.06] tracking-tight mb-5">
            Enough{" "}
            <span className="text-gold-gradient">excuses.</span>
          </h2>

          <p className="text-white/50 text-[1.1rem] leading-relaxed max-w-xl mx-auto mb-11">
            The iron is waiting. The community is here. The only thing missing is your commitment.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => goto("#contact")}
              className="btn-gold w-full sm:w-auto text-[14.5px] px-10 py-[15px]"
            >
              Join the empire
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => goto("#pricing")}
              className="btn-ghost-dark w-full sm:w-auto text-[14.5px] px-10 py-[15px]"
            >
              View pricing
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
