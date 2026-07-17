import { Star } from "lucide-react";
import { motion } from "framer-motion";

const reviews = [
  { name: "Atharva Sawant",      role: "Gym member",          rating: 5, text: "Muscle Empire in Ghatkopar is an absolute gem! Well-equipped with top-notch machinery. Big shoutout to trainers Rohit Yadav and Pankaj Nikam — incredibly knowledgeable and supportive." },
  { name: "Pawan Kale",          role: "Gym member",          rating: 5, text: "Fantastic experience! Facilities are clean, staff is friendly. Specially Pankaj and Rohit — knowledgeable trainers with a variety of equipment for all fitness levels." },
  { name: "Ujvala Pokharkar",    role: "Gym member",          rating: 5, text: "Really good place with great trainers. Good rack of weights and equipment. If you are serious about your fitness goals, I highly recommend this gym." },
  { name: "Bhagyashree Birmole", role: "Ladies gym member",   rating: 5, text: "Muscle Empire ladies gym is perfect — amazing facilities. Tejal ma'am and Bhavesh sir are very helpful and always encourage everyone to stay consistent." },
  { name: "Pratik Shetty",       role: "Gym member",          rating: 5, text: "Excellent gym! Great equipment, supportive trainers, and a motivating environment. Highly recommended for anyone serious about fitness." },
  { name: "Ankita Borhde",       role: "Ladies gym member",   rating: 5, text: "Muscle Empire ladies gym is perfect. Tejal ma'am and Bhavesh sir are very helpful and provide proper guidance. Highly recommend!" },
  { name: "Pravin Chavan",       role: "Member, age 41",      rating: 5, text: "Great place to work out! The trainers ensure discipline — that's the biggest plus point. I've been here for years and plan to continue for at least 10 more." },
  { name: "Aakansha Shinde",     role: "Ladies gym member",   rating: 5, text: "One of the finest gyms I've ever found. Ms. Tejal and Mr. Bhavesh are well-trained with ample knowledge. Almost a year in and I'm loving every session." },
  { name: "Aakanksha Bhor",      role: "Ladies gym member",   rating: 5, text: "Excellent place. Clean and great environment. Tejal Mam (Tai) is such a humble person — always there to motivate and push you forward." },
  { name: "Trupti Vali",         role: "Ladies gym member",   rating: 5, text: "Best gym and trainers. They always give you attention, correct your form, and keep you motivated. Tejal mam is genuinely inspiring." },
  { name: "Ravi Auti",           role: "Gym member",          rating: 5, text: "Perfect gym with multiple facilities — workout training, proper diet plans, yearly membership offers. Trainers are very helpful throughout." },
  { name: "Aniket Joshi",        role: "Gym member",          rating: 5, text: "Gym is great for health and body gain. Best gym trainers available in the area. I recommend Muscle Empire to everyone." },
  { name: "Krushna Borhade",     role: "Gym member",          rating: 5, text: "I have seen real progress in my body since I joined. It is all thanks to the trainers who are absolutely amazing and genuinely care." },
  { name: "Dipti Karbele",       role: "Ladies gym member",   rating: 5, text: "Amazing gym. Graceful environment, good service with friendly trainers and a clean, comfortable ladies gym for all." },
  { name: "Bhagyashri More",     role: "Gym member",          rating: 5, text: "Amazing facility! Trainers are super nice and take a personal interest in you no matter what fitness level you're at." },
  { name: "Ritika Kamble",       role: "Ladies gym member",   rating: 5, text: "The best gym! The knowledgeable trainers — Tai and Bhavesh dada — combined with quality equipment make every workout a success." },
  { name: "Smit Salunke",        role: "Gym member",          rating: 5, text: "Best gym for hardcore and passionate workout in Bhatwadi, Ghatkopar — with a very kind, supportive owner and excellent trainers." },
  { name: "Hrishikesh Lodhi",    role: "Gym member",          rating: 5, text: "Excellent gym. Well maintained. Trainers are very supportive and always ready to help you improve and push your limits." },
  { name: "Devarsh Kanaskar",    role: "Gym member",          rating: 5, text: "A great place to achieve your fitness goals with professional support! Excellent staff and a consistently friendly environment." },
  { name: "Ashlyn Fernandes",    role: "Gym member",          rating: 5, text: "Well maintained gym with professional trainers. Especially Pankaj — genuinely the best personal trainer I've had." },
  { name: "Siddhesh Salunke",    role: "Gym member",          rating: 5, text: "Awesome gym! Supportive trainers who are always there to push you to your limits and keep you accountable." },
  { name: "Saurabh Khilari",     role: "Gym member",          rating: 5, text: "Excellent environment, professionalism and well-equipped gym. Really happy with my membership here — worth every rupee." },
  { name: "Rahul Rokade",        role: "Gym member",          rating: 5, text: "Excellent staff and friendly environment. Always a pleasure to work out at Muscle Empire — the vibe is unmatched." },
  { name: "Haresh Maskar",       role: "Gym member",          rating: 5, text: "Excellent environment, professionalism and well-equipped gym. One of the genuinely best gyms in the entire area." },
  { name: "DP Pictures",         role: "Gym member",          rating: 5, text: "Muscle Empire Gymnasium is a great place for whoever is looking to achieve their fitness goals. Highly recommended!" },
  { name: "Google TV Account",   role: "Gym member",          rating: 4, text: "Decent gym with good facilities. This review is for the Bhatwadi gym (men's). Overall a solid, well-maintained place to train." },
];

