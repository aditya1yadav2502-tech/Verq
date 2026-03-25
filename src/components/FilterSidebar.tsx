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
    { key: "score_code_quality", label: "Code Quality" },
    { key: "score_project_complexity", label: "Complexity" },
    { key: "score_commit_consistency", label: "Consistency" },
    { key: "score_documentation", label: "Docs" },
    { key: "score_deployment", label: "Deployment" },
  ]

  return (
    <aside className="space-y-8 animate-fade-in sticky top-28 h-fit hidden lg:block pb-10">
      <div className="mb-6 px-2">
        <h1 className="font-serif text-4xl text-white font-bold tracking-tighter">Verqify <span className="font-serif-italic italic text-brand-light">ATS</span></h1>
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-foreground/40 mt-2">Precision Talent Engine</p>
      </div>

      <div className="space-y-8 bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
        
        {/* Search */}
        <div className="group">
          <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-foreground/40 mb-3 ml-1 group-focus-within:text-brand-light transition-colors">Global Search</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Name, college, or keyword"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.02] border border-white/5 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder:text-foreground/30 outline-none focus:bg-white/[0.05] focus:border-brand/40 transition-all font-medium"
            />
            <svg className="absolute left-4 top-4 w-5 h-5 text-foreground/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Min Match Slider */}
        <div>
          <div className="flex items-center justify-between mb-4 px-1">
            <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-foreground/40">Min Skill Match</label>
            <span className="text-[10px] font-black text-brand-light bg-brand/10 px-2 py-0.5 rounded-md font-mono">{minScore}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={minScore}
            onChange={(e) => setMinScore(Number(e.target.value))}
            className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-brand hover:accent-brand-light transition-all"
          />
        </div>

        <div className="h-[1px] bg-white/5" />

        {/* Dimension Sliders */}
        <div className="space-y-6">
          <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-foreground/20 mb-2 px-1 text-center">NATIVE DIMENSIONS</label>
          {dimensions.map((dim) => (
            <div key={dim.key} className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-foreground/60">{dim.label}</span>
                <span className="text-[10px] font-black font-mono text-brand-light">{dimensionFilters[dim.key]}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="10"
                value={dimensionFilters[dim.key]}
                onChange={(e) => setDimensionFilter(dim.key, Number(e.target.value))}
                className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-brand transition-all opacity-70 hover:opacity-100"
              />
            </div>
          ))}
        </div>

        <div className="h-[1px] bg-white/5" />

        {/* Tech Stack */}
        <div>
          <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-foreground/40 mb-4 ml-1">Stack preference</label>
          <div className="flex flex-wrap gap-2">
            {["All", "React", "Node", "Python", "Rust", "Go", "Next.js", "AI/ML"].map(stack => (
              <button 
                key={stack}
                onClick={() => setActiveStack(stack)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeStack === stack 
                    ? "bg-brand text-background shadow-lg shadow-brand/20 scale-105" 
                    : "bg-white/5 text-foreground/40 border border-white/5 hover:bg-white/10 hover:text-white"
                }`}
              >
                {stack}
              </button>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div>
          <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-foreground/40 mb-4 ml-1">Recruitment Intent</label>
          <div className="flex flex-col gap-2">
            {[
              { id: "All", label: "Open Market", icon: "🌐" },
              { id: "Actively interviewing", label: "Hiring Priority", icon: "⚡" },
              { id: "Open to roles", label: "Passive Interest", icon: "🌱" },
            ].map(avail => (
              <button 
                key={avail.id}
                onClick={() => setActiveAvailability(avail.id)}
                className={`flex items-center gap-3 px-5 py-4 rounded-2xl text-xs font-bold transition-all group ${
                  activeAvailability === avail.id 
                    ? "bg-brand/10 text-brand-light ring-1 ring-brand/20" 
                    : "bg-white/[0.02] text-foreground/40 hover:bg-white/5"
                }`}
              >
                <span className="text-sm group-hover:scale-125 transition-transform">{avail.icon}</span>
                {avail.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Export Card */}
      <div className="bg-gradient-to-br from-brand to-[#00963F] rounded-[2.5rem] p-8 text-background shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full filter blur-3xl" />
        <h4 className="font-serif text-2xl font-bold mb-2 relative z-10 leading-tight">Export Signal</h4>
        <p className="text-background/70 text-xs mb-6 relative z-10 font-medium">Bulk export verified profiles directly to your internal ATS.</p>
        <button className="w-full py-3.5 bg-background text-brand rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-xl">
           Unlock Export Mode
        </button>
      </div>
    </aside>
  )
}

