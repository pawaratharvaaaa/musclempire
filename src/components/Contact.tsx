import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, MapPin, Mail, CheckCircle2, Clock } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { APPS_SCRIPT_URL } from "@/lib/sheets";

const OWNER_PHONE = "919773053632";

const goals = [
  { value: "full_body",   label: "Full body workout" },
  { value: "weight_gain", label: "Weight gain" },
  { value: "weight_loss", label: "Weight loss" },
  { value: "muscle_gain", label: "Muscle gain" },
  { value: "cardio",      label: "Cardio" },
];

const contactItems = [
  { Icon: FaWhatsapp, label: "WhatsApp",           value: "+91 97730 53632",                        href: `https://wa.me/${OWNER_PHONE}`,                                        cta: "Chat now",     bg: "#25D366" },
  { Icon: Phone,      label: "Call us",             value: "+91 97730 53632",                        href: "tel:+919773053632",                                                    cta: "Call now",     bg: "#E8A820" },
  { Icon: Phone,      label: "Office",              value: "+91 97022 68603",                        href: "tel:+919702268603",                                                    cta: "Call now",     bg: "#E8A820" },
  { Icon: MapPin,     label: "Unisex gym",          value: "J/16, Jay Hanuman Mandir, Barvenagar Colony, Bhatwadi, Ghatkopar (West), Mumbai – 400084",   href: "https://maps.google.com/?q=Muscle+Empire+Gymnasium+Ghatkopar+West+Mumbai", cta: "Directions",   bg: "#EF4444" },
  { Icon: MapPin,     label: "Female gym",          value: "1st Floor, Ranveer Apartment, Sanjay Kokate Lane, Bhatwadi, Ghatkopar (West), Mumbai – 400084", href: "https://maps.google.com/?q=Ranveer+Apartment+Sanjay+Kokate+Lane+Bhatwadi+Ghatkopar+West+Mumbai", cta: "Directions", bg: "#EF4444" },
  { Icon: Mail,       label: "Email",               value: "musclempire616@gmail.com",               href: "mailto:musclempire616@gmail.com",                                      cta: "Send mail",    bg: "#6366F1" },
];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", age: "", requirement: "", phone: "", notes: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [timeoutId, setTimeoutId] = useState<number | null>(null);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [timeoutId]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim() || form.name.trim().length < 2) e.name = "Name must be at least 2 characters.";
    if (!form.age || isNaN(+form.age) || +form.age < 10 || +form.age > 90) e.age = "Enter a valid age between 10 and 90.";
    if (!form.requirement) e.requirement = "Please select your goal.";
    if (!form.phone.trim() || !/^\+?[0-9]{10,13}$/.test(form.phone.replace(/\s/g, ""))) e.phone = "Enter a valid phone number (10–13 digits).";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    const label = goals.find(g => g.value === form.requirement)?.label || form.requirement;
    const today = new Date().toLocaleDateString("en-IN");
    
    // Submit to Apps Script URL
    fetch(`${APPS_SCRIPT_URL}?${new URLSearchParams({ action: "enquiry", date: today, name: form.name, phone: form.phone, age: form.age, goal: label, notes: form.notes })}`, { redirect: "follow" }).catch(() => null);
    
    const msg = encodeURIComponent(`Hi! I'd like to join Muscle Empire.\n\n*Name:* ${form.name}\n*Age:* ${form.age}\n*Goal:* ${label}\n*Phone:* ${form.phone}${form.notes ? `\n*Notes:* ${form.notes}` : ""}`);
    
    // Open WhatsApp
    window.open(`https://wa.me/${OWNER_PHONE}?text=${msg}`, "_blank");
    
    setSubmitted(true);
    
    // Auto reset after 5 seconds
    const id = window.setTimeout(() => {
      handleReset();
    }, 5000);
    setTimeoutId(id);
  };

  const handleReset = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setSubmitted(false);
    setForm({ name: "", age: "", requirement: "", phone: "", notes: "" });
    setErrors({});
  };

  const getInputClass = (fieldName: keyof typeof form, value: string) => {
    const base = "input-premium w-full transition-all duration-200 focus:outline-none";
    if (errors[fieldName]) {
      return `${base} border-red-500 ring-2 ring-red-500/10 focus:border-red-500 focus:ring-red-500/20`;
    }
    if (value && !errors[fieldName]) {
      return `${base} border-green-500/30 bg-green-500/[0.005] focus:border-green-500 focus:ring-green-500/10`;
    }
    return base;
  };

  const errMsg = "text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1.5";

  return (
    <section id="contact" className="py-28 bg-[#F7F6F3] relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-black/[0.08] to-transparent" />
      
      {/* Decorative glowing background orbs */}
      <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-[#E8A820]/[0.025] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-[#25D366]/[0.015] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 md:px-8 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-xl mx-auto mb-16"
        >
          <div className="eyebrow justify-center mb-4">Reach out</div>
          <h2 className="font-display font-black text-[#1C1C1E] text-[clamp(2rem,4.5vw,2.9rem)]">
            Step into the <span className="text-gold-gradient">arena</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 items-stretch">

          {/* ── Info ──────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-between"
          >
            <div>
              <h3 className="font-display font-black text-[#1C1C1E] text-xl mb-2">Contact us</h3>
              <p className="text-[#666] text-[0.92rem] leading-relaxed mb-7">
                Ready to transform? Have questions about our programs? Drop us a line or walk in.
              </p>

              {/* Hours card */}
              <motion.div 
                whileHover={{ x: 4 }}
                className="mb-6 flex items-start gap-3.5 p-5 bg-[#F0EEE9] border-l-4 border-l-[#E8A820] border-y border-r border-black/[0.06] rounded-r-2xl transition-all duration-200"
              >
                <Clock size={18} className="text-[#E8A820] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11px] font-black uppercase tracking-wider text-[#E8A820] mb-1">Operating hours</p>
                  <p className="text-[#333] text-sm font-medium">Unisex Gym: Mon – Sat, 6:00 AM – 11:00 PM</p>
                  <p className="text-[#333] text-sm font-medium">Female Gym: Mon – Sat, 6:00 AM – 12:00 PM &amp; 4:00 PM – 10:00 PM</p>
                </div>
              </motion.div>

              {/* Contact links */}
              <div className="flex flex-col gap-2.5">
                {contactItems.map((item, i) => (
                  <motion.a
                    key={i}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -3, scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="flex items-center gap-4 p-4 bg-[#F0EEE9] border border-black/[0.06] rounded-2xl hover:border-[#E8A820]/40 hover:shadow-[0_8px_24px_rgba(0,0,0,0.05)] group transition-all duration-200"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform"
                      style={{ background: item.bg }}
                    >
                      <item.Icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#999] mb-0.5">{item.label}</p>
                      <p className="text-[#1C1C1E] font-semibold text-[0.87rem] leading-snug">{item.value}</p>
                    </div>
                    <span className="text-[#E8A820] text-[11px] font-bold uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block shrink-0">
                      {item.cta} &rarr;
                    </span>
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── Form ──────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#F0EEE9] border border-black/[0.06] rounded-[24px] p-8 md:p-10 shadow-[0_4px_28px_rgba(0,0,0,0.04)] relative overflow-hidden flex flex-col justify-center min-h-[580px]"
          >
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center justify-center text-center py-8"
                >
                  <div className="w-20 h-20 rounded-full bg-[#25D366]/10 border border-[#25D366]/20 flex items-center justify-center mb-6 shadow-[0_8px_24px_rgba(37,211,102,0.15)]">
                    <CheckCircle2 size={40} className="text-[#25D366] animate-bounce" />
                  </div>
                  
                  <h4 className="font-display font-black text-[#1C1C1E] text-2xl mb-3">WhatsApp Connection Opened!</h4>
                  <p className="text-[#666] text-sm leading-relaxed max-w-sm mb-8">
                    Thanks <strong className="text-[#1C1C1E]">{form.name}</strong>! Your message is ready to send in WhatsApp. If it didn't open automatically, please check your browser's pop-up blocker.
                  </p>
                  
                  {/* Countdown progress bar */}
                  <div className="w-full max-w-[280px] bg-black/[0.05] h-1.5 rounded-full overflow-hidden mb-8 relative">
                    <motion.div 
                      key={submitted ? "active-progress" : "inactive-progress"}
                      initial={{ width: "100%" }}
                      animate={{ width: "0%" }}
                      transition={{ duration: 5, ease: "linear" }}
                      className="h-full bg-[#E8A820]"
                    />
                  </div>

                  <button 
                    onClick={handleReset}
                    className="px-6 py-3 bg-[#E8A820] hover:bg-[#d49518] text-[#1a1208] text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-200 hover:shadow-[0_4px_12px_rgba(232,168,32,0.3)] hover:-translate-y-0.5 cursor-pointer"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full"
                >
                  <h3 className="font-display font-black text-[#1C1C1E] text-xl mb-1">Send a message</h3>
                  <p className="text-[#888] text-[0.87rem] mb-8 leading-relaxed">
                    We'll open WhatsApp with your details pre-filled — straight to our team.
                  </p>

                  <form onSubmit={handleSubmit} noValidate className="space-y-5">

                    {/* Name */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-[#888] mb-1.5">Full name</label>
                      <input 
                        type="text" 
                        placeholder="John Doe" 
                        value={form.name} 
                        onChange={e => setForm({...form, name: e.target.value})} 
                        className={getInputClass("name", form.name)} 
                      />
                      {errors.name && <p className={errMsg}>{errors.name}</p>}
                    </div>

                    {/* Age */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-[#888] mb-1.5">Age</label>
                      <input 
                        type="number" 
                        placeholder="25" 
                        min={10} 
                        max={90} 
                        value={form.age} 
                        onChange={e => setForm({...form, age: e.target.value})} 
                        className={getInputClass("age", form.age)} 
                      />
                      {errors.age && <p className={errMsg}>{errors.age}</p>}
                    </div>

                    {/* Goal */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-[#888] mb-2">My goal</label>
                      <div className="grid grid-cols-2 gap-2">
                        {goals.map(g => (
                          <label
                            key={g.value}
                            className={`flex items-center gap-2.5 px-3.5 py-3 border rounded-xl cursor-pointer text-[0.85rem] font-medium transition-all duration-200 capitalize ${
                              form.requirement === g.value
                                ? "border-[#E8A820] bg-[#E8A820]/[0.08] text-[#7A5B00]"
                                : "border-black/[0.08] bg-white text-[#555] hover:border-[#E8A820]/40"
                            }`}
                          >
                            <input 
                              type="radio" 
                              name="goal" 
                              value={g.value} 
                              checked={form.requirement === g.value} 
                              onChange={e => setForm({...form, requirement: e.target.value})} 
                              className="accent-[#E8A820] w-3.5 h-3.5 shrink-0" 
                            />
                            {g.label}
                          </label>
                        ))}
                      </div>
                      {errors.requirement && <p className={errMsg}>{errors.requirement}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-[#888] mb-1.5">Phone number</label>
                      <input 
                        type="tel" 
                        placeholder="+91 98765 43210" 
                        value={form.phone} 
                        onChange={e => setForm({...form, phone: e.target.value})} 
                        className={getInputClass("phone", form.phone)} 
                      />
                      {errors.phone && <p className={errMsg}>{errors.phone}</p>}
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-[#888] mb-1.5">
                        Notes <span className="normal-case font-normal text-[#ccc]">(optional)</span>
                      </label>
                      <textarea
                        placeholder="Preferred timings, questions, or anything else..."
                        rows={3}
                        value={form.notes}
                        onChange={e => setForm({...form, notes: e.target.value})}
                        className="input-premium w-full h-auto py-3 resize-none focus:outline-none transition-all duration-200"
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#1db954] text-white font-bold text-[14px] h-[52px] rounded-[14px] transition-all duration-200 hover:shadow-[0_8px_24px_rgba(37,211,102,0.30)] hover:-translate-y-0.5 cursor-pointer"
                    >
                      <FaWhatsapp size={19} />
                      Send via WhatsApp
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
