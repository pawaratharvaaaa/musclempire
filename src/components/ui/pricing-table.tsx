"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { CheckIcon } from "@radix-ui/react-icons"
import NumberFlow from "@number-flow/react"
import { X, ArrowRight } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

/* ── Types ─────────────────────────────────────────────────── */

export type PlanLevel = "basic" | "standard" | "premium" | string

export interface PricingFeature {
  name: string
  included: PlanLevel | null
}

export interface PricingPlan {
  name: string
  level: PlanLevel
  price: {
    monthly: number
    yearly: number
  }
  originalPrice?: {
    monthly: number
    yearly: number
  }
  popular?: boolean
  description?: string
  priceSuffix?: string
}

export interface PricingTableProps {
  features: PricingFeature[]
  plans: PricingPlan[]
  accentColor?: string
  onGetStarted?: (plan: PricingPlan) => void
  defaultPlan?: PlanLevel
}

/* ── Helper ─────────────────────────────────────────────────── */

function shouldShowCheck(included: PricingFeature["included"], level: string): boolean {
  const order = ["basic", "standard", "premium"]
  const includedIdx = order.indexOf(included ?? "")
  const levelIdx = order.indexOf(level)
  if (includedIdx === -1 || levelIdx === -1) return included === level || included === "all"
  return levelIdx >= includedIdx
}

/* ── PricingTable ───────────────────────────────────────────── */

