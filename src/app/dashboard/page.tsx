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

  function getScoreGlow(score: number | null | undefined): string {
    if (score === null || score === undefined) return ""
    if (score >= 70) return "shadow-[0_0_40px_rgba(10,114,80,0.2)]"
    if (score >= 40) return "shadow-[0_0_40px_rgba(15,82,186,0.2)]"
    return "shadow-[0_0_40px_rgba(217,119,6,0.2)]"
  }

  function getGrade(score: number): string {
    if (score >= 80) return "A"
    if (score >= 60) return "B"
    if (score >= 40) return "C"
    return "D"
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA] font-sans selection:bg-[#0F52BA]/20 pb-20">

      {/* Floating Navbar */}
      <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 animate-slide-up">
        <nav className="flex items-center justify-between px-4 sm:px-5 h-14 w-full max-w-4xl bg-white/70 backdrop-blur-xl border border-black/5 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.06)] relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
          
          <Link href="/" className="flex items-center gap-2 relative z-10 hover:scale-105 transition-transform">
            <div className="w-8 h-8 bg-gradient-to-br from-[#0F52BA] to-[#0A3D8F] rounded-full flex items-center justify-center shadow-inner">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="drop-shadow-sm">
                <path d="M3 13L8 3L13 13" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 9.5H11" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-serif text-lg font-bold text-[#0E0E0C] tracking-tight">verq</span>
          </Link>
          
          <div className="flex items-center gap-2 relative z-10">
            <Link
              href="/"
              className="text-sm font-medium text-[#6A6A66] hover:text-[#0E0E0C] hover:bg-black/5 rounded-full px-3 py-1.5 transition-all hidden sm:block"
            >
              Home
            </Link>
            {student?.name && (
              <Link
                href={`/s/${encodeURIComponent(student.name)}`}
                className="text-sm font-medium text-[#6A6A66] hover:text-[#0E0E0C] hover:bg-black/5 rounded-full px-3 py-1.5 transition-all hidden sm:block"
              >
                Public profile
              </Link>
            )}
            <div className="pl-2 border-l border-black/10">
              <SignOutButton />
            </div>
          </div>
        </nav>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-32">

        <div className="mb-10 animate-fade-in">
          <h1 className="font-serif text-4xl sm:text-5xl text-[#0E0E0C] font-bold mb-2 tracking-tight">
            Hey, {userName} 👋
          </h1>
          <p className="text-lg text-[#6A6A66]">
            Welcome to your Verq dashboard.
          </p>
        </div>

        {!student ? (
          <div className="bg-white border border-black/5 rounded-[2rem] p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center animate-slide-up">
            <div className="w-16 h-16 bg-[#F6F5F1] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="font-serif text-3xl text-[#9A9A95]">!</span>
            </div>
            <p className="font-serif text-2xl text-[#0E0E0C] mb-3">Profile not found</p>
            <p className="text-[#6A6A66] mb-4 max-w-sm mx-auto">
              We couldn&apos;t find a student profile for your account. This might happen if you signed up with a different email.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Main Score Card */}
            <div className="lg:col-span-2 space-y-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="bg-white border border-black/5 rounded-[2rem] p-6 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-8 mb-8 relative z-10">
                  <div className="flex items-center gap-5">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#0F52BA] to-[#0A3D8F] rounded-full flex items-center justify-center p-1 shadow-inner flex-shrink-0">
                      <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                        <span className="font-serif text-3xl text-[#0F52BA] font-bold">
                          {userName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h2 className="font-serif text-2xl sm:text-3xl text-[#0E0E0C] font-bold mb-1 tracking-tight">{student.name}</h2>
                      <p className="text-[#6A6A66]">{student.college || student.email}</p>
                    </div>
                  </div>
                  
                  <div className={`text-center sm:text-right bg-[#FAFAFA] border border-black/5 rounded-3xl p-6 min-w-[140px] ${getScoreGlow(student.verq_score)} transition-shadow duration-500`}>
                    <div className="font-serif text-5xl sm:text-6xl text-[#0E0E0C] font-bold mb-2 tracking-tighter">
                      {isScored ? student.verq_score : "--"}
                    </div>
                    {isScored ? (
                      <div className="text-xs bg-[#E4F4EE] border border-[#A7D7C5] text-[#0A7250] py-1 px-3 rounded-full font-mono inline-block shadow-sm">
                        Grade {getGrade(student.verq_score)}
                      </div>
                    ) : (
                      <div className="text-xs bg-[#FEF3C7] border border-[#FDE68A] text-[#D97706] py-1 px-3 rounded-full font-mono inline-block shadow-sm">
                        Pending
                      </div>
                    )}
                  </div>
                </div>

                {isScored && student.scored_at && (
                  <div className="pt-6 border-t border-black/5">
                    <p className="text-[10px] uppercase font-mono tracking-widest text-[#9A9A95]">
                      Last Scored: {new Date(student.scored_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                )}
              </div>

              {/* Actions Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <RescoreButton githubUrl={student.github_url} />
                {student.name && (
                  <Link
                    href={`/s/${encodeURIComponent(student.name)}`}
                    className="flex justify-center items-center gap-2 bg-white border border-black/5 shadow-[0_4px_14px_rgb(0,0,0,0.03)] text-[#0E0E0C] text-sm font-semibold py-3.5 rounded-2xl hover:shadow-[0_6px_20px_rgb(0,0,0,0.06)] hover:-translate-y-0.5 transition-all"
                  >
                    View public profile
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" className="opacity-50">
                      <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                    </svg>
                  </Link>
                )}
                <Link
                  href="/dashboard/edit"
                  className="flex justify-center items-center gap-2 bg-white border border-black/5 shadow-[0_4px_14px_rgb(0,0,0,0.03)] text-[#0E0E0C] text-sm font-semibold py-3.5 rounded-2xl hover:shadow-[0_6px_20px_rgb(0,0,0,0.06)] hover:-translate-y-0.5 transition-all"
                >
                  Edit profile
                </Link>
                <Link
                  href="/leaderboard"
                  className="flex justify-center items-center gap-2 bg-white border border-black/5 shadow-[0_4px_14px_rgb(0,0,0,0.03)] text-[#0E0E0C] text-sm font-semibold py-3.5 rounded-2xl hover:shadow-[0_6px_20px_rgb(0,0,0,0.06)] hover:-translate-y-0.5 transition-all"
                >
                  Leaderboard
                </Link>
              </div>
            </div>

            {/* Right Column: Dark Mode Score Breakdown */}
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="bg-[#0E0E0C] text-white rounded-[2rem] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.15)] relative overflow-hidden h-full">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#0F52BA]/20 rounded-full filter blur-[80px] pointer-events-none" />
                
                <h3 className="font-serif text-xl font-bold mb-8 tracking-tight relative z-10">Score Breakdown</h3>
                
                <div className="space-y-6 relative z-10">
                  {dimensions.map((dim) => (
                    <div key={dim.label}>
                      <div className="flex items-baseline justify-between mb-2">
                        <span className="text-sm font-medium text-white/90">{dim.label}</span>
                        <span className="text-xs text-white/50 font-mono tracking-wider">
                          {isScored ? `${dim.score}/100` : "--"}
                        </span>
                      </div>
                      <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ease-out ${getScoreColor(dim.score)}`}
                          style={{ width: isScored ? `${dim.score}%` : "0%" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {!isScored && (
                  <div className="absolute inset-0 bg-[#0E0E0C]/60 backdrop-blur-sm flex items-center justify-center p-6 text-center z-20">
                    <p className="text-sm text-white/80 border border-white/20 bg-white/10 rounded-xl p-4">
                      Click <strong className="text-white">Rescore</strong> to generate your Verq profile.
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

      </div>
    </main>
  )
}
