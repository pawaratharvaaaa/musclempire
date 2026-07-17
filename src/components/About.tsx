import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Mountain } from "lucide-react";
import aboutImg from "@/assets/images/about-img.png";
import ScrollStack, { ScrollStackItem } from "@/components/ui/ScrollStack";

/* ────────────────────────────────────────────────────────────────
   DATA
   ──────────────────────────────────────────────────────────────── */

interface MedalItem {
  label: string;
  title: string;
  subtitle: string;
  glow: "gold" | "silver" | "bronze";
  emoji: string;
  yearLabel?: string;
}

interface TimelineEntry {
  year: string;
  badge: { text: string; color: "gold" | "accent" | "bronze" | "neutral" };
  narrative: string;
  medals: MedalItem[];
  yearTags?: string[];
  gridCols?: string;
}

const entries: TimelineEntry[] = [
  {
    year: "2011",
    badge: { text: "Junior Category", color: "gold" },
    narrative:
      "The debut season. First time stepping on a state platform — and first time leaving with a triple crown. The bar had been set.",
    medals: [
      { label: "Mumbai Shree", title: "Overall", subtitle: "Champion", glow: "gold", emoji: "🥇" },
      { label: "Maharashtra Kishor", title: "Gold", subtitle: "State Medal", glow: "gold", emoji: "🥇" },
      { label: "Bharat Kishor", title: "Gold", subtitle: "National Medal", glow: "gold", emoji: "🥇" },
    ],
  },
  {
    year: "2012 — 2016",
    badge: { text: "Junior · Kumar", color: "gold" },
    narrative:
      "Four years of unbroken dominance in the Kumar division. Three cities, one result — Overall Champion at Mumbai, Gold at State, Gold at Nationals. Repeat.",
    medals: [
      { label: "Mumbai Kumar", title: "Overall", subtitle: "Champion ×4", glow: "gold", emoji: "🥇" },
      { label: "Maharashtra Kumar", title: "Gold", subtitle: "State ×4", glow: "gold", emoji: "🥇" },
      { label: "Bharat Kumar", title: "Gold", subtitle: "National ×4", glow: "gold", emoji: "🥇" },
    ],
    yearTags: ["'12", "'13", "'14", "'16"],
  },
  {
    year: "2017",
    badge: { text: "Senior Division · Debut", color: "accent" },
    narrative:
      "The jump to Seniors. New weight class, new opponents, same outcome — a clean sweep at city, state and national level in the first senior outing.",
    medals: [
      { label: "Mumbai Shree", title: "Overall", subtitle: "Champion", glow: "gold", emoji: "🥇" },
      { label: "Maharashtra Shree", title: "Gold", subtitle: "State Medal", glow: "gold", emoji: "🥇" },
      { label: "Bharat Shree", title: "Gold", subtitle: "National Medal", glow: "gold", emoji: "🥇" },
    ],
  },
  {
    year: "Mumbai University",
    badge: { text: "Inter-University Circuit", color: "neutral" },
    narrative:
      "Representing the home university across four seasons — two golds, two silvers, and a ticket to the All-India Inter-University stage.",
    gridCols: "grid-cols-2 sm:grid-cols-4",
    medals: [
      { yearLabel: "2012 — 13", title: "Silver", subtitle: "", glow: "silver", emoji: "🥈", label: "" },
      { yearLabel: "2013 — 14", title: "Gold", subtitle: "", glow: "gold", emoji: "🥇", label: "" },
      { yearLabel: "2015 — 16", title: "Gold", subtitle: "", glow: "gold", emoji: "🥇", label: "" },
      { yearLabel: "2016 — 17", title: "Silver", subtitle: "", glow: "silver", emoji: "🥈", label: "" },
    ],
  },
  {
    year: "All India University (AIU)",
    badge: { text: "National Inter-University · AIU", color: "bronze" },
    narrative:
      "Wearing the Mumbai University colors on the national stage — first as a representative, then returning with a podium finish.",
    gridCols: "sm:grid-cols-2",
    medals: [
      { yearLabel: "2013 — 14", title: "Represented", subtitle: "Mumbai University · National Camp", glow: "gold", emoji: "", label: "icon" },
      { yearLabel: "2015 — 16", title: "Bronze", subtitle: "All India Inter-University", glow: "bronze", emoji: "🥉", label: "" },
    ],
  },
];

const federations = [
  { tier: "01", scope: "City", name: "Mumbai", description: "Kishor · Kumar · Shree divisions — Overall Champion across all three age categories." },
  { tier: "02", scope: "State", name: "Maharashtra", description: "Gold medalist at every state championship entered, junior through senior." },
  { tier: "03", scope: "Nation", name: "Bharat", description: "National gold in Kishor, Kumar and Shree — plus AIU bronze representing Mumbai University." },
];

/* ────────────────────────────────────────────────────────────────
   HELPERS
   ──────────────────────────────────────────────────────────────── */