export function PricingTable({
  features,
  plans,
  accentColor = "#E8A820",
  onGetStarted,
  defaultPlan,
}: PricingTableProps) {
  const [selectedPlan, setSelectedPlan] = React.useState<PlanLevel>(
    defaultPlan ?? plans.find(p => p.popular)?.level ?? plans[0]?.level
  )

  return (
    <div className="w-full">
      {/* Plan cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {plans.map((plan) => {
          const active = selectedPlan === plan.level
          return (
            <button
              key={plan.level}
              type="button"
              onClick={() => setSelectedPlan(plan.level)}
              className="relative flex flex-col items-start p-4 rounded-xl text-left transition-all duration-200"
              style={{
                background: active ? `${accentColor}12` : "rgba(255,255,255,0.03)",
                border: active
                  ? `1.5px solid ${accentColor}60`
                  : "1.5px solid rgba(255,255,255,0.07)",
                boxShadow: active ? `0 0 20px ${accentColor}18` : "none",
              }}
            >
              {plan.popular && (
                <span
                  className="absolute top-4 right-4 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
                  style={{ background: accentColor, color: "#1C1C1E" }}
                >
                  Popular
                </span>
              )}
              <span
                className="text-xs font-bold uppercase tracking-widest mb-2 pr-16"
                style={{ color: active ? accentColor : "rgba(255,255,255,0.4)" }}
              >
                {plan.name}
              </span>
              <div className="flex flex-col items-start justify-center gap-0.5 mt-2">
                {plan.originalPrice && (
                  <span className="text-xs font-medium text-white/30 line-through decoration-white/30 -mb-1 ml-4">
                    ₹{plan.originalPrice.monthly.toLocaleString()}
                  </span>
                )}
                <div className="flex items-baseline gap-1">
                  <span className="text-[11px] text-white/40 mr-0.5">₹</span>
                  <NumberFlow
                    value={plan.price.monthly}
                    className="text-2xl font-black text-white"
                  />
                  <span className="text-[11px] text-white/35 ml-1">
                    {plan.priceSuffix || "/mo"}
                  </span>
                </div>
              </div>
              {plan.description && (
                <p className="text-[11px] text-white/35 mt-1.5 leading-relaxed">{plan.description}</p>
              )}
            </button>
          )
        })}
      </div>

      {/* Feature table */}
      <div
        className="rounded-xl overflow-hidden mb-6"
        style={{ border: "1px solid rgba(255,255,255,0.07)" }}
      >
        {/* Table header */}
        <div
          className="flex items-center px-4 py-3"
          style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex-1 text-[10px] uppercase tracking-widest text-white/30 font-bold">Feature</div>
          <div className="flex items-center gap-6">
            {plans.map((plan) => (
              <div
                key={plan.level}
                className="w-16 text-center text-[10px] uppercase tracking-widest font-bold"
                style={{ color: selectedPlan === plan.level ? accentColor : "rgba(255,255,255,0.3)" }}
              >
                {plan.name}
              </div>
            ))}
          </div>
        </div>

        {/* Rows */}
        {features.map((feature, i) => (
          <div
            key={feature.name}
            className="flex items-center px-4 py-3 transition-colors duration-150"
            style={{
              background: i % 2 === 0 ? "rgba(255,255,255,0.015)" : "transparent",
              borderBottom: i < features.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
            }}
          >
            <div className="flex-1 text-[13px] text-white/60">{feature.name}</div>
            <div className="flex items-center gap-6">
              {plans.map((plan) => (
                <div key={plan.level} className="w-16 flex justify-center">
                  {shouldShowCheck(feature.included, plan.level) ? (
                    <CheckIcon
                      className="w-4 h-4"
                      style={{ color: plan.level === selectedPlan ? accentColor : "rgba(255,255,255,0.25)" }}
                    />
                  ) : (
                    <span className="text-white/15 text-sm">—</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="p-6 md:px-8 bg-[#1a1a1a]/50 border-t border-white/5 rounded-b-[24px]">
        <button
          className="w-full flex items-center justify-center gap-2 font-bold text-sm h-12 rounded-xl transition-all duration-300 group hover:-translate-y-0.5"
          style={{
            background: accentColor,
            color: "#1C1C1E",
            boxShadow: `0 8px 25px ${accentColor}40`,
          }}
          onClick={() => {
            const plan = plans.find(p => p.level === selectedPlan)
            if (onGetStarted && plan) onGetStarted(plan, isYearly)
          }}
        >
          Get started — {plans.find((p) => p.level === selectedPlan)?.name}
          <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  )
}

/* ── PricingModal ───────────────────────────────────────────── */

interface PricingModalProps {
  open: boolean
  onClose: () => void
  title: string
  subtitle: string
  accentColor: string
  features: PricingFeature[]
  plans: PricingPlan[]
  onGetStarted?: (plan: PlanLevel) => void
}

export function PricingModal({
  open,
  onClose,
  title,
  subtitle,
  accentColor,
  features,
  plans,
  onGetStarted,
}: PricingModalProps) {
  // close on Escape
  React.useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [open, onClose])

  // lock body scroll
  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[1100] flex items-end sm:items-center justify-center p-0 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/75 backdrop-blur-md"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Sheet */}
          <motion.div
            className="relative w-full sm:max-w-2xl max-h-[92dvh] overflow-y-auto rounded-t-[28px] sm:rounded-[24px] z-10"
            style={{
              background: "#18181a",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 40px 100px rgba(0,0,0,0.8)",
            }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
          >
            {/* Drag handle (mobile) */}
            <div className="flex justify-center pt-3 pb-1 sm:hidden">
              <div className="w-10 h-1 rounded-full bg-white/15" />
            </div>

            {/* Header */}
            <div
              className="sticky top-0 z-20 flex items-center justify-between px-6 py-4"
              style={{ background: "#18181a", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div>
                <p
                  className="text-[10px] font-black uppercase tracking-widest mb-0.5"
                  style={{ color: accentColor }}
                >
                  {subtitle}
                </p>
                <h3 className="font-black text-white text-[1rem] leading-tight">{title}</h3>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white/40 hover:text-white transition-colors"
                style={{ background: "rgba(255,255,255,0.06)" }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="px-5 sm:px-6 py-6">
              <PricingTable
                features={features}
                plans={plans}
                accentColor={accentColor}
                onGetStarted={onGetStarted}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
