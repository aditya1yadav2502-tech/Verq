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
    e.preventDefault() // prevent navigating to profile
    if (!email) return
    
    // Optimistic update
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
      // Revert on failure
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
    if (score >= 70) return "text-[#0A7250] bg-[#E4F4EE]"
    if (score >= 40) return "text-[#0F52BA] bg-[#E8EFFE]"
    return "text-[#D97706] bg-[#FEF3C7]"
  }

  function getBarColor(score: number) {
    if (score >= 70) return "bg-[#0A7250]"
    if (score >= 40) return "bg-[#0F52BA]"
    return "bg-[#D97706]"
  }

  return (
    <main className="min-h-screen bg-[#F6F5F1] pt-14">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-8">
          <p className="text-xs font-mono text-[#0F52BA] bg-[#E8EFFE] px-3 py-1 rounded-full inline-block mb-4">
            For companies
          </p>
          <h1 className="font-serif text-4xl text-[#0E0E0C] mb-2">Explore builders</h1>
          <p className="text-sm text-[#6A6A66]">
            Discover verified student developers. Filter by score, college, or specific skill dimensions.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white border border-black/10 rounded-2xl p-4 sm:p-5 shadow-sm mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-xs font-medium text-[#6A6A66] mb-1.5 uppercase tracking-wider">Search</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name or college"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F6F5F1] border border-black/10 rounded-lg pl-9 pr-3 py-2 text-sm text-[#0E0E0C] placeholder:text-[#9A9A95] outline-none focus:border-[#0F52BA] transition-colors"
              />
              <svg className="absolute left-3 top-2.5 w-4 h-4 text-[#9A9A95]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <div className="w-full sm:w-48">
            <label className="block text-xs font-medium text-[#6A6A66] mb-1.5 uppercase tracking-wider">Min Score</label>
            <select
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              className="w-full bg-[#F6F5F1] border border-black/10 rounded-lg px-3 py-2 text-sm text-[#0E0E0C] outline-none focus:border-[#0F52BA] transition-colors appearance-none"
            >
              <option value="0">All Scores</option>
              <option value="50">50+ Score</option>
              <option value="65">65+ Score</option>
              <option value="80">80+ Score</option>
            </select>
          </div>
          <div className="w-full sm:w-48">
            <label className="block text-xs font-medium text-[#6A6A66] mb-1.5 uppercase tracking-wider">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-[#F6F5F1] border border-black/10 rounded-lg px-3 py-2 text-sm text-[#0E0E0C] outline-none focus:border-[#0F52BA] transition-colors appearance-none"
            >
              <option value="overall">Overall Score</option>
              <option value="quality">Code Quality</option>
              <option value="complexity">Project Complexity</option>
            </select>
          </div>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="bg-white border border-black/10 rounded-2xl p-12 shadow-sm text-center">
            <p className="font-serif text-xl text-[#0E0E0C] mb-2">No builders found</p>
            <p className="text-sm text-[#6A6A66]">
              Try adjusting your search or filters to see more results.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStudents.map((student, index) => (
              <Link
                key={student.email || index}
                href={`/s/${encodeURIComponent(student.name)}`}
                className="bg-white border border-black/10 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-black/20 transition-all group"
              >
                <div className="flex items-start justify-between mb-4 relative">
                  {isCompany && student.email && (
                    <button 
                      onClick={(e) => toggleBookmark(e, student.email)}
                      className="absolute -top-3 -right-3 p-2 text-xl hover:scale-110 transition-transform z-10"
                      title={bookmarks.has(student.email) ? "Remove bookmark" : "Bookmark student"}
                    >
                      {bookmarks.has(student.email) ? "⭐" : "☆"}
                    </button>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#E8EFFE] rounded-full flex items-center justify-center">
                      <span className="font-serif text-base text-[#0F52BA] font-medium">
                        {student.name?.charAt(0).toUpperCase() || "?"}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#0E0E0C] group-hover:text-[#0F52BA] transition-colors truncate w-32">
                        {student.name}
                      </p>
                      <p className="text-xs text-[#9A9A95] truncate w-32">
                        {student.college || "—"}
                      </p>
                    </div>
                  </div>
                  <span className={`text-sm font-mono font-semibold px-2 py-0.5 rounded-full mt-1 ${getScoreColor(student.verq_score)}`}>
                    {student.verq_score}
                  </span>
                </div>

                {/* Mini score bars */}
                <div className="space-y-1.5">
                  {[
                    { label: "Code", score: student.score_code_quality },
                    { label: "Complexity", score: student.score_project_complexity },
                    { label: "Commits", score: student.score_commit_consistency },
                    { label: "Docs", score: student.score_documentation },
                    { label: "Deploy", score: student.score_deployment },
                  ].map((dim) => (
                    <div key={dim.label} className="flex items-center gap-2">
                      <span className="text-[10px] text-[#9A9A95] w-16 truncate">{dim.label}</span>
                      <div className="flex-1 h-1 bg-[#E2E1DC] rounded-full overflow-hidden">
                        <div
                          className={`h-1 rounded-full ${getBarColor(dim.score)}`}
                          style={{ width: `${dim.score}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-[#9A9A95] w-6 text-right">{dim.score}</span>
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
