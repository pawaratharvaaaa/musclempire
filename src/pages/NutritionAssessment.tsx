import { useState, useLayoutEffect, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Shift = {
  name: string;
  from: string;
  to: string;
};

type Meal = {
  name: string;
  time: string;
  food: string;
};
import chalkboardBg from "@/assets/images/chalkboard-bg.png";
import { StarsBackground } from "@/components/ui/stars";
import { CheckCircle2, User, Scale, Heart, Utensils, Target, FileText, Clock, ChevronRight, ChevronLeft, ChevronUp, ChevronDown } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import PlanNavbar from "@/components/PlanNavbar";
import Footer from "@/components/Footer";
import { submitAssessment } from "@/lib/sheets";
import type { AssessmentData } from "@/lib/sheets";
import { RAZORPAY_KEY } from "@/lib/razorpay";
import { validateCoupon } from "@/lib/couponStore";

const WA_NUMBER = "919773053632";

const blockNonNumericKeys = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (
    ["Backspace", "Delete", "Tab", "Escape", "Enter", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(e.key) ||
    (e.ctrlKey || e.metaKey)
  ) {
    return;
  }
  if (!/^[0-9]$/.test(e.key)) {
    e.preventDefault();
  }
};

const blockNonAlphabetKeys = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (
    ["Backspace", "Delete", "Tab", "Escape", "Enter", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", " "].includes(e.key) ||
    (e.ctrlKey || e.metaKey)
  ) {
    return;
  }
  if (!/^[a-zA-Z]$/.test(e.key)) {
    e.preventDefault();
  }
};

type Form = {
  name: string; phone: string; email: string; age: string; gender: string;
  weight: string; height: string;
  wakeTime: string; bedTime: string; sleepDuration: string;
  duty: string;
  restTimeFrom: string; restTimeTo: string; restTime: string;
  doesWorkout: string; workoutType: string;
  workoutTimeFrom: string; workoutTimeTo: string; workoutTime: string;
  foodPref: string;
  collegeTimeFrom: string; collegeTimeTo: string; collegeTime: string;
  workTimeFrom: string; workTimeTo: string; workTime: string;
  medicalConditions: string; allergies: string; supplements: string;
  goals: string[]; otherGoal: string;
  remarks: string; foodHistory: string; consent: boolean;
};

const empty: Form = {
  name: "", phone: "", email: "", age: "", gender: "",
  weight: "", height: "",
  wakeTime: "", bedTime: "", sleepDuration: "",
  duty: "",
  restTimeFrom: "", restTimeTo: "", restTime: "",
  doesWorkout: "", workoutType: "",
  workoutTimeFrom: "", workoutTimeTo: "", workoutTime: "",
  foodPref: "",
  collegeTimeFrom: "", collegeTimeTo: "", collegeTime: "",
  workTimeFrom: "", workTimeTo: "", workTime: "",
  medicalConditions: "", allergies: "", supplements: "",
  goals: [], otherGoal: "",
  remarks: "", foodHistory: "", consent: false,
};

function bmi(w: string, h: string) {
  const wn = parseFloat(w), hn = parseFloat(h) / 100;
  if (!wn || !hn || hn <= 0) return null;
  return wn / (hn * hn);
}
function calculateSleepDuration(bedTime: string, wakeTime: string): string {
  if (!bedTime || !wakeTime) return "";
  const [bedH, bedM] = bedTime.split(":").map(Number);
  const [wakeH, wakeM] = wakeTime.split(":").map(Number);
  if (isNaN(bedH) || isNaN(bedM) || isNaN(wakeH) || isNaN(wakeM)) return "";

  const bedMinutes = bedH * 60 + bedM;
  const wakeMinutes = wakeH * 60 + wakeM;

  let diffMinutes = 0;
  if (wakeMinutes >= bedMinutes) {
    diffMinutes = wakeMinutes - bedMinutes;
  } else {
    diffMinutes = (24 * 60 - bedMinutes) + wakeMinutes;
  }

  const hours = diffMinutes / 60;
  return Number(hours.toFixed(1)).toString();
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

const formatTime12h = (timeStr: string): string => {
  if (!timeStr) return "";
  if (timeStr.includes(" to ")) {
    const parts = timeStr.split(" to ");
    const formattedParts = parts.map(p => formatTime12h(p)).filter(Boolean);
    return formattedParts.join(" to ");
  }
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return timeStr;
  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  if (isNaN(hours)) return timeStr;
  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  if (hours === 0) hours = 12;
  return `${hours}:${minutes} ${period}`;
};

// AM/PM time picker component
function TimeInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const parse = (t: string) => {
    const m = t.match(/^(\d{1,2}):(\d{2})$/);
    if (!m) return { h: 0, min: 0, period: "AM", isSet: false };
    const h24 = parseInt(m[1], 10);
    return { h: h24 % 12 === 0 ? 12 : h24 % 12, min: parseInt(m[2], 10), period: h24 >= 12 ? "PM" : "AM", isSet: true };
  };
  const { h, min, period, isSet } = parse(value);
  const emit = (newH: number, newMin: number, newPeriod: string) => {
    if (!newH) { onChange(""); return; }
    let h24 = newH % 12;
    if (newPeriod === "PM") h24 += 12;
    onChange(`${String(h24).padStart(2,"0")}:${String(newMin).padStart(2,"0")}`);
  };
  const sel = "bg-white/[0.06] border border-white/[0.10] text-[#F2EFE9] rounded-2xl h-12 outline-none focus:border-[#E8A820] transition-all duration-200 text-center text-[0.9rem] cursor-pointer appearance-none";
  return (
    <div className="flex items-center gap-2">
      <select value={isSet ? String(h).padStart(2,"0") : ""} onChange={e => emit(parseInt(e.target.value)||0, min, period)} className={`${sel} w-16`}>
        <option value="">HH</option>
        {Array.from({length:12},(_,i)=>i+1).map(v=><option key={v} value={String(v).padStart(2,"0")}>{String(v).padStart(2,"0")}</option>)}
      </select>
      <span className="text-[#F2EFE9]/20 font-bold text-xl select-none">:</span>
      <select value={isSet ? String(min).padStart(2,"0") : "00"} onChange={e => emit(h||1, parseInt(e.target.value), period)} className={`${sel} w-16`}>
        {["00","05","10","15","20","25","30","35","40","45","50","55"].map(v=><option key={v} value={v}>{v}</option>)}
      </select>
      <div className="flex rounded-2xl overflow-hidden border border-white/[0.10]">
        {(["AM","PM"] as const).map(p=>(
          <button key={p} type="button" onClick={() => emit(h||1, min, p)}
            className={`px-4 h-12 text-[0.85rem] font-black transition-all cursor-pointer ${period===p&&isSet ? "bg-[#E8A820] text-black" : "bg-white/[0.04] text-[#F2EFE9]/40 hover:text-[#F2EFE9]/70"}`}>
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
