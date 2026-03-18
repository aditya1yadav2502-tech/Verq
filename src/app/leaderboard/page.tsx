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
    if (score >= 70) return "text-[#0A7250]"
    if (score >= 40) return "text-[#0F52BA]"
    return "text-[#D97706]"
  }

  function getBarColor(score: number) {
    if (score >= 70) return "bg-[#0A7250]"
    if (score >= 40) return "bg-[#0F52BA]"
    return "bg-[#D97706]"
  }

  return (
    <main className="min-h-screen bg-[#F6F5F1] pt-14">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <p className="text-xs font-mono text-[#0A7250] bg-[#E4F4EE] px-3 py-1 rounded-full inline-block mb-4">
            Live rankings
          </p>
          <h1 className="font-serif text-4xl text-[#0E0E0C] mb-2">Leaderboard</h1>
          <p className="text-sm text-[#6A6A66]">
            Top verified builders ranked by Verq score. Companies discover talent here.
          </p>
        </div>

        {!students || students.length === 0 ? (
          <div className="bg-white border border-black/10 rounded-2xl p-12 shadow-sm text-center">
            <p className="font-serif text-xl text-[#0E0E0C] mb-2">No scores yet</p>
            <p className="text-sm text-[#6A6A66] mb-4">
              Be the first to get your Verq score and appear on the leaderboard.
            </p>
            <Link
              href="/signup"
              className="inline-block bg-[#0F52BA] text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-[#0a45a0] transition-colors"
            >
              Get your score →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {students.map((student, index) => (
              <Link
                key={index}
                href={`/s/${encodeURIComponent(student.name)}`}
                className="block bg-white border border-black/10 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-black/20 transition-all group"
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                    {index < 3 ? (
                      <span className="text-2xl">{getRankBadge(index)}</span>
                    ) : (
                      <span className="font-mono text-sm text-[#9A9A95] font-medium">{getRankBadge(index)}</span>
                    )}
                  </div>

                  {/* Avatar */}
                  <div className="w-10 h-10 bg-[#E8EFFE] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-serif text-base text-[#0F52BA] font-medium">
                      {student.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#0E0E0C] group-hover:text-[#0F52BA] transition-colors truncate">
                      {student.name}
                    </p>
                    <p className="text-xs text-[#9A9A95] truncate">
                      {student.college || "College not set"}
                    </p>
                  </div>

                  {/* Score bar (mini) */}
                  <div className="hidden sm:flex items-center gap-2 w-32">
                    <div className="flex-1 h-1.5 bg-[#E2E1DC] rounded-full overflow-hidden">
                      <div
                        className={`h-1.5 rounded-full ${getBarColor(student.verq_score)}`}
                        style={{ width: `${student.verq_score}%` }}
                      />
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-right flex-shrink-0">
                    <span className={`font-serif text-2xl font-medium ${getScoreColor(student.verq_score)}`}>
                      {student.verq_score}
                    </span>
                    <p className="text-[10px] font-mono text-[#9A9A95] uppercase">Score</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
