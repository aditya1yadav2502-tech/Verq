"use client"

import { useMemo } from "react"

interface SalaryMapProps {
  score: number
}

export default function SalaryMap({ score }: SalaryMapProps) {
  const salaryRange = useMemo(() => {
    if (score >= 95) return { min: "₹35L", max: "₹55L+", label: "Elite Tier" }
    if (score >= 85) return { min: "₹22L", max: "₹35L", label: "Product Tier" }
    if (score >= 70) return { min: "₹12L", max: "₹22L", label: "Core Tier" }
    if (score >= 50) return { min: "₹6L", max: "₹12L", label: "Base Tier" }
    return { min: "₹3L", max: "₹6L", label: "Niche Tier" }
  }, [score])

  const progress = Math.min(100, Math.max(0, (score / 100) * 100))

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-black/5 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h4 className="text-[10px] font-black font-mono text-[#9A9A95] uppercase tracking-[0.2em] mb-1">Score-to-Salary Map</h4>
          <p className="text-xl font-serif font-black text-[#0E0E0C]">Market Value Indicator</p>
        </div>
        <div className="w-12 h-12 bg-[#0F52BA]/10 rounded-2xl flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">
          📊
        </div>
      </div>

      <div className="relative h-24 flex items-end gap-1 mb-6">
        {[...Array(20)].map((_, i) => {
          const isActive = (i / 20) * 100 <= progress
          const height = 20 + (((i * 13) % 10) / 10) * 60 + (i * 2) 
          return (
            <div 
              key={i} 
              className={`flex-1 rounded-t-lg transition-all duration-500 ${
                isActive 
                  ? "bg-gradient-to-t from-[#0F52BA] to-[#0A3D8F] shadow-[0_0_15px_rgba(15,82,186,0.3)] scale-y-100" 
                  : "bg-[#E2E1DC] opacity-30 scale-y-75"
              }`}
              style={{ height: `${isActive ? height : 20}%` }}
            />
          )
        })}
        {/* Glow indicator at current score */}
        <div 
          className="absolute top-0 w-1 h-full bg-[#0F52BA] blur-[2px] transition-all duration-1000"
          style={{ left: `${progress}%` }}
        />
        <div 
           className="absolute -top-8 bg-[#0E0E0C] text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-lg transition-all duration-1000 transform -translate-x-1/2"
           style={{ left: `${progress}%` }}
        >
          {score}%
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#FAFAFA] border border-black/5 rounded-2xl p-4 group-hover:bg-white transition-colors">
          <p className="text-[9px] font-mono font-black text-[#9A9A95] uppercase tracking-widest mb-1">Benchmarked CTC</p>
          <p className="text-2xl font-serif font-black text-[#0A7250]">{salaryRange.min} - {salaryRange.max}</p>
        </div>
        <div className="bg-[#FAFAFA] border border-black/5 rounded-2xl p-4 group-hover:bg-white transition-colors">
          <p className="text-[9px] font-mono font-black text-[#9A9A95] uppercase tracking-widest mb-1">Talent Bracket</p>
          <p className="text-lg font-bold text-[#0E0E0C] mt-1 pr-2 truncate">{salaryRange.label}</p>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2 text-[10px] font-medium text-[#6A6A66] bg-[#0E0E0C]/5 px-3 py-2 rounded-xl border border-black/[0.03]">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-[#0F52BA]">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        Data verified against Bangalore & Gurgaon tier-1 benchmarks.
      </div>
    </div>
  )
}
