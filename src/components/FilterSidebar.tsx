"use client"

import { useState } from "react"

interface FilterSidebarProps {
  searchQuery: string
  setSearchQuery: (v: string) => void
  minScore: number
  setMinScore: (v: number) => void
  activeStack: string
  setActiveStack: (v: string) => void
  activeAvailability: string
  setActiveAvailability: (v: string) => void
  dimensionFilters: Record<string, number>
  setDimensionFilter: (key: string, val: number) => void
}

export default function FilterSidebar({
  searchQuery,
  setSearchQuery,
  minScore,
  setMinScore,
  activeStack,
  setActiveStack,
  activeAvailability,
  setActiveAvailability,
  dimensionFilters,
  setDimensionFilter
}: FilterSidebarProps) {
  
  const dimensions = [
    { key: "score_code_quality", label: "Code Quality", color: "#0A7250" },
    { key: "score_project_complexity", label: "Complexity", color: "#0F52BA" },
    { key: "score_commit_consistency", label: "Commits", color: "#D97706" },
    { key: "score_documentation", label: "Documentation", color: "#7C3AED" },
    { key: "score_deployment", label: "Deployment", color: "#EC4899" },
  ]

  return (
    <aside className="space-y-8 animate-slide-up sticky top-28 h-fit hidden lg:block pb-10">
      <div className="mb-4">
        <h1 className="font-serif text-3xl text-[#0E0E0C] font-bold tracking-tight">Recruiter<span className="text-[#0F52BA]">HQ</span></h1>
        <p className="text-sm text-[#6A6A66] mt-2 font-medium italic">Precision talent acquisition engine.</p>
      </div>

      <div className="space-y-8 bg-white/70 backdrop-blur-3xl border border-black/5 rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.04)] ring-1 ring-black/[0.02]">
        
        {/* Search */}
        <div className="group">
          <label className="block text-[10px] font-black font-mono text-[#9A9A95] mb-3 uppercase tracking-[0.2em] pl-1 group-hover:text-[#0E0E0C] transition-colors">Global Search</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Name, college, or keyword"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAFAFA] border border-black/5 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-[#0E0E0C] placeholder:text-[#9A9A95] outline-none focus:bg-white focus:ring-4 focus:ring-[#0F52BA]/10 focus:border-[#0F52BA]/30 transition-all shadow-inner"
            />
            <svg className="absolute left-4 top-4 w-5 h-5 text-[#9A9A95]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Verqify Score Slider */}
        <div>
          <div className="flex items-center justify-between mb-3 pl-1">
            <label className="block text-[10px] font-black font-mono text-[#9A9A95] uppercase tracking-[0.2em]">Verqify Score</label>
            <span className="text-xs font-black text-[#0F52BA] bg-[#0F52BA]/5 px-2 py-0.5 rounded-md">{minScore}+</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={minScore}
            onChange={(e) => setMinScore(Number(e.target.value))}
            className="w-full h-1.5 bg-[#E2E1DC] rounded-full appearance-none cursor-pointer accent-[#0F52BA] hover:accent-[#0A3D8F] transition-all"
          />
          <div className="flex justify-between mt-2 px-1">
             <span className="text-[10px] font-mono text-[#9A9A95]">0</span>
             <span className="text-[10px] font-mono text-[#9A9A95]">100</span>
          </div>
        </div>

        <div className="h-[1px] bg-gradient-to-r from-transparent via-black/5 to-transparent" />

        {/* Dimension Sliders */}
        <div className="space-y-6">
          <label className="block text-[10px] font-black font-mono text-[#9A9A95] mb-1 uppercase tracking-[0.2em] pl-1 text-center">Dimension Filters</label>
          {dimensions.map((dim) => (
            <div key={dim.key} className="space-y-2">
              <div className="flex items-center justify-between pl-1">
                <span className="text-[11px] font-bold text-[#6A6A66]">{dim.label}</span>
                <span className="text-[10px] font-black font-mono text-[#0E0E0C]">{dimensionFilters[dim.key]}+</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="10"
                value={dimensionFilters[dim.key]}
                onChange={(e) => setDimensionFilter(dim.key, Number(e.target.value))}
                style={{ '--accent-color': dim.color } as any}
                className="w-full h-1 bg-[#E2E1DC] rounded-full appearance-none cursor-pointer accent-[var(--accent-color)] transition-all opacity-80 hover:opacity-100"
              />
            </div>
          ))}
        </div>

        <div className="h-[1px] bg-gradient-to-r from-transparent via-black/5 to-transparent" />

        {/* Tech Stack */}
        <div>
          <label className="block text-[10px] font-black font-mono text-[#9A9A95] mb-4 uppercase tracking-[0.2em] pl-1">Technology Stack</label>
          <div className="flex flex-wrap gap-2">
            {["All", "React", "Node", "Python", "Rust", "Go", "Next.js", "AI/ML"].map(stack => (
              <button 
                key={stack}
                onClick={() => setActiveStack(stack)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeStack === stack 
                    ? "bg-[#0E0E0C] text-white shadow-xl scale-105" 
                    : "bg-[#FAFAFA] text-[#6A6A66] border border-black/5 hover:bg-white hover:text-[#0E0E0C] hover:shadow-md"
                }`}
              >
                {stack}
              </button>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div>
          <label className="block text-[10px] font-black font-mono text-[#9A9A95] mb-4 uppercase tracking-[0.2em] pl-1">Intent Signal</label>
          <div className="flex flex-col gap-2">
            {[
              { id: "All", label: "All Candidates", icon: "🌐" },
              { id: "Actively interviewing", label: "Interviewing Now", icon: "⚡" },
              { id: "Open to roles", label: "Passively Open", icon: "🌱" },
            ].map(avail => (
              <button 
                key={avail.id}
                onClick={() => setActiveAvailability(avail.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-medium transition-all group ${
                  activeAvailability === avail.id 
                    ? "bg-[#0A7250]/10 text-[#0A7250] shadow-sm ring-1 ring-[#0A7250]/20" 
                    : "text-[#6A6A66] hover:bg-black/5"
                }`}
              >
                <span className="text-base group-hover:scale-125 transition-transform">{avail.icon}</span>
                {avail.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Teaser */}
      <div className="bg-gradient-to-br from-[#0F52BA] to-[#0A3D8F] rounded-[2rem] p-6 text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full filter blur-3xl group-hover:bg-white/20 transition-all" />
        <h4 className="font-serif text-lg font-bold mb-2 relative z-10">Export Talent</h4>
        <p className="text-white/70 text-xs mb-4 relative z-10 font-medium">Bulk export verified candidate profiles directly to your ATS.</p>
        <button className="w-full py-2 bg-white text-[#0F52BA] rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg">
          Growth Tier (₹15K)
        </button>
      </div>
    </aside>
  )
}
