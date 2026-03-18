"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import Navbar from "@/components/Navbar"

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

export default function ExploreClient({ initialStudents }: { initialStudents: Student[] }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [minScore, setMinScore] = useState<number>(0)
  const [sortBy, setSortBy] = useState<"overall" | "quality" | "complexity">("overall")
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
        
        {/* Decorative background blur */}
        <div className="absolute top-0 right-10 w-96 h-96 bg-[#0F52BA]/10 rounded-full filter blur-[100px] pointer-events-none" />

        <div className="mb-10 animate-fade-in relative z-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 text-sm text-[#0F52BA] font-medium bg-[#0F52BA]/10 px-4 py-1.5 rounded-full border border-[#0F52BA]/20 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#0F52BA] animate-pulse"></span>
            For companies
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl text-[#0E0E0C] font-bold mb-3 tracking-tight">Explore builders</h1>
          <p className="text-lg text-[#6A6A66] max-w-2xl">
            Discover verified student developers. Filter by score, college, or specific skill dimensions.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white/70 backdrop-blur-xl border border-black/5 rounded-[2rem] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-10 flex flex-col sm:flex-row gap-5 animate-slide-up relative z-10">
          <div className="flex-1">
            <label className="block text-[10px] font-mono font-medium text-[#9A9A95] mb-2 uppercase tracking-widest pl-1">Search</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name or college"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#FAFAFA] border border-black/5 rounded-2xl pl-11 pr-4 py-3 text-sm text-[#0E0E0C] placeholder:text-[#9A9A95] outline-none focus:ring-2 focus:ring-[#0F52BA]/20 focus:border-[#0F52BA]/30 transition-all hover:bg-white inset-shadow-sm"
              />
              <svg className="absolute left-4 top-3.5 w-4 h-4 text-[#9A9A95]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <div className="w-full sm:w-56">
            <label className="block text-[10px] font-mono font-medium text-[#9A9A95] mb-2 uppercase tracking-widest pl-1">Min Score</label>
            <select
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              className="w-full bg-[#FAFAFA] border border-black/5 rounded-2xl px-4 py-3 text-sm text-[#0E0E0C] outline-none focus:ring-2 focus:ring-[#0F52BA]/20 focus:border-[#0F52BA]/30 transition-all hover:bg-white appearance-none cursor-pointer inset-shadow-sm"
            >
              <option value="0">All Scores</option>
              <option value="50">50+ Score</option>
              <option value="65">65+ Score</option>
              <option value="80">80+ Score</option>
            </select>
          </div>
          <div className="w-full sm:w-56">
            <label className="block text-[10px] font-mono font-medium text-[#9A9A95] mb-2 uppercase tracking-widest pl-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-[#FAFAFA] border border-black/5 rounded-2xl px-4 py-3 text-sm text-[#0E0E0C] outline-none focus:ring-2 focus:ring-[#0F52BA]/20 focus:border-[#0F52BA]/30 transition-all hover:bg-white appearance-none cursor-pointer inset-shadow-sm"
            >
              <option value="overall">Overall Score</option>
              <option value="quality">Code Quality</option>
              <option value="complexity">Project Complexity</option>
            </select>
          </div>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="bg-white border border-black/5 rounded-[2rem] p-16 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center animate-fade-in relative z-10">
            <div className="w-16 h-16 bg-[#F6F5F1] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="font-serif text-3xl text-[#9A9A95]">?</span>
            </div>
            <p className="font-serif text-2xl text-[#0E0E0C] font-bold mb-2">No builders found</p>
            <p className="text-[#6A6A66]">
              Try adjusting your search query or lowering the minimum score.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            {filteredStudents.map((student, index) => (
              <Link
                key={student.email || index}
                href={`/s/${encodeURIComponent(student.name)}`}
                className="bg-white border border-black/5 rounded-3xl p-6 sm:p-7 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 hover:border-black/10 transition-all duration-300 group relative overflow-hidden"
              >
                
                {/* Subtle top edge highlight */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex items-start justify-between mb-6 relative">
                  {isCompany && student.email && (
                    <button 
                      onClick={(e) => toggleBookmark(e, student.email)}
                      className={`absolute -top-2 -right-2 p-2.5 rounded-full backdrop-blur-md transition-all z-20 ${
                        bookmarks.has(student.email) ? "bg-[#FEF3C7] shadow-sm scale-100" : "bg-white/50 hover:bg-black/5 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
                      }`}
                      title={bookmarks.has(student.email) ? "Remove bookmark" : "Bookmark student"}
                    >
                      <span className="text-[18px] leading-none block transform group-active:scale-90 transition-transform">
                        {bookmarks.has(student.email) ? "⭐" : "☆"}
                      </span>
                    </button>
                  )}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#0F52BA] to-[#0A3D8F] rounded-2xl flex items-center justify-center shadow-inner flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                      <div className="w-[90%] h-[90%] bg-white rounded-xl flex items-center justify-center">
                        <span className="font-serif text-xl text-[#0F52BA] font-bold">
                          {student.name?.charAt(0).toUpperCase() || "?"}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-base font-bold text-[#0E0E0C] group-hover:text-[#0F52BA] transition-colors truncate w-36">
                        {student.name}
                      </p>
                      <p className="text-xs text-[#9A9A95] truncate w-36 mt-0.5">
                        {student.college || "—"}
                      </p>
                    </div>
                  </div>
                  <div className={`text-sm font-mono font-bold px-2.5 py-1 rounded-lg border shadow-sm ${getScoreColor(student.verq_score)}`}>
                    {student.verq_score}
                  </div>
                </div>

                {/* Mini score bars */}
                <div className="space-y-2.5 bg-[#FAFAFA] border border-black/5 rounded-2xl p-4 group-hover:bg-white transition-colors">
                  {[
                    { label: "Code", score: student.score_code_quality },
                    { label: "Complexity", score: student.score_project_complexity },
                    { label: "Commits", score: student.score_commit_consistency },
                    { label: "Docs", score: student.score_documentation },
                    { label: "Deploy", score: student.score_deployment },
                  ].map((dim) => (
                    <div key={dim.label} className="flex items-center gap-3">
                      <span className="text-[10px] font-medium text-[#6A6A66] w-16 truncate">{dim.label}</span>
                      <div className="flex-1 h-[6px] bg-[#E2E1DC] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${getBarColor(dim.score)}`}
                          style={{ width: `${dim.score}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono font-semibold text-[#9A9A95] w-6 text-right">{dim.score}</span>
                    </div>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
