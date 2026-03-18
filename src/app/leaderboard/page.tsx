import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import Navbar from "@/components/Navbar"

export const metadata = {
  title: "Leaderboard — Verq",
  description: "Top verified builders ranked by Verq score. Discover India's best student developers.",
}

export default async function LeaderboardPage() {
  const supabase = await createClient()

  const { data: students } = await supabase
    .from("students")
    .select("name, college, verq_score, score_code_quality, score_project_complexity, score_commit_consistency, score_documentation, score_deployment, github_url, scored_at")
    .not("verq_score", "is", null)
    .order("verq_score", { ascending: false })
    .limit(50)

  function getRankBadge(index: number) {
    if (index === 0) return "🥇"
    if (index === 1) return "🥈"
    if (index === 2) return "🥉"
    return `${index + 1}`
  }

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
    <main className="min-h-screen bg-[#FAFAFA] pt-24 pb-20 selection:bg-[#0F52BA]/20 relative overflow-hidden">
      <Navbar />

      {/* Decorative Orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#0F52BA]/5 rounded-full filter blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#0A7250]/5 rounded-full filter blur-[100px] pointer-events-none translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="mb-10 text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 text-sm text-[#0A7250] font-medium bg-[#0A7250]/10 px-4 py-1.5 rounded-full border border-[#0A7250]/20 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#0A7250] animate-pulse"></span>
            Live rankings
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl text-[#0E0E0C] font-bold mb-3 tracking-tight">Leaderboard</h1>
          <p className="text-lg text-[#6A6A66] max-w-xl mx-auto">
            Top verified builders ranked by Verq score. Companies discover talent here.
          </p>
        </div>

        {!students || students.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-xl border border-black/5 rounded-[2rem] p-16 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center animate-slide-up">
            <div className="w-16 h-16 bg-[#F6F5F1] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="font-serif text-3xl text-[#9A9A95]">?</span>
            </div>
            <p className="font-serif text-2xl text-[#0E0E0C] font-bold mb-2">No scores yet</p>
            <p className="text-[#6A6A66] mb-8 max-w-sm mx-auto">
              Be the first to get your Verq score and appear on the leaderboard.
            </p>
            <Link
              href="/signup"
              className="inline-block px-8 py-3.5 bg-[#0E0E0C] text-white text-sm font-semibold rounded-2xl shadow-[0_4px_14px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 transition-all"
            >
              Get your score
            </Link>
          </div>
        ) : (
          <div className="bg-white/70 backdrop-blur-xl border border-black/5 rounded-[2rem] p-4 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="space-y-3">
              {students.map((student, index) => (
                <Link
                  key={index}
                  href={`/s/${encodeURIComponent(student.name)}`}
                  className="flex items-center gap-4 sm:gap-6 bg-[#FAFAFA] border border-black/5 rounded-2xl p-4 sm:p-5 hover:bg-white hover:shadow-[0_4px_20px_rgb(0,0,0,0.05)] hover:border-black/10 hover:-translate-y-0.5 transition-all group"
                >
                  {/* Rank */}
                  <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                    {index < 3 ? (
                      <span className="text-2xl drop-shadow-sm">{getRankBadge(index)}</span>
                    ) : (
                      <span className="font-mono text-sm text-[#9A9A95] font-semibold">{getRankBadge(index)}</span>
                    )}
                  </div>

                  {/* Avatar */}
                  <div className="hidden sm:flex w-12 h-12 bg-gradient-to-br from-[#0F52BA] to-[#0A3D8F] rounded-2xl items-center justify-center flex-shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-300">
                    <div className="w-[85%] h-[85%] bg-white rounded-xl flex items-center justify-center">
                      <span className="font-serif text-lg text-[#0F52BA] font-bold">
                        {student.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-bold text-[#0E0E0C] group-hover:text-[#0F52BA] transition-colors truncate">
                      {student.name}
                    </p>
                    <p className="text-xs font-mono text-[#6A6A66] truncate mt-0.5">
                      {student.college || "College not set"}
                    </p>
                  </div>

                  {/* Score bar (mini) */}
                  <div className="hidden md:flex items-center gap-3 w-40">
                    <div className="flex-1 h-1.5 bg-[#E2E1DC] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${getBarColor(student.verq_score)}`}
                        style={{ width: `${student.verq_score}%` }}
                      />
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-right flex-shrink-0 pl-4 border-l border-black/5">
                    <div className={`text-xl sm:text-2xl font-serif font-bold ${getScoreColor(student.verq_score).split(' ')[0]} mb-0.5`}>
                      {student.verq_score}
                    </div>
                    <p className="text-[9px] font-mono font-semibold text-[#9A9A95] uppercase tracking-widest bg-black/5 px-2 py-0.5 rounded-full inline-block">Score</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
