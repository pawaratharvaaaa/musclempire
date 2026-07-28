import { useState, useLayoutEffect, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Meal = {
  name: string;
  time: string;
  food: string;
};
import chalkboardBg from "@/assets/images/chalkboard-bg.png";
import { StarsBackground } from "@/components/ui/stars";
import { CheckCircle2, User, Scale, Heart, Utensils, Target, FileText, Clock, ChevronRight, ChevronLeft } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import PlanNavbar from "@/components/PlanNavbar";
import Footer from "@/components/Footer";
import { submitAssessment } from "@/lib/sheets";
import type { AssessmentData } from "@/lib/sheets";

const WA_NUMBER = "919773053632";

type Form = {
  name: string; phone: string; email: string; age: string; gender: string;
  weight: string; height: string;
  wakeTime: string; bedTime: string; sleepDuration: string; workoutTime: string;
  foodPref: string;
  collegeTime: string; workTime: string;
  medicalConditions: string; allergies: string; supplements: string;
  goals: string[]; otherGoal: string;
  remarks: string; foodHistory: string; consent: boolean;
};

const empty: Form = {
  name: "", phone: "", email: "", age: "", gender: "",
  weight: "", height: "",
  wakeTime: "", bedTime: "", sleepDuration: "", workoutTime: "",
  foodPref: "",
  collegeTime: "", workTime: "",
  medicalConditions: "", allergies: "", supplements: "",
  goals: [], otherGoal: "",
  remarks: "", foodHistory: "", consent: false,
};

function bmi(w: string, h: string) {
  const wn = parseFloat(w), hn = parseFloat(h) / 100;
  if (!wn || !hn || hn <= 0) return null;
  return wn / (hn * hn);
}
function bmiCategory(b: number) {
  if (b < 18.5) return { label: "Underweight", color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/25" };
  if (b < 25)   return { label: "Normal weight", color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/25" };
  if (b < 30)   return { label: "Overweight", color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/25" };
  return { label: "Obese", color: "text-red-400", bg: "bg-red-400/10 border-red-400/25" };
}

function bodyFat(bmiVal: number, ageStr: string, gender: string) {
  const age = parseFloat(ageStr);
  if (!bmiVal || !age || !gender) return null;
  const genderVal = gender.toLowerCase() === "male" ? 1 : 0;
  // Deurenberg formula for adults
  const bf = (1.20 * bmiVal) + (0.23 * age) - (10.8 * genderVal) - 5.4;
  return bf > 0 ? bf : null;
}

function bodyFatCategory(bf: number, gender: string) {
  const isMale = gender.toLowerCase() === "male";
  if (isMale) {
    if (bf < 6) return { label: "Essential Fat", color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/25" };
    if (bf < 14) return { label: "Athletic/Fit", color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/25" };
    if (bf < 18) return { label: "Fitness", color: "text-emerald-300", bg: "bg-emerald-300/10 border-emerald-300/25" };
    if (bf < 25) return { label: "Average", color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/25" };
    return { label: "Obese", color: "text-red-400", bg: "bg-red-400/10 border-red-400/25" };
  } else {
    if (bf < 14) return { label: "Essential Fat", color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/25" };
    if (bf < 21) return { label: "Athletic/Fit", color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/25" };
    if (bf < 25) return { label: "Fitness", color: "text-emerald-300", bg: "bg-emerald-300/10 border-emerald-300/25" };
    if (bf < 32) return { label: "Average", color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/25" };
    return { label: "Obese", color: "text-red-400", bg: "bg-red-400/10 border-red-400/25" };
  }
}

/* ── Shared UI primitives ──────────────────────────────────────── */
const inp = (err?: string) =>
  `w-full bg-white/[0.05] border ${err ? "border-red-400/60" : "border-white/[0.12]"} focus:border-[#E8A820] focus:ring-1 focus:ring-[#E8A820]/20 outline-none rounded-2xl h-12 px-4 text-[#F2EFE9] placeholder:text-white/25 text-[0.9rem] transition-all duration-200`;

const textareaBase =
  "w-full bg-white/[0.05] border border-white/[0.12] focus:border-[#E8A820] focus:ring-1 focus:ring-[#E8A820]/20 outline-none rounded-2xl px-4 py-3 text-[#F2EFE9] placeholder:text-white/25 text-[0.9rem] transition-all duration-200 resize-none";

const Err = ({ msg }: { msg?: string }) =>
  msg ? <p className="text-red-400 text-xs mt-1.5 font-medium">{msg}</p> : null;

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-[11px] font-bold uppercase tracking-widest text-[#F2EFE9]/45 mb-2">{children}</label>
);

function PillOption({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className={`px-4 py-2.5 rounded-xl text-[0.84rem] font-semibold border transition-all duration-200 ${
        active
          ? "bg-[#E8A820] text-black border-[#E8A820] shadow-[0_2px_12px_rgba(232,168,32,0.30)]"
          : "bg-white/[0.04] text-[#F2EFE9]/60 border-white/[0.10] hover:border-[#E8A820]/40 hover:text-[#F2EFE9]/90"
      }`}
    >{label}</button>
  );
}

const STEPS = [
  { label: "Personal",     icon: User },
  { label: "Body",         icon: Scale },
  { label: "Lifestyle",    icon: Clock },
  { label: "Diet",         icon: Utensils },
  { label: "Health",       icon: Heart },
  { label: "Goals",        icon: Target },
  { label: "History",      icon: FileText },
  { label: "Review",       icon: CheckCircle2 },
];

const slide = {
  initial: (dir: number) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
  animate: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
  transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
};

export default function NutritionAssessment() {
  const [form, setForm] = useState<Form>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [step, setStep]     = useState(0);
  const [dir, setDir]       = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [meals, setMeals] = useState<Meal[]>([]);

  // Sync meals to foodHistory string representation
  useEffect(() => {
    if (meals.length > 0) {
      const historyStr = meals
        .map((m, idx) => `Meal #${idx + 1}: ${m.name || "N/A"} (${m.time || "N/A"}) - ${m.food || "N/A"}`)
        .join("\n");
      setForm(f => ({ ...f, foodHistory: historyStr }));
    } else {
      setForm(f => ({ ...f, foodHistory: "" }));
    }
  }, [meals]);

  const addMeal = () => {
    setMeals([...meals, { name: "", time: "", food: "" }]);
  };

  const removeMeal = (idx: number) => {
    setMeals(meals.filter((_, i) => i !== idx));
  };

  const updateMeal = (idx: number, key: keyof Meal, val: string) => {
    setMeals(meals.map((m, i) => i === idx ? { ...m, [key]: val } : m));
  };

  useLayoutEffect(() => { window.scrollTo(0, 0); }, []);

  const bmiVal = bmi(form.weight, form.height);
  const bmiCat = bmiVal ? bmiCategory(bmiVal) : null;
  const bfVal = bmiVal ? bodyFat(bmiVal, form.age, form.gender) : null;
  const bfCat = bfVal ? bodyFatCategory(bfVal, form.gender) : null;

  const set = (k: keyof Form, v: string | boolean | string[]) =>
    setForm(f => ({ ...f, [k]: v }));

  const toggleGoal = (g: string) => {
    const cur = form.goals;
    set("goals", cur.includes(g) ? cur.filter(x => x !== g) : [...cur, g]);
  };

  /* per-step validation */
  const validateStep = (s: number) => {
    const e: Partial<Record<keyof Form, string>> = {};
    if (s === 0) {
      if (!form.name.trim()) e.name = "Required";
      if (!form.phone.trim() || !/^\+?[0-9]{10,13}$/.test(form.phone.replace(/\s/g, ""))) e.phone = "Enter valid phone";
      if (!form.age || isNaN(Number(form.age))) e.age = "Required";
      if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter valid email";
      if (!form.gender) e.gender = "Required";
    }
    if (s === 1) {
      if (!form.weight) e.weight = "Required";
      if (!form.height) e.height = "Required";
    }
    if (s === 2) {
      if (!form.wakeTime) e.wakeTime = "Required";
      if (!form.bedTime) e.bedTime = "Required";
      if (!form.sleepDuration) e.sleepDuration = "Required";
      if (!form.workoutTime) e.workoutTime = "Required";
    }
    if (s === 3) {
      if (!form.foodPref) e.foodPref = "Select one";
      if (!form.collegeTime.trim()) e.collegeTime = "Required (type N/A if not applicable)";
      if (!form.workTime.trim()) e.workTime = "Required (type N/A if not applicable)";
    }
    if (s === 4) {
      if (!form.medicalConditions.trim()) e.medicalConditions = "Required (type None if not applicable)";
      if (!form.allergies.trim()) e.allergies = "Required (type None if not applicable)";
      if (!form.supplements.trim()) e.supplements = "Required (type None if not applicable)";
    }
    if (s === 5) {
      if (form.goals.length === 0) e.goals = "Select at least one goal";
      if (form.goals.includes("Other") && !form.otherGoal.trim()) e.otherGoal = "Required";
      if (!form.remarks.trim()) e.remarks = "Required (type N/A if not applicable)";
    }
    if (s === 6) {
      if (meals.length === 0) {
        e.foodHistory = "Please add at least one meal.";
      } else {
        const missing = meals.some(m => !m.name.trim() || !m.time.trim() || !m.food.trim());
        if (missing) {
          e.foodHistory = "Please fill in all fields (Meal Name, Time, and Food) for each added meal.";
        }
      }
    }
    if (s === 7) {
      if (!form.consent) e.consent = "Please confirm";
    }
    return e;
  };

  const goNext = () => {
    setErrors({});
    setDir(1);
    setStep(s => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goPrev = () => {
    setErrors({});
    setDir(-1);
    setStep(s => s - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    const e = {
      ...validateStep(0),
      ...validateStep(1),
      ...validateStep(2),
      ...validateStep(3),
      ...validateStep(4),
      ...validateStep(5),
      ...validateStep(6),
      ...validateStep(7),
    };
    if (Object.keys(e).length) {
      setErrors(e);
      if (Object.keys(validateStep(0)).length) setStep(0);
      else if (Object.keys(validateStep(1)).length) setStep(1);
      else if (Object.keys(validateStep(2)).length) setStep(2);
      else if (Object.keys(validateStep(3)).length) setStep(3);
      else if (Object.keys(validateStep(4)).length) setStep(4);
      else if (Object.keys(validateStep(5)).length) setStep(5);
      else if (Object.keys(validateStep(6)).length) setStep(6);
      else if (Object.keys(validateStep(7)).length) setStep(7);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const today = new Date().toLocaleDateString("en-IN");
    const goalsList = [...form.goals, form.otherGoal ? `Other: ${form.otherGoal}` : ""].filter(Boolean).join(", ");
    const payload: AssessmentData = {
      date: today, name: form.name, phone: form.phone, email: form.email,
      age: form.age, gender: form.gender, weight: form.weight, height: form.height,
      bmi: bmiVal ? bmiVal.toFixed(1) : "", bmiCategory: bmiCat?.label || "",
      wakeTime: form.wakeTime, bedTime: form.bedTime, sleepDuration: form.sleepDuration,
      workoutTime: form.workoutTime, targetWeight: "",
      weightChange: "", foodPref: form.foodPref,
      collegeTime: form.collegeTime, workTime: form.workTime,
      medicalConditions: form.medicalConditions, allergies: form.allergies,
      supplements: form.supplements, goals: goalsList, remarks: form.remarks,
      foodHistory: form.foodHistory, status: "New",
      notes: bfVal ? `Estimated Body Fat: ${bfVal.toFixed(1)}% (${bfCat?.label})` : "",
    };
    await submitAssessment(payload);
    const waMsg = [
      `🏋️ *Muscle Empire – Nutrition Assessment*`, ``,
      `*👤 Personal Details*`,
      `Name: ${form.name}`, `Phone: ${form.phone}`, `Email: ${form.email}`,
      `Age: ${form.age}`, form.gender ? `Gender: ${form.gender}` : null, ``,
      `*📏 Body Measurements*`,
      `Weight: ${form.weight} kg`, `Height: ${form.height} cm`,
      bmiVal ? `BMI: ${bmiVal.toFixed(1)} (${bmiCat?.label})` : null,
      bfVal ? `Body Fat: ${bfVal.toFixed(1)}% (${bfCat?.label})` : null, ``,
      `*🌙 Lifestyle*`,
      form.wakeTime ? `Wake-up: ${form.wakeTime}` : null,
      form.bedTime ? `Bed: ${form.bedTime}` : null,
      form.sleepDuration ? `Sleep: ${form.sleepDuration} hrs` : null,
      form.workoutTime ? `Workout: ${form.workoutTime}` : null, ``,
      `*🥗 Food Preference*`, `Food Pref: ${form.foodPref}`,
      form.collegeTime ? `College: ${form.collegeTime}` : null,
      form.workTime ? `Work: ${form.workTime}` : null, ``,
      `*🎯 Goals*`, `Goals: ${goalsList}`, ``,
      form.medicalConditions ? `*⚕️ Medical:*\n${form.medicalConditions}` : null,
      form.allergies ? `*⚠️ Allergies:*\n${form.allergies}` : null,
      form.supplements ? `*💊 Supplements:*\n${form.supplements}` : null,
      form.remarks ? `*📝 Remarks:*\n${form.remarks}` : null,
      form.foodHistory ? `*🍽️ Food History (7 Days):*\n${form.foodHistory}` : null,
      ``, `_Submitted on ${today}_`,
    ].filter(Boolean).join("\n");
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waMsg)}`, "_blank");
    setSubmitted(true);
    window.scrollTo(0, 0);
  };

  /* ── Success screen ─────────────────────────────────────────── */
  if (submitted) {
    return (
      <div className="min-h-screen bg-black text-[#F2EFE9] flex flex-col relative overflow-hidden">
        <div 
          className="fixed inset-0 pointer-events-none z-0 opacity-80 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${chalkboardBg})`,
            maskImage: "linear-gradient(to bottom, transparent 0px, transparent 100px, black 160px), radial-gradient(ellipse 70% 60% at 50% 55%, transparent 40%, black 80%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0px, transparent 100px, black 160px), radial-gradient(ellipse 70% 60% at 50% 55%, transparent 40%, black 80%)",
            maskComposite: "intersect",
            WebkitMaskComposite: "destination-in",
          }}
        />
        <PlanNavbar />
        <main className="flex items-center justify-center flex-1 px-4 relative z-10">
          <motion.div initial={{ opacity:0, scale:0.88 }} animate={{ opacity:1, scale:1 }}
            transition={{ duration:0.65, ease:[0.16,1,0.3,1] }}
            className="text-center max-w-md mx-auto"
          >
            <motion.div
              initial={{ scale:0 }} animate={{ scale:1 }}
              transition={{ delay:0.2, type:"spring", stiffness:260, damping:20 }}
              className="w-24 h-24 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-8"
            >
              <CheckCircle2 size={52} className="text-emerald-400" />
            </motion.div>
            <motion.h2 initial={{ opacity:0,y:16 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.35,duration:0.6 }}
              className="font-display font-black text-[#F2EFE9] text-3xl mb-4"
            >
              Assessment submitted!
            </motion.h2>
            <motion.p initial={{ opacity:0,y:12 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.45,duration:0.5 }}
              className="text-[#F2EFE9]/55 text-[0.97rem] leading-relaxed"
            >
              Thank you for submitting your assessment. Our nutritionist will review your information and contact you shortly with your personalised diet plan.
            </motion.p>
          </motion.div>
        </main>
        <div className="relative z-10 bg-[#1C1C1E]">
          <Footer />
        </div>
      </div>
    );
  }

  /* ── Step content renderer ───────────────────────────────────── */
  const pct = ((step) / (STEPS.length - 1)) * 100;

  const stepContent = () => {
    switch (step) {
      /* Step 0 — Personal */
      case 0: return (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Full name <span className="text-red-400">*</span></Label>
              <input type="text" value={form.name} onChange={e=>set("name",e.target.value)} className={inp(errors.name)} />
              <Err msg={errors.name} />
            </div>
            <div>
              <Label>Mobile number <span className="text-red-400">*</span></Label>
              <input type="tel" value={form.phone} onChange={e=>set("phone",e.target.value)} className={inp(errors.phone)} />
              <Err msg={errors.phone} />
            </div>
            <div>
              <Label>Age <span className="text-red-400">*</span></Label>
              <input type="number" min={10} max={90} value={form.age} onChange={e=>set("age",e.target.value)} className={inp(errors.age)} />
              <Err msg={errors.age} />
            </div>
            <div>
              <Label>Email address <span className="text-red-400">*</span></Label>
              <input type="email" value={form.email} onChange={e=>set("email",e.target.value)} className={inp(errors.email)} />
              <Err msg={errors.email} />
            </div>
          </div>
          <div>
            <Label>Gender <span className="text-red-400">*</span></Label>
            <div className="flex flex-wrap gap-3">
              {["Male","Female","Other"].map(g=>(
                <PillOption key={g} label={g} active={form.gender===g} onClick={()=>set("gender",g)} />
              ))}
            </div>
            <Err msg={errors.gender} />
          </div>
        </div>
      );
      /* Step 1 — Body */
      case 1: return (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Weight (kg) <span className="text-red-400">*</span></Label>
              <input type="number" min={20} max={300} value={form.weight} onChange={e=>set("weight",e.target.value)} className={inp(errors.weight)} />
              <Err msg={errors.weight} />
            </div>
            <div>
              <Label>Height (cm) <span className="text-red-400">*</span></Label>
              <input type="number" min={100} max={250} value={form.height} onChange={e=>set("height",e.target.value)} className={inp(errors.height)} />
              <Err msg={errors.height} />
            </div>
          </div>
          {bmiVal && bmiCat && (
            <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
              className={bfVal && bfCat ? "grid grid-cols-1 sm:grid-cols-2 gap-4" : "w-full"}
            >
              <div className={`border rounded-2xl p-5 flex items-center justify-between ${bmiCat.bg}`}>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest opacity-60 mb-0.5 text-[#F2EFE9]">Your BMI</p>
                  <p className={`text-4xl font-black ${bmiCat.color}`}>{bmiVal.toFixed(1)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-bold uppercase tracking-widest opacity-60 mb-0.5 text-[#F2EFE9]">Category</p>
                  <p className={`text-xl font-black ${bmiCat.color}`}>{bmiCat.label}</p>
                </div>
              </div>
              {bfVal && bfCat && (
                <div className={`border rounded-2xl p-5 flex items-center justify-between ${bfCat.bg}`}>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest opacity-60 mb-0.5 text-[#F2EFE9]">Body Fat (Est.)</p>
                    <p className={`text-4xl font-black ${bfCat.color}`}>{bfVal.toFixed(1)}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-bold uppercase tracking-widest opacity-60 mb-0.5 text-[#F2EFE9]">Category</p>
                    <p className={`text-xl font-black ${bfCat.color}`}>{bfCat.label}</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      );
      /* Step 2 — Lifestyle */
      case 2: return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <Label>Wake-up time <span className="text-red-400">*</span></Label>
            <input type="time" value={form.wakeTime} onChange={e=>set("wakeTime",e.target.value)} className={inp(errors.wakeTime)} />
            <Err msg={errors.wakeTime} />
          </div>
          <div>
            <Label>Bed time <span className="text-red-400">*</span></Label>
            <input type="time" value={form.bedTime} onChange={e=>set("bedTime",e.target.value)} className={inp(errors.bedTime)} />
            <Err msg={errors.bedTime} />
          </div>
          <div>
            <Label>Sleep duration (hours) <span className="text-red-400">*</span></Label>
            <input type="number" min={1} max={14} value={form.sleepDuration} onChange={e=>set("sleepDuration",e.target.value)} className={inp(errors.sleepDuration)} />
            <Err msg={errors.sleepDuration} />
          </div>
          <div>
            <Label>Workout time <span className="text-red-400">*</span></Label>
            <input type="time" value={form.workoutTime} onChange={e=>set("workoutTime",e.target.value)} className={inp(errors.workoutTime)} />
            <Err msg={errors.workoutTime} />
          </div>
        </div>
      );

      /* Step 3 — Diet & schedule */
      case 3: return (
        <div className="space-y-5">
          <div>
            <Label>Food preference <span className="text-red-400">*</span></Label>
            <div className="flex flex-wrap gap-3">
              {["Vegetarian","Non-Vegetarian","Vegan"].map(f=>(
                <PillOption key={f} label={f} active={form.foodPref===f} onClick={()=>set("foodPref",f)} />
              ))}
            </div>
            <Err msg={errors.foodPref} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>College timing <span className="text-red-400">*</span></Label>
              <input type="text" value={form.collegeTime} onChange={e=>set("collegeTime",e.target.value)} className={inp(errors.collegeTime)} />
              <Err msg={errors.collegeTime} />
            </div>
            <div>
              <Label>Work timing <span className="text-red-400">*</span></Label>
              <input type="text" value={form.workTime} onChange={e=>set("workTime",e.target.value)} className={inp(errors.workTime)} />
              <Err msg={errors.workTime} />
            </div>
          </div>
        </div>
      );

      /* Step 4 — Health */
      case 4: return (
        <div className="space-y-5">
          {(["medicalConditions","allergies","supplements"] as const).map((key,i)=>(
            <div key={key}>
              <Label>
                {["Medical conditions","Allergies","Current supplements / medicines"][i]} <span className="text-red-400">*</span>
              </Label>
              <textarea rows={1}
                value={form[key]} onChange={e=>set(key,e.target.value)} 
                className={`${textareaBase} ${errors[key] ? "border-red-400/60" : "border-white/[0.12]"}`} 
              />
              <Err msg={errors[key]} />
            </div>
          ))}
        </div>
      );
      /* Step 5 — Goals */
      case 5: return (
        <div className="space-y-5">
          <div>
            <Label>Select your goals <span className="text-red-400">*</span></Label>
            <div className="flex flex-wrap gap-3">
              {["Weight Loss","Fat Loss","Muscle Gain","Weight Gain","Maintenance","Other"].map(g=>(
                <button key={g} type="button" onClick={()=>toggleGoal(g)}
                  className={`px-4 py-2.5 rounded-xl text-[0.84rem] font-semibold border transition-all duration-200 ${
                    form.goals.includes(g)
                      ? "bg-[#E8A820] text-black border-[#E8A820] shadow-[0_2px_12px_rgba(232,168,32,0.30)]"
                      : "bg-white/[0.04] text-[#F2EFE9]/60 border-white/[0.10] hover:border-[#E8A820]/40 hover:text-[#F2EFE9]/90"
                  }`}
                >{g}</button>
              ))}
            </div>
            <Err msg={errors.goals} />
          </div>
          {form.goals.includes("Other") && (
            <div>
              <Label>Specify your goal <span className="text-red-400">*</span></Label>
              <input type="text" value={form.otherGoal} onChange={e=>set("otherGoal",e.target.value)} className={inp(errors.otherGoal)} />
              <Err msg={errors.otherGoal} />
            </div>
          )}
          <div>
            <Label>Additional remarks <span className="text-red-400">*</span></Label>
            <textarea rows={2}
              value={form.remarks} onChange={e=>set("remarks",e.target.value)} 
              className={`${textareaBase} ${errors.remarks ? "border-red-400/60" : "border-white/[0.12]"}`} 
            />
            <Err msg={errors.remarks} />
          </div>
        </div>
      );

      /* Step 6 — Food history */
      case 6: return (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
            <p className="text-[#F2EFE9]/50 text-[0.9rem] leading-relaxed">
              Describe what you ate over the last 7 days.
            </p>
            <button
              type="button"
              onClick={addMeal}
              className="flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full border border-[#25D366]/40 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 text-xs font-bold uppercase tracking-wider transition-all duration-200 shrink-0 self-start sm:self-auto font-sans"
            >
              + Add Meal
            </button>
          </div>
          {meals.length === 0 ? (
            <div className="flex flex-col items-center justify-center border border-white/[0.08] bg-white/[0.02] rounded-2xl py-12 px-4 text-center">
              <p className="text-[#F2EFE9]/40 text-sm">Click "+ Add Meal" to add meal entries to the diet plan.</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
              {meals.map((m, idx) => (
                <div key={idx} className="p-5 rounded-2xl border border-white/[0.08] bg-white/[0.02] relative space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#E8A820]">Meal #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeMeal(idx)}
                      className="text-xs text-red-400 hover:text-red-300 font-bold uppercase tracking-wider"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Meal Name <span className="text-red-400">*</span></Label>
                      <input
                        type="text"
                        placeholder="e.g. Breakfast, Pre-workout"
                        value={m.name}
                        onChange={e => updateMeal(idx, "name", e.target.value)}
                        className={inp()}
                      />
                    </div>
                    <div>
                      <Label>Meal Time <span className="text-red-400">*</span></Label>
                      <input
                        type="text"
                        placeholder="e.g. 9:00 AM"
                        value={m.time}
                        onChange={e => updateMeal(idx, "time", e.target.value)}
                        className={inp()}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Food &amp; Quantity <span className="text-red-400">*</span></Label>
                    <textarea
                      rows={2}
                      placeholder="e.g. 3 boiled eggs, 2 slices of oats bread"
                      value={m.food}
                      onChange={e => updateMeal(idx, "food", e.target.value)}
                      className={textareaBase}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
          <Err msg={errors.foodHistory} />
        </div>
      );
      /* Step 7 — Review & submit */
      case 7: {
        const rows: [string, string][] = [
          ["Name", form.name], ["Phone", form.phone], ["Email", form.email],
          ["Age", form.age], ...(form.gender ? [["Gender", form.gender] as [string,string]] : []),
          ["Weight", `${form.weight} kg`], ["Height", `${form.height} cm`],
          ...(bmiVal ? [["BMI", `${bmiVal.toFixed(1)} — ${bmiCat?.label}`] as [string,string]] : []),
          ...(bfVal ? [["Body Fat (Est.)", `${bfVal.toFixed(1)}% — ${bfCat?.label}`] as [string,string]] : []),
          ...(form.wakeTime ? [["Wake-up", form.wakeTime] as [string,string]] : []),
          ...(form.bedTime ? [["Bed time", form.bedTime] as [string,string]] : []),
          ...(form.sleepDuration ? [["Sleep", `${form.sleepDuration} hrs`] as [string,string]] : []),
          ...(form.workoutTime ? [["Workout", form.workoutTime] as [string,string]] : []),
          ["Food preference", form.foodPref],
          ...(form.collegeTime ? [["College timing", form.collegeTime] as [string,string]] : []),
          ...(form.workTime ? [["Work timing", form.workTime] as [string,string]] : []),
          ...(form.medicalConditions ? [["Medical conditions", form.medicalConditions] as [string,string]] : []),
          ...(form.allergies ? [["Allergies", form.allergies] as [string,string]] : []),
          ...(form.supplements ? [["Supplements", form.supplements] as [string,string]] : []),
          ["Goals", [...form.goals, form.otherGoal ? `Other: ${form.otherGoal}` : ""].filter(Boolean).join(", ")],
          ...(form.remarks ? [["Remarks", form.remarks] as [string,string]] : []),
          ["Food history", form.foodHistory.substring(0,120) + (form.foodHistory.length > 120 ? "…" : "")],
        ];
        return (
          <div className="space-y-5">
          <p className="text-[#F2EFE9]/50 text-sm">Please review your information before submitting.</p>
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl divide-y divide-white/[0.06] overflow-hidden">
            {rows.map(([k,v])=>(
              <div key={k} className="flex gap-4 px-5 py-3">
                <span className="text-[#F2EFE9]/40 text-[0.8rem] font-semibold uppercase tracking-wide w-36 shrink-0">{k}</span>
                <span className="text-[#F2EFE9]/90 text-[0.87rem] leading-snug">{v}</span>
              </div>
            ))}
          </div>
          <label className={`flex items-start gap-3 p-4 border rounded-2xl cursor-pointer transition-all ${form.consent ? "border-[#E8A820]/50 bg-[#E8A820]/[0.06]" : "border-white/[0.10]"}`}>
            <input type="checkbox" checked={form.consent} onChange={e=>set("consent",e.target.checked)} className="accent-[#E8A820] mt-0.5 shrink-0 w-4 h-4" />
            <span className="text-[0.87rem] text-[#F2EFE9]/55 leading-relaxed">
              I confirm that the information provided is accurate and can be used to prepare my personalised nutrition plan.
            </span>
          </label>
            <Err msg={errors.consent} />
          </div>
        );
      }

      default: return null;
    }
  };

  const StepIcon = STEPS[step].icon;

  return (
    <div className="min-h-screen bg-black text-[#F2EFE9] relative flex flex-col overflow-hidden">
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-80 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${chalkboardBg})`,
          maskImage: "linear-gradient(to bottom, transparent 0px, transparent 100px, black 160px), radial-gradient(ellipse 70% 60% at 50% 55%, transparent 40%, black 80%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0px, transparent 100px, black 160px), radial-gradient(ellipse 70% 60% at 50% 55%, transparent 40%, black 80%)",
          maskComposite: "intersect",
          WebkitMaskComposite: "destination-in",
        }}
      />
      <PlanNavbar />
      <main className="pt-24 pb-24 px-4 relative z-10">
        <div className="max-w-2xl mx-auto">

          {/* ── Header ──────────────────────────────────── */}
          <div className="text-center mb-10">
            <div className="eyebrow justify-center mb-4">Personalised plan</div>
            <h1 className="font-display font-black text-[clamp(2rem,5vw,2.8rem)] leading-tight mb-3 text-white">
              Nutrition <span className="text-gold-gradient">assessment</span>
            </h1>
            <p className="text-[#F2EFE9]/45 text-[0.93rem] max-w-md mx-auto">
              Fill in your details and our certified dietician will prepare a personalised nutrition plan for you.
            </p>
          </div>

          {/* ── Step pills (scrollable on mobile) ─────── */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
            {STEPS.map((s,i)=>{
              const Icon = s.icon;
              const done = i < step;
              const active = i === step;
              return (
                <button
                  type="button"
                  key={i}
                  onClick={() => {
                    if (i === step) return;
                    setDir(i > step ? 1 : -1);
                    setStep(i);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wide whitespace-nowrap shrink-0 transition-all ${
                    active ? "bg-[#E8A820] text-black hover:bg-[#d49518]" :
                    done   ? "bg-[#E8A820]/15 text-[#E8A820] hover:bg-[#E8A820]/25" :
                             "bg-white/[0.04] text-[#F2EFE9]/30 hover:text-[#F2EFE9]/60 hover:bg-white/[0.08]"
                  }`}
                >
                  <Icon size={12} />
                  {s.label}
                </button>
              );
            })}
          </div>

          {/* ── Card ─────────────────────────────────────── */}
          <div className="bg-[#18181a] border border-white/[0.08] rounded-[24px] overflow-hidden shadow-2xl shadow-black/80 relative z-10">
            {/* Card header */}
            <div className="flex items-center gap-3 px-7 py-5 border-b border-white/[0.06]">
              <div className="w-9 h-9 rounded-xl bg-[#E8A820] flex items-center justify-center shrink-0">
                <StepIcon size={17} className="text-black" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#F2EFE9]/35">Step {step + 1} of {STEPS.length}</p>
                <h2 className="font-display font-black text-[#F2EFE9] text-[1.1rem]">{STEPS[step].label}</h2>
              </div>
            </div>

            {/* Card body — animated */}
            <div className="px-7 py-7 overflow-hidden" onKeyDown={(e) => {
              if (e.key === 'Enter' && e.target instanceof HTMLInputElement) {
                e.preventDefault();
                const inputs = Array.from(document.querySelectorAll('input, textarea'));
                const idx = inputs.indexOf(e.target);
                if (idx > -1 && idx < inputs.length - 1) {
                  (inputs[idx + 1] as HTMLElement).focus();
                }
              }
            }}>
              <AnimatePresence mode="wait" custom={dir}>
                <motion.div
                  key={step}
                  custom={dir}
                  variants={slide}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  {stepContent()}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Card footer — navigation */}
            <div className="px-7 py-5 border-t border-white/[0.06] flex items-center justify-between gap-4">
              {step > 0 ? (
                <button type="button" onClick={goPrev}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/[0.05] border border-white/[0.10] text-[#F2EFE9]/70 hover:text-[#F2EFE9] hover:bg-white/[0.09] font-semibold text-[0.87rem] transition-all">
                  <ChevronLeft size={16} /> Previous
                </button>
              ) : <div />}

              {step < STEPS.length - 1 ? (
                <button type="button" onClick={goNext}
                  className="flex items-center gap-2 px-7 py-3 rounded-xl bg-[#E8A820] hover:bg-[#d49518] text-black font-bold text-[0.9rem] transition-all hover:shadow-[0_4px_20px_rgba(232,168,32,0.35)] hover:-translate-y-0.5">
                  Next <ChevronRight size={16} />
                </button>
              ) : (
                <button type="button" onClick={handleSubmit}
                  className="flex items-center gap-2.5 px-7 py-3 rounded-xl bg-[#25D366] hover:bg-[#1db954] text-white font-bold text-[0.9rem] transition-all hover:shadow-[0_4px_20px_rgba(37,211,102,0.40)] hover:-translate-y-0.5">
                  <FaWhatsapp size={17} /> Submit &amp; send on WhatsApp
                </button>
              )}
            </div>
          </div>

        </div>
      </main>
      <div className="relative z-10 bg-[#1C1C1E]">
        <Footer />
      </div>
    </div>
  );
}
