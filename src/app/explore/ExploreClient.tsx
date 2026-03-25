"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import PulseFeed from "@/components/PulseFeed"
import FilterSidebar from "@/components/FilterSidebar"
import QuickViewModal from "@/components/QuickViewModal"
import PricingModal from "@/components/PricingModal"
import { getSkillFingerprint } from "@/lib/scoring"

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

const getMockIntent = (name: string) => {
  const intents = ["Actively interviewing", "Open to roles", "Exploring ML roles", "Hiring Priority"]
  if (!name) return intents[1]
  return intents[name.length % intents.length]
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
    
    if (!res.ok) setBookmarks(bookmarks)
  }

  const filteredStudents = useMemo(() => {
    return initialStudents
      .filter((s) => {
        const matchesSearch =
          s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.college?.toLowerCase().includes(searchQuery.toLowerCase())
        
        const matchesScore = s.verq_score >= minScore
        
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

  return (
    <main className="min-h-screen bg-background pt-32 pb-20 selection:bg-brand/20 bg-grain relative">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[20%] right-[10%] w-[600px] h-[600px] bg-brand/5 rounded-full filter blur-[150px] animate-pulse-slow" />
        <div className="absolute bottom-[20%] left-[10%] w-[500px] h-[500px] bg-white/5 rounded-full filter blur-[150px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <Navbar />

      <div className="max-w-[1600px] mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-[320px_1fr_360px] gap-12">
        
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

        {/* Results */}
        <section className="animate-fade-in-up relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-baseline gap-4">
               <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white text-shine">Verified Builders</h2>
               <span className="text-[10px] font-black uppercase tracking-widest text-foreground-muted">{filteredStudents.length} Native Signals</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[10px] text-foreground-muted uppercase tracking-[0.2em] font-black">Optimization</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent border border-white/10 rounded-full px-4 py-1.5 text-xs font-bold text-white outline-none cursor-pointer hover:bg-white/10 transition-colors backdrop-blur-md shadow-sm focus:border-brand/50 focus:ring-1 focus:ring-brand/50"
              >
                <option className="bg-[#0A0A0A]" value="overall">Verq Score</option>
                <option className="bg-[#0A0A0A]" value="quality">Quality</option>
                <option className="bg-[#0A0A0A]" value="complexity">Complexity</option>
              </select>
            </div>
          </div>

          {filteredStudents.length === 0 ? (
            <div className="glass-card rounded-[3rem] p-20 text-center border-dashed border-white/20">
              <span className="font-serif text-6xl text-brand-light italic mb-6 block text-shine opacity-50">?</span>
              <p className="font-serif text-3xl text-white font-bold mb-4 tracking-tight">No Signal Found</p>
              <p className="text-foreground-muted max-w-sm mx-auto font-medium">
                No builders match your current intensity filters. Try broadening your parameters across the dimensions.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredStudents.map((student, index) => (
                <Link
                  key={student.email || index}
                  href={`/s/${encodeURIComponent(student.name)}`}
                  className="glass-card rounded-[2.5rem] p-8 hover:bg-white/[0.04] hover:-translate-y-1 hover:border-brand/30 transition-all duration-500 group relative overflow-hidden flex flex-col h-full shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_50px_rgba(0,230,91,0.15)]"
                >
                  <div className="absolute top-0 right-0 w-48 h-48 bg-brand/5 rounded-full filter blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                  
                  <div className="flex items-start justify-between mb-8 relative z-10">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 bg-white rounded-[1.25rem] flex items-center justify-center font-serif text-4xl text-background font-black italic shadow-inner group-hover:scale-105 group-hover:-rotate-3 transition-transform duration-500">
                        {student.name?.charAt(0).toUpperCase() || "?"}
                      </div>
                      <div>
                        <h3 className="font-serif text-2xl font-bold text-white group-hover:text-brand-light transition-colors tracking-tight">{student.name}</h3>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse shadow-[0_0_8px_rgba(0,230,91,0.8)]"></span>
                          <span className="text-[10px] font-black font-mono uppercase tracking-[0.2em] text-foreground-muted">{getMockIntent(student.name)}</span>
                        </div>
                      </div>
                    </div>
                    {isCompany && student.email && (
                      <button 
                        onClick={(e) => toggleBookmark(e, student.email)}
                        className={`p-2 rounded-full transition-all ${bookmarks.has(student.email) ? "text-brand" : "text-white/20 hover:text-brand-light hover:bg-brand/10"}`}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill={bookmarks.has(student.email) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                      </button>
                    )}
                  </div>

                  <div className="mb-6 space-y-4 relative z-10">
                    <p className="text-[10px] font-black font-mono uppercase tracking-[0.25em] text-foreground-muted mb-2 group-hover:text-white transition-colors">Skill Fingerprint</p>
                    {[
                      { l: "Quality", v: student.score_code_quality },
                      { l: "Complexity", v: student.score_project_complexity },
                      { l: "Commits", v: student.score_commit_consistency },
                    ].map(d => (
                      <div key={d.l} className="group/bar">
                        <div className="flex justify-between items-baseline mb-1.5">
                          <span className="text-[10px] font-bold text-foreground-muted group-hover/bar:text-white">{d.l}</span>
                          <span className="text-[10px] font-black text-brand-light font-mono group-hover/bar:scale-110 transition-transform">{d.v}%</span>
                        </div>
                        <div className="h-1.5 bg-black/40 shadow-inner rounded-full overflow-hidden">
                          <div className="h-full bg-brand shadow-[0_0_8px_rgba(0,230,91,0.5)] transition-all duration-1000 ease-out" style={{ width: `${d.v}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto pt-6 border-t border-white/10 relative z-10 flex items-center justify-between">
                    <p className="text-[11px] font-medium text-foreground-muted leading-relaxed italic line-clamp-2 pr-4">
                      "{getSkillFingerprint({
                        code_quality: student.score_code_quality || 0,
                        project_complexity: student.score_project_complexity || 0,
                        commit_consistency: student.score_commit_consistency || 0,
                        documentation: student.score_documentation || 0,
                        deployment: student.score_deployment || 0
                      })}"
                    </p>
                    <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-brand/20 group-hover:border-brand/40 transition-colors">
                       <span className="text-white text-xs font-bold group-hover:text-brand-light transition-colors group-hover:translate-x-0.5 transform duration-300">↗</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Pulse */}
        <aside className="animate-fade-in-up sticky top-28 h-fit hidden lg:block" style={{ animationDelay: '0.2s' }}>
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

