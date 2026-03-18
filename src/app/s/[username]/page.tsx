import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import BookmarkButton from "@/components/BookmarkButton"

interface PageProps {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { username } = await params
  const name = decodeURIComponent(username).trim()
  return {
    title: `${name} — Verq Profile`,
    description: `View ${name}'s verified builder profile and Verq score.`,
  }
}

export default async function StudentProfile({ params }: PageProps) {
  const { username } = await params
  const name = decodeURIComponent(username).trim()

  const supabase = await createClient()

  // Direct query by name instead of full table scan
  const { data: student } = await supabase
    .from("students")
    .select("name, email, college, github_url, verq_score, score_code_quality, score_project_complexity, score_commit_consistency, score_documentation, score_deployment, scored_at, top_repos, languages")
    .ilike("name", name)
    .single()

  if (!student) {
    return (
      <main className="min-h-screen bg-[#F6F5F1] pt-14">
        <Navbar />
        <div className="flex items-center justify-center" style={{ minHeight: "calc(100vh - 56px)" }}>
          <div className="text-center">
            <div className="font-serif text-6xl text-[#E2E1DC] mb-4">?</div>
            <p className="font-serif text-2xl text-[#0E0E0C] mb-2">Student not found</p>
            <p className="text-sm text-[#6A6A66] mb-6">This profile does not exist yet.</p>
            <Link
              href="/leaderboard"
              className="inline-block bg-[#0F52BA] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#0a45a0] transition-colors"
            >
              Browse leaderboard
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const isScored = student.verq_score !== null && student.verq_score !== undefined

  const dimensions = [
    { label: "Code quality", score: student.score_code_quality },
    { label: "Project complexity", score: student.score_project_complexity },
    { label: "Commit consistency", score: student.score_commit_consistency },
    { label: "Documentation", score: student.score_documentation },
    { label: "Deployment", score: student.score_deployment },
  ]

  function getScoreColor(score: number | null): string {
    if (score === null || score === undefined) return "bg-[#E2E1DC]"
    if (score >= 70) return "bg-[#0A7250]"
    if (score >= 40) return "bg-[#0F52BA]"
    return "bg-[#D97706]"
  }

  return (
    <main className="min-h-screen bg-[#F6F5F1] pt-14">
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 py-12">

        <div className="bg-white border border-black/10 rounded-2xl p-6 sm:p-8 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#E8EFFE] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="font-serif text-2xl text-[#0F52BA] font-medium">
                  {student.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="font-serif text-2xl text-[#0E0E0C] mb-1">
                  {student.name}
                </h1>
                <p className="text-sm text-[#6A6A66]">
                  {student.college || "College not set"}
                </p>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <div className="font-serif text-4xl text-[#0E0E0C] leading-none mb-1">
                {isScored ? student.verq_score : "--"}
              </div>
              <div className="text-xs text-[#9A9A95] font-mono">Verq Score</div>
              {isScored ? (
                <div className="text-xs bg-[#E4F4EE] text-[#0A7250] px-2 py-0.5 rounded-full font-mono mt-1 inline-block">
                  Verified ✓
                </div>
              ) : (
                <div className="text-xs bg-[#FEF3C7] text-[#D97706] px-2 py-0.5 rounded-full font-mono mt-1 inline-block">
                  Pending verification
                </div>
              )}
              {student.email && <BookmarkButton studentEmail={student.email} />}
            </div>
          </div>

          <div className="border-t border-black/6 pt-6">
            <p className="text-xs font-mono text-[#9A9A95] uppercase tracking-wider mb-3">
              Details
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-[#9A9A95] mb-1">Email</p>
                <p className="text-sm text-[#0E0E0C]">{student.email}</p>
              </div>
              <div>
                <p className="text-xs text-[#9A9A95] mb-1">College</p>
                <p className="text-sm text-[#0E0E0C]">{student.college || "Not set"}</p>
              </div>
              {student.github_url && (
                <div className="col-span-1 sm:col-span-2">
                  <p className="text-xs text-[#9A9A95] mb-1">GitHub</p>
                  <a href={student.github_url} target="_blank" rel="noopener noreferrer" className="text-sm text-[#0F52BA] hover:underline break-all">
                    {student.github_url}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Top Languages */}
          {student.languages && student.languages.length > 0 && (
            <div className="border-t border-black/6 pt-6 mt-6">
              <p className="text-xs font-mono text-[#9A9A95] uppercase tracking-wider mb-4">
                Top Languages
              </p>
              <div className="flex flex-wrap gap-2">
                {(student.languages as { name: string; bytes: number }[]).slice(0, 5).map((lang) => (
                  <div key={lang.name} className="flex items-center gap-1.5 bg-[#F6F5F1] border border-black/10 px-2.5 py-1 rounded-md">
                    <div className="w-2 h-2 rounded-full bg-[#0F52BA]" />
                    <span className="text-xs font-medium text-[#0E0E0C]">{lang.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top Repositories */}
          {student.top_repos && student.top_repos.length > 0 && (
            <div className="border-t border-black/6 pt-6 mt-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-mono text-[#9A9A95] uppercase tracking-wider">
                  Top Repositories
                </p>
                <a href={student.github_url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#0F52BA] hover:underline">
                  View all GitHub →
                </a>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {(student.top_repos as { name: string; description: string; url: string; stars: number; language: string }[]).map((repo) => (
                  <a
                    key={repo.name}
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 border border-black/10 rounded-xl hover:border-black/20 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <p className="text-sm font-semibold text-[#0E0E0C] group-hover:text-[#0F52BA] transition-colors">{repo.name}</p>
                      {repo.stars > 0 && (
                        <div className="flex items-center gap-1 text-xs text-[#6A6A66]">
                          <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
                          </svg>
                          <span>{repo.stars}</span>
                        </div>
                      )}
                    </div>
                    {repo.description && (
                      <p className="text-xs text-[#6A6A66] mb-3 line-clamp-2">{repo.description}</p>
                    )}
                    {repo.language && (
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-[#0E0E0C]" />
                        <span className="text-[10px] uppercase font-mono text-[#9A9A95]">{repo.language}</span>
                      </div>
                    )}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white border border-black/10 rounded-2xl p-6 shadow-sm">
          <p className="text-xs font-mono text-[#9A9A95] uppercase tracking-wider mb-4">
            Verq Score Breakdown
          </p>
          {dimensions.map((dim) => (
            <div key={dim.label} className="flex items-center gap-3 mb-3">
              <span className="text-sm text-[#6A6A66] w-40">{dim.label}</span>
              <div className="flex-1 h-1.5 bg-[#E2E1DC] rounded-full overflow-hidden">
                <div
                  className={`h-1.5 rounded-full transition-all duration-500 ${getScoreColor(dim.score)}`}
                  style={{ width: isScored ? `${dim.score}%` : "0%" }}
                />
              </div>
              <span className="text-xs font-mono text-[#9A9A95] w-8 text-right">
                {isScored ? dim.score : "--"}
              </span>
            </div>
          ))}
          {isScored && student.scored_at && (
            <p className="text-xs text-[#9A9A95] mt-4">
              Last scored {new Date(student.scored_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </p>
          )}
          {!isScored && (
            <p className="text-xs text-[#9A9A95] mt-4">
              Score will appear after GitHub verification is complete.
            </p>
          )}
        </div>

      </div>
    </main>
  )
}