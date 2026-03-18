import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import SignOutButton from "@/components/SignOutButton"
import RescoreButton from "@/components/RescoreButton"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/signin")
  }

  const userName = user.user_metadata?.name || user.email?.split("@")[0] || "Builder"

  // Fetch student record
  const { data: student } = await supabase
    .from("students")
    .select("*")
    .eq("email", user.email)
    .single()

  const isScored = student?.verq_score !== null && student?.verq_score !== undefined

  const dimensions = [
    { label: "Code quality", score: student?.score_code_quality },
    { label: "Project complexity", score: student?.score_project_complexity },
    { label: "Commit consistency", score: student?.score_commit_consistency },
    { label: "Documentation", score: student?.score_documentation },
    { label: "Deployment", score: student?.score_deployment },
  ]

  function getScoreColor(score: number | null | undefined): string {
    if (score === null || score === undefined) return "bg-[#E2E1DC]"
    if (score >= 70) return "bg-[#0A7250]"
    if (score >= 40) return "bg-[#0F52BA]"
    return "bg-[#D97706]"
  }

  function getGrade(score: number): string {
    if (score >= 80) return "A"
    if (score >= 60) return "B"
    if (score >= 40) return "C"
    return "D"
  }

  return (
    <main className="min-h-screen bg-[#F6F5F1]">

      <nav className="flex items-center justify-between px-8 h-14 bg-[#F6F5F1]/90 backdrop-blur-sm border-b border-black/10">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#0F52BA] rounded-lg flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M3 13L8 3L13 13" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 9.5H11" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-serif text-lg font-medium text-[#0E0E0C]">verq</span>
        </Link>
        <div className="flex items-center gap-3">
          {student?.name && (
            <Link
              href={`/s/${encodeURIComponent(student.name)}`}
              className="text-sm text-[#6A6A66] hover:text-[#0E0E0C] transition-colors px-3 py-1.5"
            >
              Public profile
            </Link>
          )}
          <SignOutButton />
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">

        <div className="mb-8">
          <h1 className="font-serif text-3xl text-[#0E0E0C] mb-1">
            Hey, {userName} 👋
          </h1>
          <p className="text-sm text-[#6A6A66]">
            Here&apos;s your Verq dashboard.
          </p>
        </div>

        {!student ? (
          <div className="bg-white border border-black/10 rounded-2xl p-8 shadow-sm text-center">
            <p className="font-serif text-xl text-[#0E0E0C] mb-2">Profile not found</p>
            <p className="text-sm text-[#6A6A66] mb-4">
              We couldn&apos;t find a student profile for your account. This might happen if you signed up with a different email.
            </p>
          </div>
        ) : (
          <>
            {/* Score card */}
            <div className="bg-white border border-black/10 rounded-2xl p-8 shadow-sm mb-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-[#E8EFFE] rounded-full flex items-center justify-center">
                    <span className="font-serif text-2xl text-[#0F52BA] font-medium">
                      {userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h2 className="font-serif text-2xl text-[#0E0E0C] mb-1">{student.name}</h2>
                    <p className="text-sm text-[#6A6A66]">{student.college || student.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-serif text-5xl text-[#0E0E0C] leading-none mb-1">
                    {isScored ? student.verq_score : "--"}
                  </div>
                  <div className="text-xs text-[#9A9A95] font-mono">Verq Score</div>
                  {isScored ? (
                    <div className="text-xs bg-[#E4F4EE] text-[#0A7250] px-2 py-0.5 rounded-full font-mono mt-1 inline-block">
                      Grade {getGrade(student.verq_score)}
                    </div>
                  ) : (
                    <div className="text-xs bg-[#FEF3C7] text-[#D97706] px-2 py-0.5 rounded-full font-mono mt-1 inline-block">
                      Not scored yet
                    </div>
                  )}
                </div>
              </div>

              {/* Score breakdown */}
              <div className="border-t border-black/6 pt-6">
                <p className="text-xs font-mono text-[#9A9A95] uppercase tracking-wider mb-4">
                  Score breakdown
                </p>
                {dimensions.map((dim) => (
                  <div key={dim.label} className="flex items-center gap-3 mb-3">
                    <span className="text-sm text-[#6A6A66] w-40">{dim.label}</span>
                    <div className="flex-1 h-2 bg-[#E2E1DC] rounded-full overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-700 ${getScoreColor(dim.score)}`}
                        style={{ width: isScored ? `${dim.score}%` : "0%" }}
                      />
                    </div>
                    <span className="text-sm font-mono text-[#0E0E0C] w-8 text-right font-medium">
                      {isScored ? dim.score : "--"}
                    </span>
                  </div>
                ))}
              </div>

              {isScored && student.scored_at && (
                <p className="text-xs text-[#9A9A95] mt-4 pt-4 border-t border-black/6">
                  Last scored {new Date(student.scored_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-3">
              <RescoreButton githubUrl={student.github_url} />
              {student.name && (
                <Link
                  href={`/s/${encodeURIComponent(student.name)}`}
                  className="flex-1 text-center bg-white border border-black/10 text-[#0E0E0C] text-sm font-semibold py-2.5 rounded-xl hover:bg-[#F0EFEB] transition-colors"
                >
                  View public profile →
                </Link>
              )}
            </div>
            <div className="flex gap-3">
              <Link
                href="/dashboard/edit"
                className="flex-1 text-center bg-white border border-black/10 text-[#0E0E0C] text-sm font-semibold py-2.5 rounded-xl hover:bg-[#F0EFEB] transition-colors"
              >
                Edit profile
              </Link>
              <Link
                href="/leaderboard"
                className="flex-1 text-center bg-white border border-black/10 text-[#0E0E0C] text-sm font-semibold py-2.5 rounded-xl hover:bg-[#F0EFEB] transition-colors"
              >
                View leaderboard
              </Link>
            </div>
          </>
        )}

      </div>
    </main>
  )
}