const badgeColors: Record<string, string> = {
  gold: "text-[var(--gold)]/80 border-[var(--gold)]/20 bg-[var(--gold)]/5",
  accent: "text-[#ff5a1f] border-[#ff5a1f]/30 bg-[#ff5a1f]/5",
  bronze: "text-[#c08056] border-[#c08056]/30 bg-[#c08056]/5",
  neutral: "text-neutral-300 border-white/15 bg-white/5",
};

const subtitleColor = (g: string) => (g === "gold" ? "text-[var(--gold)]" : "text-neutral-400");

/* ────────────────────────────────────────────────────────────────
   FADE-UP WRAPPER
   ──────────────────────────────────────────────────────────────── */

function FadeUp({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : "translateY(20px)",
        transition: "opacity .8s ease, transform .8s cubic-bezier(.2,.7,.2,1)",
      }}
    >
      {children}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   MEDAL CHIP
   ──────────────────────────────────────────────────────────────── */

function MedalChip({ m, compact }: { m: MedalItem; compact?: boolean }) {
  const isIcon = m.label === "icon";
  const glowCls = `glow-${m.glow}`;

  if (compact) {
    return (
      <div className="hover-card medal-chip rounded-xl p-4">
        {m.yearLabel && <div className="text-[11px] font-mono text-neutral-500 mb-2">{m.yearLabel}</div>}
        <div className="flex items-center gap-2">
          <span className={`h-6 w-6 rounded-full ${glowCls} grid place-items-center text-[10px] font-bold text-black`}>{m.emoji}</span>
          <span className="font-anton text-xl text-white">{m.title}</span>
        </div>
      </div>
    );
  }

  if (isIcon) {
    return (
      <div className="hover-card medal-chip rounded-xl p-5">
        {m.yearLabel && <div className="text-[11px] font-mono text-neutral-500 mb-2">{m.yearLabel}</div>}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full grid place-items-center border border-white/15 bg-white/5">
            <Mountain size={18} className="text-[var(--gold)]" />
          </div>
          <div>
            <div className="font-anton text-2xl text-white leading-none">{m.title}</div>
            {m.subtitle && <div className="text-sm text-neutral-400">{m.subtitle}</div>}
          </div>
        </div>
      </div>
    );
  }

  if (m.yearLabel) {
    return (
      <div className="hover-card medal-chip rounded-xl p-5">
        <div className="text-[11px] font-mono text-neutral-500 mb-2">{m.yearLabel}</div>
        <div className="flex items-center gap-3">
          <span className={`h-10 w-10 rounded-full ${glowCls} grid place-items-center text-sm`}>{m.emoji}</span>
          <div>
            <div className="font-anton text-2xl text-white leading-none">{m.title}</div>
            {m.subtitle && <div className="text-sm text-neutral-400">{m.subtitle}</div>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hover-card medal-chip rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className={`h-7 w-7 rounded-full ${glowCls} grid place-items-center text-[10px] font-bold text-black`}>{m.emoji}</span>
        <span className="text-[11px] uppercase tracking-widest text-neutral-500">{m.label}</span>
      </div>
      <div className="font-anton text-2xl text-white">{m.title}</div>
      <div className={`text-sm ${subtitleColor(m.glow)}`}>{m.subtitle}</div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   TIMELINE CARD (for ScrollStack)
   ──────────────────────────────────────────────────────────────── */

function TimelineCard({ e }: { e: TimelineEntry }) {
  const isCompact = !!e.gridCols && e.gridCols.includes("grid-cols-2");

  return (
    <div className="p-6 sm:p-8 md:p-10" style={{ background: "var(--sec-dark-mid)" }}>
      {/* Year + badge */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <h3 className="font-anton text-3xl sm:text-4xl md:text-5xl text-[var(--gold)] leading-none tracking-wide">
          {e.year}
        </h3>
        <span className={`inline-block text-[11px] uppercase tracking-[0.25em] px-2.5 py-1 rounded-full border ${badgeColors[e.badge.color]}`}>
          {e.badge.text}
        </span>
      </div>

      {/* Narrative */}
      <p className="text-neutral-300 text-sm md:text-base mb-6 max-w-2xl leading-relaxed">
        {e.narrative}
      </p>

      {/* Medal grid */}
      <div className={`grid gap-3 ${e.gridCols ?? "sm:grid-cols-3"}`}>
        {e.medals.map((m, j) => (
          <MedalChip key={j} m={m} compact={isCompact && !m.label} />
        ))}
      </div>

      {/* Year tags */}
      {e.yearTags && (
        <div className="flex flex-wrap gap-2 mt-4">
          {e.yearTags.map((t) => (
            <span key={t} className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-neutral-300">
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   MAIN COMPONENT
   ──────────────────────────────────────────────────────────────── */

export default function About() {
  return (
    <section id="about" className="relative overflow-hidden" style={{ background: "var(--sec-dark-mid)" }}>
      {/* Ambient backgrounds */}
      <div className="absolute inset-0 -z-0 grain pointer-events-none" />
      <div
        className="absolute -z-0 top-[-10%] left-1/2 -translate-x-1/2 w-[80vw] h-[60vh] rounded-full blur-[140px] opacity-[0.12] pointer-events-none"
        style={{ background: "radial-gradient(circle, #ff5a1f 0%, transparent 70%)" }}
      />
      <div
        className="absolute -z-0 bottom-[-20%] right-[-10%] w-[60vw] h-[50vh] rounded-full blur-[140px] opacity-[0.08] pointer-events-none"
        style={{ background: "radial-gradient(circle, var(--gold) 0%, transparent 70%)" }}
      />

      {/* ── Intro row: photo + heading ────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 pt-24 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="relative rounded-[22px] overflow-hidden group shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
              <div className="absolute inset-0 bg-[var(--gold)]/10 mix-blend-overlay z-10 group-hover:opacity-0 transition-opacity duration-600" />
              <img
                src={aboutImg}
                alt="Sagar Kharat — champion athlete and founder"
                className="w-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 scale-[1.02] group-hover:scale-100"
              />
              <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-black/55 to-transparent z-20" />
            </div>

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="absolute -bottom-5 right-6 z-30 bg-[var(--gold)] text-[#1C1C1E] rounded-2xl px-6 py-4 shadow-[0_12px_36px_rgba(232,168,32,0.45)]"
            >
              <p className="text-3xl font-black leading-none font-display">21+</p>
              <p className="text-[10px] font-bold uppercase tracking-wider mt-0.5 text-[#1C1C1E]/65 leading-snug">
                National &amp;<br />state medals
              </p>
            </motion.div>
          </motion.div>

          {/* Heading text */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="pt-2 lg:pt-8"
          >
            <div className="eyebrow mb-4">Hall of fame</div>
            <h2 className="font-display font-black text-foreground text-[clamp(2rem,4.5vw,2.8rem)] mb-6">
              Champion's <span className="text-gold-gradient">timeline</span>
            </h2>
            <p className="text-neutral-400 text-sm md:text-base max-w-lg leading-relaxed">
              From junior debuts to senior domination — every medal earned across city, state and national stages over a decade of competition.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── ScrollStack Timeline ──────────────────────── */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 md:px-10">
        <div className="flex items-center justify-between mb-8 md:mb-10">
          <h2 className="font-anton text-2xl sm:text-3xl md:text-5xl tracking-wide text-foreground">
            The Record
          </h2>
          <div className="text-xs uppercase tracking-[0.25em] text-neutral-500 hidden md:block">
            Scroll to stack →
          </div>
        </div>

        <ScrollStack
          useWindowScroll
          itemDistance={80}
          itemScale={0.04}
          itemStackDistance={35}
          stackPosition="25%"
          scaleEndPosition="15%"
          baseScale={0.88}
          scaleDuration={0.5}
          blurAmount={2}
        >
          {entries.map((e, i) => (
            <ScrollStackItem key={i} itemClassName="medal-chip tl-card-shadow !rounded-2xl">
              <TimelineCard e={e} />
            </ScrollStackItem>
          ))}

          {/* Closing card */}
          <ScrollStackItem itemClassName="medal-chip tl-card-shadow !rounded-2xl">
            <div className="p-6 sm:p-8 md:p-10" style={{ background: "var(--sec-dark-mid)" }}>
              <h3 className="font-anton text-3xl sm:text-4xl md:text-5xl text-neutral-600 leading-none tracking-wide mb-4">
                Today
              </h3>
              <p className="text-neutral-400 text-sm md:text-base leading-relaxed max-w-2xl">
                The competing years closed. The coaching years began. Every athlete now trained
                inside these walls inherits the standard that those 21 medals set.
              </p>
              <a
                href="#pricing"
                className="inline-flex mt-6 items-center gap-2 text-sm font-medium text-[var(--gold)] hover:text-white transition group"
              >
                Train under this standard
                <span className="transition group-hover:translate-x-1">→</span>
              </a>
            </div>
          </ScrollStackItem>
        </ScrollStack>
      </div>

      {/* ── Federation Legend ─────────────────────────── */}
      <FadeUp className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-10 pb-16 md:pb-20">
        <div className="tl-divider mb-12" />

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6 mb-6 md:mb-8">
          <h2 className="font-anton text-2xl sm:text-3xl md:text-4xl text-foreground">
            Federations contested
          </h2>
          <p className="text-neutral-500 text-sm max-w-md">
            Three tiers of bodybuilding &amp; strength sport, climbed in sequence.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {federations.map((f) => (
            <div key={f.tier} className="medal-chip rounded-2xl p-6 tl-card-shadow">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] uppercase tracking-[0.25em] text-neutral-500">Tier {f.tier}</span>
                <span className="text-[var(--gold)] font-anton text-2xl">{f.scope}</span>
              </div>
              <div className="font-anton text-3xl text-white mb-1">{f.name}</div>
              <div className="text-sm text-neutral-400">{f.description}</div>
            </div>
          ))}
        </div>
      </FadeUp>
    </section>
  );
}
