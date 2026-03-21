"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import PulseFeed from "@/components/PulseFeed"
import FilterSidebar from "@/components/FilterSidebar"
import QuickViewModal from "@/components/QuickViewModal"
import PricingModal from "@/components/PricingModal"

type Student = {
  name: string
  email: string
  college: string
  github_url: string
  verq_score: number
  score_code_quality: number
  score_project_complexity: number
  score_commit_consistency: number
  score_documentation: number
  score_deployment: number
  languages?: { name: string; bytes: number }[]
  top_repos?: { name: string; description: string; url: string; stars: number; language: string }[]
}

const INTENT_SIGNALS = [
  "Actively interviewing",
  "Open to roles",
  "Looking for React roles",
  "Exploring ML roles",
  "Casual looking",
]

const getMockIntent = (name: string) => {
  if (!name) return INTENT_SIGNALS[1]
  return INTENT_SIGNALS[name.length % INTENT_SIGNALS.length]
}

export default function ExploreClient({ initialStudents }: { initialStudents: Student[] }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [minScore, setMinScore] = useState<number>(0)
  const [sortBy, setSortBy] = useState<"overall" | "quality" | "complexity">("overall")
  
  const [activeStack, setActiveStack] = useState("All")
  const [activeAvailability, setActiveAvailability] = useState("All")
  
  const [dimensionFilters, setDimensionFilters] = useState<Record<string, number>>({
    score_code_quality: 0,
    score_project_complexity: 0,
    score_commit_consistency: 0,
    score_documentation: 0,
    score_deployment: 0,
  })

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)
  const [isPricingOpen, setIsPricingOpen] = useState(false)

  const [isCompany, setIsCompany] = useState(false)
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetch("/api/bookmarks")
      .then(r => r.json())
      .then(data => {
        setIsCompany(data.isCompany)
        setBookmarks(new Set(data.emails))
      })
      .catch(console.error)
  }, [])

  function setDimensionFilter(key: string, val: number) {
    setDimensionFilters(prev => ({ ...prev, [key]: val }))
  }

  async function toggleBookmark(e: React.MouseEvent, email: string) {
    e.preventDefault() 
    if (!email) return
    
    const newBookmarks = new Set(bookmarks)
    if (newBookmarks.has(email)) newBookmarks.delete(email)
    else newBookmarks.add(email)
    setBookmarks(newBookmarks)

    const res = await fetch("/api/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ student_email: email })
    })
    
    if (!res.ok) {
      setBookmarks(bookmarks)
    }
  }

  const filteredStudents = useMemo(() => {
    return initialStudents
      .filter((s) => {
        const matchesSearch =
          s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.college?.toLowerCase().includes(searchQuery.toLowerCase())
        
        const matchesScore = s.verq_score >= minScore
        
        // Multi-dimension filtering
        const matchesDimensions = 
          s.score_code_quality >= dimensionFilters.score_code_quality &&
          s.score_project_complexity >= dimensionFilters.score_project_complexity &&
          s.score_commit_consistency >= dimensionFilters.score_commit_consistency &&
          s.score_documentation >= dimensionFilters.score_documentation &&
          s.score_deployment >= dimensionFilters.score_deployment

        const matchesStack = activeStack === "All" || 
          (s.languages && (s.languages as any[]).some(l => l.name.toLowerCase() === activeStack.toLowerCase())) ||
          (activeStack === "AI/ML" && (s.languages && (s.languages as any[]).some(l => ["python", "c++", "cuda"].includes(l.name.toLowerCase()))))

        const matchesAvail = activeAvailability === "All" || getMockIntent(s.name) === activeAvailability

        return matchesSearch && matchesScore && matchesDimensions && matchesStack && matchesAvail
      })
      .sort((a, b) => {
        if (sortBy === "overall") return b.verq_score - a.verq_score
        if (sortBy === "quality") return b.score_code_quality - a.score_code_quality
        if (sortBy === "complexity") return b.score_project_complexity - a.score_project_complexity
        return 0
      })
  }, [initialStudents, searchQuery, minScore, sortBy, dimensionFilters, activeStack, activeAvailability])

  function getScoreColor(score: number) {
    if (score >= 70) return "text-[#0A7250] bg-[#E4F4EE]/50 border-[#0A7250]/20"
    if (score >= 40) return "text-[#0F52BA] bg-[#E8EFFE]/80 border-[#0F52BA]/20"
    return "text-[#D97706] bg-[#FEF3C7]/60 border-[#D97706]/20"
  }

  function getBarColor(score: number) {
    if (score >= 70) return "bg-gradient-to-r from-[#0A7250] to-[#10b981]"
    if (score >= 40) return "bg-gradient-to-r from-[#0F52BA] to-[#3b82f6]"
    return "bg-gradient-to-r from-[#D97706] to-[#f59e0b]"
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA] pt-24 pb-20 selection:bg-[#0F52BA]/20">
      <Navbar />

      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 relative grid grid-cols-1 lg:grid-cols-[300px_1fr_340px] gap-10">
        
        {/* Decorative background blur */}
        <div className="absolute top-0 right-10 w-96 h-96 bg-[#0F52BA]/05 rounded-full filter blur-[100px] pointer-events-none" />

        {/* Left Sidebar: Advanced Filters */}
        <FilterSidebar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          minScore={minScore}
          setMinScore={setMinScore}
          activeStack={activeStack}
          setActiveStack={setActiveStack}
          activeAvailability={activeAvailability}
          setActiveAvailability={setActiveAvailability}
          dimensionFilters={dimensionFilters}
          setDimensionFilter={setDimensionFilter}
        />

        {/* Middle Column: Results */}
        <section className="animate-slide-up relative z-10" style={{ animationDelay: '0.1s' }}>
          
          <div className="flex items-center justify-between mb-6 block lg:hidden">
            <h1 className="font-serif text-3xl text-[#0E0E0C] font-bold tracking-tight">Terminal</h1>
          </div>

          <div className="flex items-center justify-between mb-6">
            <p className="text-sm font-medium text-[#6A6A66]">
              Showing <span className="text-[#0E0E0C]">{filteredStudents.length}</span> verified builder{filteredStudents.length !== 1 ? 's' : ''}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#9A9A95] uppercase tracking-widest font-mono">Sort By</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-sm font-semibold text-[#0E0E0C] outline-none cursor-pointer"
              >
                <option value="overall">Score</option>
                <option value="quality">Quality</option>
                <option value="complexity">Complexity</option>
              </select>
            </div>
          </div>

          {filteredStudents.length === 0 ? (
            <div className="bg-white border border-black/5 rounded-[2rem] p-16 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center">
              <div className="w-16 h-16 bg-[#FAFAFA] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="font-serif text-3xl text-[#9A9A95]">?</span>
              </div>
              <p className="font-serif text-2xl text-[#0E0E0C] font-bold mb-2">No builders found</p>
              <p className="text-[#6A6A66]">
                Try adjusting your search query or lowering the minimum score.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredStudents.map((student, index) => (
                <Link
                  key={student.email || index}
                  href={`/s/${encodeURIComponent(student.name)}`}
                  className="bg-white border border-black/5 rounded-3xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 hover:border-black/10 transition-all duration-300 group relative overflow-hidden flex flex-col h-full"
                >
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="flex items-start justify-between mb-4 relative">
                    {isCompany && student.email && (
                      <button 
                        onClick={(e) => toggleBookmark(e, student.email)}
                        className={`absolute -top-2 -right-2 p-2 rounded-full backdrop-blur-md transition-all z-20 ${
                          bookmarks.has(student.email) ? "bg-[#FEF3C7] shadow-sm scale-100" : "bg-white/50 hover:bg-black/5 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
                        }`}
                        title={bookmarks.has(student.email) ? "Remove shortlist" : "Shortlist builder"}
                      >
                        <span className="text-[14px] leading-none block transform group-active:scale-90 transition-transform">
                          {bookmarks.has(student.email) ? "⭐" : "☆"}
                        </span>
                      </button>
                    )}
                    
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#0F52BA] to-[#0A3D8F] rounded-2xl flex items-center justify-center shadow-inner flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                        <div className="w-[88%] h-[88%] bg-white rounded-xl flex items-center justify-center">
                          <span className="font-serif text-lg text-[#0F52BA] font-bold">
                            {student.name?.charAt(0).toUpperCase() || "?"}
                          </span>
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                           <p className="text-base font-bold text-[#0E0E0C] group-hover:text-[#0F52BA] transition-colors truncate">
                            {student.name}
                          </p>
                          <div className="flex gap-1" title="Industry Verified">
                             <div className="w-4 h-4 bg-[#0F52BA]/10 rounded-full flex items-center justify-center border border-[#0F52BA]/20">
                                <span className="text-[8px]">📹</span>
                             </div>
                             <div className="w-4 h-4 bg-[#0A7250]/10 rounded-full flex items-center justify-center border border-[#0A7250]/20">
                                <span className="text-[8px]">📱</span>
                             </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0A7250] animate-pulse"></span>
                          <p className="text-[11px] font-medium text-[#0A7250] truncate">
                            {getMockIntent(student.name)}
                          </p>
                        </div>
                      </div>

                      {/* Contact Blur Paywall */}
                      <div className="hidden sm:flex items-center gap-2 bg-[#FAFAFA] border border-black/5 rounded-xl px-3 py-1.5 relative group/blur cursor-pointer" onClick={() => setIsPricingOpen(true)}>
                         <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] rounded-xl z-10 flex items-center justify-center opacity-0 group-hover/blur:opacity-100 transition-opacity">
                            <span className="text-[9px] font-black uppercase text-[#0F52BA] tracking-widest bg-white shadow-sm px-2 py-0.5 rounded-md">Unlock Contact</span>
                         </div>
                         <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6A6A66" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                         <span className="text-xs font-mono text-[#6A6A66] blur-[4px] select-none">
                           hired@candidate.com
                         </span>
                         <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2.5" className="ml-1"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => toggleBookmark(e, student.email)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            bookmarks.has(student.email)
                              ? "bg-red-50 text-red-500 border border-red-200 shadow-sm"
                              : "bg-[#FAFAFA] text-[#6A6A66] border border-black/5 hover:bg-white hover:border-red-200 hover:text-red-500"
                          }`}
                          title="Save Profile - Notifies builder"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill={bookmarks.has(student.email) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                          <span className="hidden sm:inline-block tracking-wide">
                            {bookmarks.has(student.email) ? "Saved" : "Save"}
                          </span>
                        </button>
                        <div className={`text-sm font-mono font-bold px-2 py-1 rounded-lg border shadow-sm ${getScoreColor(student.verq_score)}`}>
                          {student.verq_score}
                        </div>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.preventDefault()
                          setSelectedStudent(student)
                          setIsQuickViewOpen(true)
                        }}
                        className="text-[10px] font-black uppercase tracking-widest text-[#6A6A66] hover:text-[#0F52BA] transition-colors bg-black/5 px-2 py-1 rounded-md"
                      >
                        Quick View
                      </button>
                    </div>
                  </div>

                  {/* College Context */}
                  {student.college && (
                    <div className="mb-4">
                       <p className="text-xs text-[#6A6A66] truncate flex items-center gap-1.5">
                         <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                         {student.college}
                       </p>
                    </div>
                  )}

                  {/* Mini score bars */}
                  <div className="mt-auto space-y-2 bg-[#FAFAFA] border border-black/5 rounded-2xl p-3 group-hover:bg-white transition-colors">
                    {[
                      { label: "Code", score: student.score_code_quality },
                      { label: "Complexity", score: student.score_project_complexity },
                      { label: "Commits", score: student.score_commit_consistency },
                    ].map((dim) => (
                      <div key={dim.label} className="flex items-center gap-3">
                        <span className="text-[9px] uppercase tracking-widest font-mono text-[#6A6A66] w-16 truncate">{dim.label}</span>
                        <div className="flex-1 h-1.5 bg-[#E2E1DC] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${getBarColor(dim.score)}`}
                            style={{ width: `${dim.score}%` }}
                          />
                        </div>
                        <span className="text-[9px] font-mono font-semibold text-[#9A9A95] w-5 text-right">{dim.score}</span>
                      </div>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Right Sidebar: Market Insights & Pulse */}
        <aside className="animate-slide-up sticky top-28 h-fit hidden lg:block space-y-8" style={{ animationDelay: '0.2s' }}>
          <PulseFeed />
        </aside>

      </div>

      {selectedStudent && (
        <QuickViewModal 
          isOpen={isQuickViewOpen}
          onClose={() => setIsQuickViewOpen(false)}
          student={selectedStudent}
          onUnlockContact={() => {
            setIsQuickViewOpen(false)
            setIsPricingOpen(true)
          }}
        />
      )}

      <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} />
    </main>
  )
}
