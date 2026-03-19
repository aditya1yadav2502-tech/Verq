"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import PulseFeed from "@/components/PulseFeed"

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
  
  // Dummy filters for UI Mock
  const [activeStack, setActiveStack] = useState("All")
  const [activeAvailability, setActiveAvailability] = useState("All")

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
        return matchesSearch && matchesScore
      })
      .sort((a, b) => {
        if (sortBy === "overall") return b.verq_score - a.verq_score
        if (sortBy === "quality") return b.score_code_quality - a.score_code_quality
        if (sortBy === "complexity") return b.score_project_complexity - a.score_project_complexity
        return 0
      })
  }, [initialStudents, searchQuery, minScore, sortBy])

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

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative grid grid-cols-1 lg:grid-cols-[280px_1fr_320px] gap-8">
        
        {/* Decorative background blur */}
        <div className="absolute top-0 right-10 w-96 h-96 bg-[#0F52BA]/10 rounded-full filter blur-[100px] pointer-events-none" />

        {/* Left Sidebar: Filters */}
        <aside className="space-y-8 animate-slide-up sticky top-28 h-fit hidden lg:block">
          <div className="mb-4">
            <h1 className="font-serif text-3xl text-[#0E0E0C] font-bold tracking-tight">Terminal</h1>
            <p className="text-sm text-[#6A6A66] mt-2">Find elite verified builders</p>
          </div>

          <div className="space-y-6 bg-white/70 backdrop-blur-xl border border-black/5 rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div>
              <label className="block text-[10px] font-mono font-medium text-[#9A9A95] mb-2 uppercase tracking-widest pl-1">Search</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Name or college"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#FAFAFA] border border-black/5 rounded-2xl pl-10 pr-3 py-2.5 text-sm text-[#0E0E0C] placeholder:text-[#9A9A95] outline-none focus:ring-2 focus:ring-[#0F52BA]/20 focus:border-[#0F52BA]/30 transition-all hover:bg-white"
                />
                <svg className="absolute left-3 top-3 w-4 h-4 text-[#9A9A95]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono font-medium text-[#9A9A95] mb-2 uppercase tracking-widest pl-1">Tech Stack</label>
              <div className="flex flex-wrap gap-2">
                {["All", "React", "Python", "Rust", "Go", "Solidity"].map(stack => (
                  <button 
                    key={stack}
                    onClick={() => setActiveStack(stack)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      activeStack === stack 
                        ? "bg-[#0E0E0C] text-white shadow-md" 
                        : "bg-[#FAFAFA] text-[#6A6A66] border border-black/5 hover:bg-white hover:text-[#0E0E0C]"
                    }`}
                  >
                    {stack}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono font-medium text-[#9A9A95] mb-2 uppercase tracking-widest pl-1">Min Score</label>
              <select
                value={minScore}
                onChange={(e) => setMinScore(Number(e.target.value))}
                className="w-full bg-[#FAFAFA] border border-black/5 rounded-2xl px-3 py-2.5 text-sm text-[#0E0E0C] outline-none focus:ring-2 focus:ring-[#0F52BA]/20 focus:border-[#0F52BA]/30 transition-all hover:bg-white appearance-none cursor-pointer"
              >
                <option value="0">All Scores</option>
                <option value="50">50+ (Top 40%)</option>
                <option value="70">70+ (Top 15%)</option>
                <option value="90">90+ (Top 1%)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono font-medium text-[#9A9A95] mb-2 uppercase tracking-widest pl-1">Availability</label>
              <div className="flex flex-col gap-2">
                {["All", "Actively interviewing", "Open to roles", "Not looking"].map(avail => (
                  <button 
                    key={avail}
                    onClick={() => setActiveAvailability(avail)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all ${
                      activeAvailability === avail 
                        ? "bg-[#0A7250]/10 text-[#0A7250] font-semibold" 
                        : "text-[#6A6A66] hover:bg-black/5"
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${activeAvailability === avail ? 'bg-[#0A7250]' : 'bg-[#E2E1DC]'}`} />
                    {avail}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Middle Column: Results */}
        <section className="animate-slide-up relative z-10" style={{ animationDelay: '0.1s' }}>
          
          <div className="flex items-center justify-between mb-6 block lg:hidden">
            <h1 className="font-serif text-3xl text-[#0E0E0C] font-bold tracking-tight">Terminal</h1>
          </div>

          <div className="flex items-center justify-between mb-6">
            <p className="text-sm font-medium text-[#6A6A66]">
              Showing <span className="text-[#0E0E0C]">{filteredStudents.length}</span> verified builders
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
                      <div className="min-w-0">
                        <p className="text-base font-bold text-[#0E0E0C] group-hover:text-[#0F52BA] transition-colors truncate">
                          {student.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0A7250] animate-pulse"></span>
                          <p className="text-[11px] font-medium text-[#0A7250] truncate">
                            {getMockIntent(student.name)}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`text-sm font-mono font-bold px-2 py-1 rounded-lg border shadow-sm ${getScoreColor(student.verq_score)}`}>
                      {student.verq_score}
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

        {/* Right Sidebar: Pulse Feed */}
        <aside className="animate-slide-up sticky top-28 h-[600px] hidden lg:block" style={{ animationDelay: '0.2s' }}>
          <PulseFeed />
        </aside>

      </div>
    </main>
  )
}