const PALETTE = ["#92400E","#B45309","#C2410C","#991B1B","#1E40AF","#6D28D9","#0F766E","#065F46","#831843"];
const avatarBg   = (n: string) => PALETTE[n.charCodeAt(0) % PALETTE.length];
const avatarText = (n: string) => n.split(" ").slice(0,2).map(w => w[0]).join("").toUpperCase();

function Card({ r }: { r: typeof reviews[0] }) {
  return (
    <div className="bg-white border border-black/[0.08] rounded-2xl p-5 mb-4 shadow-[0_2px_12px_rgba(0,0,0,0.06)] w-full">
      <div className="flex gap-0.5 mb-3">
        {Array.from({ length: 5 }, (_, i) => (
          <Star key={i} size={11}
            className={i < r.rating ? "fill-[#E8A820] text-[#E8A820]" : "fill-[#E5E7EB] text-[#E5E7EB]"} />
        ))}
      </div>
      <p className="text-[#444] text-[0.82rem] leading-relaxed mb-4">"{r.text}"</p>
      <div className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-[10px] shrink-0"
          style={{ background: avatarBg(r.name) }}
        >
          {avatarText(r.name)}
        </div>
        <div>
          <p className="text-[#1C1C1E] font-semibold text-[0.78rem] leading-tight">{r.name}</p>
          <p className="text-[#aaa] text-[0.7rem]">{r.role}</p>
        </div>
      </div>
    </div>
  );
}

function Column({ items, duration }: { items: typeof reviews; duration: number }) {
  const doubled = [...items, ...items];
  return (
    <div className="flex-1 overflow-hidden" style={{ height: 560 }}>
      <motion.div
        animate={{ y: ["0%", "-50%"] }}
        transition={{ duration, repeat: Infinity, ease: "linear", repeatType: "loop" }}
      >
        {doubled.map((r, i) => <Card key={i} r={r} />)}
      </motion.div>
    </div>
  );
}

function splitCols(arr: typeof reviews, n: number) {
  const out: (typeof reviews)[] = Array.from({ length: n }, () => []);
  arr.forEach((r, i) => out[i % n].push(r));
  return out;
}

export default function Testimonials() {
  const cols4 = splitCols(reviews, 4);
  const cols3 = splitCols(reviews, 3);
  const cols2 = splitCols(reviews, 2);

  return (
    <section id="reviews" className="relative bg-[#F0EEE9] overflow-hidden">

      {/* ── scrolling wall ── */}
      <div className="relative">

        {/* 4 col desktop */}
        <div className="hidden lg:flex gap-4 px-6 xl:px-10 pt-6 pb-6">
          {cols4.map((col, i) => (
            <Column key={i} items={col} duration={[30, 38, 25, 34][i]} />
          ))}
        </div>

        {/* 3 col tablet */}
        <div className="hidden md:flex lg:hidden gap-4 px-4 pt-6 pb-6">
          {cols3.map((col, i) => (
            <Column key={i} items={col} duration={[30, 38, 25][i]} />
          ))}
        </div>

        {/* 2 col mobile */}
        <div className="flex md:hidden gap-3 px-3 pt-4 pb-4">
          {cols2.map((col, i) => (
            <Column key={i} items={col} duration={[28, 36][i]} />
          ))}
        </div>

        {/* top fade */}
        <div className="absolute top-0 inset-x-0 h-28 pointer-events-none z-10
                        bg-gradient-to-b from-[#F0EEE9] to-transparent" />

        {/* bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-28 pointer-events-none z-10
                        bg-gradient-to-t from-[#F0EEE9] to-transparent" />

        {/* CENTER HORIZONTAL BAND — white-ish wash so text reads clearly over cards */}
        <div
          className="absolute inset-x-0 z-10 pointer-events-none"
          style={{
            top: "50%",
            transform: "translateY(-50%)",
            height: "200px",
            background: "linear-gradient(to bottom, transparent, rgba(240,238,233,0.88) 30%, rgba(240,238,233,0.88) 70%, transparent)",
          }}
        />

        {/* CENTERED HEADLINE — sits on top of the wash */}
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-center pointer-events-auto"
          >
            <h2
              className="font-display font-black text-[#1C1C1E] leading-tight inline-block"
              style={{ 
                fontSize: "clamp(1.8rem, 4vw, 3rem)",
                transform: "scaleX(1.5)",
                transformOrigin: "center"
              }}
            >
              Trusted by{" "}
              <span style={{
                background: "linear-gradient(135deg,#E8A820,#FF9500)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                10k+ members
              </span>
            </h2>
          </motion.div>
        </div>

      </div>

      {/* ── bottom CTA bar (outside the wall, clean) ── */}
      <div className="flex items-center justify-center gap-4 pb-12 flex-col">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} size={20} className="fill-[#E8A820] text-[#E8A820]" />
          ))}
          <span className="ml-2 font-black text-[#1C1C1E] text-lg">5.0</span>
          <span className="ml-1 text-[#888] text-sm">({reviews.length} reviews)</span>
        </div>

        <motion.a
          href="https://share.google/JxC3WJxV6YViUdr2n"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-2 bg-[#E8A820] hover:bg-[#d49518]
                     text-[#1C1C1E] font-bold text-[13px] px-7 py-3 rounded-xl
                     shadow-[0_4px_20px_rgba(255,193,7,0.38)]
                     hover:shadow-[0_6px_28px_rgba(255,193,7,0.55)]
                     transition-all duration-200"
        >
          <Star size={13} className="fill-black text-[#1C1C1E]" />
          Review us on Google
        </motion.a>
      </div>

    </section>
  );
}
