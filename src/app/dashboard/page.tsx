import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import SignOutButton from "@/components/SignOutButton"
import RescoreButton from "@/components/RescoreButton"
import GenerateActionPlanButton from "@/components/GenerateActionPlanButton"
import Navbar from "@/components/Navbar"
import VerifiedBadge from "@/components/VerifiedBadge"
import ShareModal from "@/components/ShareModal"
import { getRelativeRanking } from "@/lib/scoring"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Strict Dashboard Guard: Redirect companies to the company dashboard
  if (user?.user_metadata?.role === "company") {
    redirect("/company/dashboard")
  }

  // Use a demo email for "Public Preview" mode if no user is logged in
  const demoEmail = "aditya.24gcebelvlsi054@galgotiacollege.edu"
  const currentUserEmail = user?.email || demoEmail
  const isGuest = !user

  const userName = user?.user_metadata?.name || user?.email?.split("@")[0] || "Aditya"

  // Fetch student record
  const { data: student } = await supabase
    .from("students")
    .select("*")
    .eq("email", currentUserEmail)
    .single()

  const isScored = student?.verq_score !== null && student?.verq_score !== undefined
  
  const dimensions = [
    { label: "Code quality", score: student?.score_code_quality },
    { label: "Project complexity", score: student?.score_project_complexity },
    { label: "Commit consistency", score: student?.score_commit_consistency },
    { label: "Documentation", score: student?.score_documentation },
    { label: "Deployment", score: student?.score_deployment },
  ]

  const topLanguage = student?.languages && (student.languages as any[]).length > 0
    ? (student.languages as any[])[0].name
    : undefined;

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
    <main className="min-h-screen bg-[#FAFAFA] pt-24 pb-20 selection:bg-[#0F52BA]/20">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        <div className="mb-10 animate-fade-in px-2">
          <h1 className="font-serif text-4xl sm:text-5xl text-[#0E0E0C] font-bold mb-2 tracking-tight">
            Overview
          </h1>
          <p className="text-lg text-[#6A6A66] font-medium flex items-center gap-2">
            Good day, {userName} <span className="animate-float inline-block">👋</span>
          </p>
        </div>

        {!student ? (
          <div className="bg-white border border-black/5 rounded-[3rem] p-16 shadow-[0_12px_40px_rgb(0,0,0,0.03)] text-center animate-slide-up">
            <div className="w-20 h-20 bg-[#F6F5F1] rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
              <span className="font-serif text-4xl text-[#9A9A95]">!</span>
            </div>
            <p className="font-serif text-3xl text-[#0E0E0C] mb-4">Account restricted</p>
            <p className="text-[#6A6A66] mb-8 max-w-sm mx-auto leading-relaxed">
              We couldn&apos;t synchronize your GitHub profile. Please ensure your account has at least one public repository.
            </p>
            <SignOutButton />
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* Main Profile Header (Hero) */}
            <div className="bg-white border border-black/5 rounded-[2.5rem] p-6 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-slide-up relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
                <div className="relative shrink-0">
                  <div className={`w-56 h-56 rounded-full border-[10px] border-[#F6F6F3] flex items-center justify-center shadow-inner ${getScoreGlow(student.verq_score)} transition-all duration-700`}>
                    <div className="text-center">
                      <div className="font-serif text-8xl text-[#0E0E0C] font-bold tracking-tighter leading-none mb-1">
                        {isScored ? student.verq_score : "--"}
                      </div>
                      <div className={`text-[10px] font-mono font-black uppercase tracking-[0.2em] py-1 px-3 rounded-full inline-block ${student.verq_score >= 40 ? 'bg-[#0F52BA]/10 text-[#0F52BA]' : 'bg-[#D97706]/10 text-[#D97706]'}`}>
                        Rank {getGrade(student.verq_score || 0)}
                      </div>
                    </div>
                  </div>
                  {isScored && <VerifiedBadge className="absolute bottom-2 right-2 w-12 h-12 drop-shadow-xl z-20" />}
                </div>

                <div className="flex-1 text-center md:text-left">
                  <div className="mb-6">
                    <h2 className="font-serif text-3xl lg:text-4xl text-[#0E0E0C] font-black mb-3 leading-tight tracking-tight">
                      {student.name}
                    </h2>
                    <p className="text-[#6A6A66] text-lg font-medium">{student.college || "Independent Builder"}</p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-10">
                    <div className="bg-[#F6F6F3] px-4 py-2 rounded-2xl flex items-center gap-2 border border-black/[0.02] shadow-sm transform hover:scale-105 transition-all cursor-default">
                      <span className="text-base text-[#0F52BA]">📊</span>
                      <span className="text-xs font-bold text-[#0E0E0C] tracking-tight">
                        {getRelativeRanking(student.verq_score, topLanguage)}
                      </span>
                    </div>
                    <div className="bg-[#F6F6F3] px-4 py-2 rounded-2xl flex items-center gap-2 border border-black/[0.02] shadow-sm transform hover:scale-105 transition-all cursor-default">
                      <span className="text-base text-[#0F52BA]">🏗️</span>
                      <span className="text-xs font-bold text-[#0E0E0C] tracking-tight">
                        {topLanguage || "Multi-stack"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center md:justify-start gap-4">
                    <div className="sm:w-48">
                      <RescoreButton githubUrl={student.github_url} />
                    </div>
                    <ShareModal student={student} topLanguage={topLanguage} />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-8 mt-10 border-t border-black/5 relative z-10">
                <div className="flex-1 min-w-[200px]">
                        <p className="text-[10px] uppercase font-mono tracking-widest text-[#9A9A95] mb-2 pl-1">Verqify Score Breakdown</p>
                  <p className="text-sm font-bold text-[#0E0E0C] truncate opacity-60">{student.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Link href="/dashboard/edit" className="px-5 py-2.5 bg-[#F6F6F3] border border-black/5 rounded-2xl text-xs font-bold text-[#0E0E0C] hover:bg-white transition-all">
                    Edit Profile
                  </Link>
                  <Link href={`/s/${encodeURIComponent(student.name)}`} className="px-5 py-2.5 bg-[#0E0E0C] text-white rounded-2xl text-xs font-bold hover:shadow-lg transition-all">
                    Public Profile ↗
                  </Link>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Center Column: Best Work & Languages */}
              <div className="lg:col-span-2 space-y-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                
                {student.languages && (student.languages as any[]).length > 0 && (
                  <div className="bg-white border border-black/5 rounded-[2rem] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    <h3 className="font-serif text-xl font-bold text-[#0E0E0C] mb-5 tracking-tight">Languages</h3>
                    <div className="flex flex-wrap gap-2.5">
                      {(student.languages as { name: string; bytes: number }[]).slice(0, 5).map((lang) => (
                        <div key={lang.name} className="flex items-center gap-2 bg-[#FAFAFA] border border-black/5 px-3 py-1.5 rounded-full hover:bg-white hover:shadow-sm hover:-translate-y-0.5 transition-all">
                          <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-[#0F52BA] to-[#0A3D8F] shadow-sm" />
                          <span className="text-sm font-medium text-[#0E0E0C]">{lang.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-white border border-black/5 rounded-[2rem] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                  <div className="flex items-center justify-between mb-8">
                     <h3 className="font-serif text-xl font-bold text-[#0E0E0C] tracking-tight">Best Work</h3>
                     <a href={student.github_url} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-[#0F52BA] uppercase tracking-widest hover:underline px-4 py-2 bg-[#0F52BA]/5 rounded-full">
                       GitHub →
                     </a>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {(student.top_repos as { name: string; description: string; url: string; stars: number; language: string }[]).slice(0, 4).map((repo) => (
                      <a
                        key={repo.name}
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col p-6 bg-[#FAFAFA] border border-black/5 rounded-3xl hover:bg-white hover:border-[#0F52BA]/20 hover:shadow-xl hover:-translate-y-1 transition-all group"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <p className="text-base font-bold text-[#0E0E0C] group-hover:text-[#0F52BA] transition-colors line-clamp-1">{repo.name}</p>
                          {repo.stars > 0 && (
                            <div className="flex items-center gap-1.5 bg-white border border-black/5 px-2 py-0.5 rounded-md text-[10px] font-black text-[#6A6A66] shadow-sm">
                              <span className="text-[#D97706]">★</span>
                              <span>{repo.stars}</span>
                            </div>
                          )}
                        </div>
                        {repo.description && (
                          <p className="text-xs text-[#6A6A66] mb-6 leading-relaxed">{repo.description}</p>
                        )}
                        <div className="flex items-center justify-between mt-auto">
                           <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-[#0E0E0C]" />
                             <span className="text-[10px] font-black text-[#9A9A95] uppercase tracking-widest font-mono">{repo.language || "Unknown"}</span>
                           </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar: Breakdown */}
              <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <div className="bg-[#0E0E0C] text-white rounded-[2rem] p-8 shadow-[0_30px_60px_rgba(0,0,0,0.1)] relative overflow-hidden h-full min-h-[450px]">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#0F52BA]/30 to-transparent rounded-full filter blur-[100px] pointer-events-none" />
                  
                  <h3 className="font-serif text-2xl font-bold mb-10 tracking-tight relative z-10">Score Breakdown</h3>
                  
                  <div className="space-y-8 relative z-10">
                    {dimensions.map((dim) => (
                      <div key={dim.label}>
                        <div className="flex items-baseline justify-between mb-3">
                          <span className="text-xs font-black uppercase tracking-widest text-white/50">{dim.label}</span>
                          <span className="text-[10px] text-white font-mono font-black italic">
                            {isScored ? `${dim.score}%` : "--"}
                          </span>
                        </div>
                        <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 p-[2px]">
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)] shadow-[0_0_15px_rgba(15,82,186,0.3)] ${getScoreColor(dim.score)}`}
                            style={{ width: isScored ? `${dim.score}%` : "0%" }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Plan Component - Now here above Portfolio */}
            <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
               <div className="bg-white border text-left border-black/5 rounded-[2rem] p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group/recs h-full">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#0F52BA]/5 to-transparent rounded-bl-full pointer-events-none" />
                  
                  <div className="flex items-center gap-4 mb-8 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-[#0E0E0C] flex items-center justify-center shadow-lg">
                      <span className="text-white text-xl">💡</span>
                    </div>
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-[#0E0E0C] tracking-tight">Action Plan</h3>
                      <p className="text-[#6A6A66] text-xs mt-1 font-medium italic">Personalized tactical steps to boost your Verqify score.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                    {student.recommended_projects && (student.recommended_projects as any[]).length > 0 ? (
                      (student.recommended_projects as { title: string; description: string }[]).slice(0, 3).map((proj, idx) => (
                        <div key={idx} className="bg-[#FAFAFA] border border-black/5 rounded-[2.5rem] p-6 hover:bg-white hover:border-[#0F52BA]/20 hover:shadow-2xl transition-all flex flex-col items-start gap-4">
                          <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-[#0F52BA] font-black text-xs shrink-0 border border-black/5">
                            {idx + 1}
                          </div>
                          <div>
                            <h4 className="font-serif text-base font-bold text-[#0E0E0C] mb-2">{proj.title}</h4>
                            <p className="text-xs text-[#6A6A66] leading-relaxed">{proj.description}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-1 md:col-span-3 bg-[#FAFAFA] border border-black/5 rounded-2xl p-8 text-center">
                        <p className="text-[#6A6A66] mb-6 text-sm font-medium italic">No tactical plan generated yet. Analyzing your repos will reveal ways to bridge the gap to 100.</p>
                        <GenerateActionPlanButton githubUrl={student?.github_url} />
                      </div>
                    )}
                  </div>
                </div>
            </div>

            {/* Portfolio Section Full Width */}
            {student.all_repos && (student.all_repos as any[]).length > 0 && (
              <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <div className="bg-white border text-left border-black/5 rounded-[2rem] p-6 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="font-serif text-3xl font-bold text-[#0E0E0C] tracking-tight">Full Portfolio</h3>
                      <p className="text-[#6A6A66] text-sm mt-1">All {Math.min((student.all_repos as any[]).length, 30)} recent public repositories</p>
                    </div>
                    <a href={student.github_url} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-[#0F52BA] uppercase tracking-widest hover:bg-[#F0F5FF] px-6 py-3 rounded-full border border-black/5 transition-all">
                      View GitHub →
                    </a>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(student.all_repos as any[]).slice(0, 30).map((repo, idx) => (
                      <a
                        key={idx}
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col p-5 bg-[#FAFAFA] border border-black/5 rounded-2xl hover:bg-white hover:border-black/10 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1 transition-all group"
                      >
                        <div className="flex items-start justify-between mb-2 gap-2">
                          <p className="text-base font-bold text-[#0E0E0C] group-hover:text-[#0F52BA] transition-colors line-clamp-1 break-all">{repo.name}</p>
                          {repo.stars > 0 && (
                            <div className="flex items-center gap-1.5 bg-white border border-black/5 px-2 py-0.5 rounded-md text-xs font-medium text-[#6A6A66] shadow-sm shrink-0">
                              <span className="text-[#D97706]">★</span>
                              <span>{repo.stars}</span>
                            </div>
                          )}
                        </div>
                        {repo.description ? (
                           <p className="text-sm text-[#6A6A66] mb-4 leading-relaxed">{repo.description}</p>
                        ) : (
                           <p className="text-sm text-[#9A9A95] italic mb-4">No description provided.</p>
                        )}
                        
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-black/5">
                          {repo.language ? (
                            <div className="flex items-center gap-1.5">
                              <div className="w-2 h-2 rounded-full bg-[#0E0E0C]" />
                              <span className="text-xs font-mono font-medium text-[#9A9A95] truncate max-w-[80px]">{repo.language}</span>
                            </div>
                          ) : (
                            <span className="text-xs font-mono font-medium text-[#9A9A95]">Unknown</span>
                          )}
                          {repo.updated_at && (
                            <span className="text-[10px] uppercase tracking-widest text-[#9A9A95] font-mono shrink-0">
                              UPD: {new Date(repo.updated_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                            </span>
                          )}
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
