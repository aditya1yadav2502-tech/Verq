import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import SignOutButton from "@/components/SignOutButton"
import RescoreButton from "@/components/RescoreButton"
import GenerateActionPlanButton from "@/components/GenerateActionPlanButton"
import Navbar from "@/components/Navbar"
import VerifiedBadge from "@/components/VerifiedBadge"
import ShareModal from "@/components/ShareModal"
import { getRelativeRanking, getSkillFingerprint } from "@/lib/scoring"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/signin")
  }

  if (user?.user_metadata?.role === "company") {
    redirect("/company/dashboard")
  }

  const currentUserEmail = user.email
  const userName = user.user_metadata?.name || user.email?.split("@")[0] || "Builder"


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

  const fingerprint = isScored ? getSkillFingerprint({
    code_quality: student?.score_code_quality || 0,
    project_complexity: student?.score_project_complexity || 0,
    commit_consistency: student?.score_commit_consistency || 0,
    documentation: student?.score_documentation || 0,
    deployment: student?.score_deployment || 0,
  }) : "Analyzing code fingerprint...";

  const topLanguage = student?.languages && (student.languages as any[]).length > 0
    ? (student.languages as any[])[0].name
    : undefined;

  return (
    <main className="min-h-screen bg-background pt-32 pb-20 selection:bg-brand/20 bg-grain relative">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand/5 rounded-full filter blur-[150px] animate-pulse-slow" />
      </div>

      <Navbar />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        <div className="mb-12 animate-fade-in-up px-2">
          <h1 className="font-serif text-5xl sm:text-7xl text-white font-bold mb-3 tracking-tighter text-shine">
            Control Center.
          </h1>
          <p className="text-xl text-foreground-muted font-medium flex items-center gap-2 italic">
            System ready, {userName} <span className="animate-pulse inline-block text-brand">⚡</span>
          </p>
        </div>

        {!student ? (
          <div className="glass-card rounded-[3rem] p-20 text-center animate-slide-up shadow-2xl border border-white/10">
            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner shadow-white/5">
              <span className="font-serif text-4xl text-foreground-muted">!</span>
            </div>
            <p className="font-serif text-3xl text-white mb-4 font-bold tracking-tight">Indexing restricted</p>
            <p className="text-foreground-muted mb-10 max-w-sm mx-auto leading-relaxed">
              We couldn&apos;t synchronize your GitHub profile. Please ensure your account has at least one public repository.
            </p>
            <SignOutButton />
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* Main Profile Header */}
            <div className="glass-card rounded-[3rem] p-8 sm:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.6)] animate-slide-up relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-96 h-96 bg-brand/10 rounded-full filter blur-[100px] pointer-events-none group-hover:bg-brand/20 transition-colors duration-1000" />
              
              <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
                <div className="relative shrink-0 group/avatar">
                  <div className="w-64 h-64 rounded-full border-[10px] border-background flex items-center justify-center p-8 bg-black/40 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden transition-transform duration-500 group-hover/avatar:scale-105 group-hover/avatar:rotate-2">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand/20 to-transparent opacity-50" />
                    <div className="text-center relative z-10">
                      <div className="font-serif-italic text-2xl text-white font-bold italic tracking-tight leading-tight mb-4 text-balance drop-shadow-md">
                        {fingerprint}
                      </div>
                      <div className="text-[10px] font-black font-mono uppercase tracking-[0.25em] py-1.5 px-4 rounded-full inline-block bg-brand/10 text-brand-light border border-brand/20 shadow-[0_0_15px_rgba(0,230,91,0.2)]">
                        Top 0.1% Signal
                      </div>
                    </div>
                  </div>
                  {isScored && (
                    <div className="absolute bottom-2 right-2 flex items-center justify-center animate-bounce" style={{ animationDuration: '3s' }}>
                       <VerifiedBadge className="w-16 h-16 drop-shadow-[0_0_30px_rgba(0,230,91,0.6)] z-20" />
                    </div>
                  )}
                </div>

                <div className="flex-1 text-center lg:text-left">
                  <div className="mb-8">
                    <h2 className="font-serif text-5xl lg:text-6xl text-white font-black mb-4 leading-none tracking-tighter hover:text-brand-light transition-colors">
                      {student.name}
                    </h2>
                    <p className="text-foreground-muted text-2xl font-medium italic font-serif-italic">{student.college || "Independent Builder"}</p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-10">
                    <div className="glass-card px-6 py-3 rounded-2xl flex items-center gap-3 transition-transform hover:-translate-y-1 cursor-default shadow-lg">
                      <span className="text-lg drop-shadow-md">📊</span>
                      <span className="text-xs font-black font-mono uppercase tracking-[0.2em] text-white">
                        {getRelativeRanking(student.verq_score, topLanguage)}
                      </span>
                    </div>
                    <div className="glass-card px-6 py-3 rounded-2xl flex items-center gap-3 transition-transform hover:-translate-y-1 cursor-default shadow-lg">
                      <span className="text-lg drop-shadow-md">🏗️</span>
                      <span className="text-xs font-black font-mono uppercase tracking-[0.2em] text-white">
                        {topLanguage || "Multi-stack"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-4">
                    <div className="sm:min-w-[220px]">
                      <RescoreButton githubUrl={student.github_url} />
                    </div>
                    <ShareModal student={student} topLanguage={topLanguage} fingerprint={fingerprint} />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-8 pt-10 mt-12 border-t border-white/10 relative z-10">
                <div className="flex-1 min-w-[240px]">
                  <p className="text-[10px] font-mono uppercase font-black tracking-[0.25em] text-foreground-muted mb-2">Native Identity Review</p>
                  <p className="text-sm font-bold text-white/50 truncate flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand shadow-[0_0_8px_rgba(0,230,91,0.5)]" />
                    {student.email}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Link href="/dashboard/edit" className="px-6 py-3 glass-card hover:bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-white transition-all">
                    Config
                  </Link>
                  <Link href={`/s/${encodeURIComponent(student.name)}`} className="px-6 py-3 bg-white text-background rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_5px_20px_rgba(255,255,255,0.2)]">
                    View Public Card ↗
                  </Link>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Center Column: Best Work & Languages */}
              <div className="lg:col-span-2 space-y-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                
                {student.languages && (student.languages as any[]).length > 0 && (
                  <div className="glass-card rounded-[2.5rem] p-8 shadow-xl hover:bg-white/[0.04] transition-colors">
                    <h3 className="font-serif text-3xl font-bold text-white mb-6 tracking-tight">Stack Signal</h3>
                    <div className="flex flex-wrap gap-3">
                      {(student.languages as { name: string; bytes: number }[]).slice(0, 8).map((lang) => (
                        <div key={lang.name} className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-xl hover:bg-brand/10 hover:border-brand/30 transition-all cursor-default group/lang">
                          <div className="w-2 h-2 rounded-full bg-brand shadow-[0_0_10px_rgba(0,230,91,0.5)] group-hover/lang:scale-150 transition-transform" />
                          <span className="text-[10px] font-black font-mono uppercase tracking-[0.2em] text-white/80">{lang.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="glass-card rounded-[2.5rem] p-8 shadow-xl">
                  <div className="flex items-center justify-between mb-10">
                     <h3 className="font-serif text-3xl font-bold text-white tracking-tight">Primary Proof</h3>
                     <a href={student.github_url} target="_blank" rel="noopener noreferrer" className="text-[10px] font-black font-mono text-brand-light uppercase tracking-widest hover:text-white px-5 py-2.5 bg-brand/10 border border-brand/20 rounded-full transition-colors shadow-sm">
                       Inspect Repos ↗
                     </a>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    {(student.top_repos as { name: string; description: string; url: string; stars: number; language: string }[]).slice(0, 4).map((repo) => (
                      <a
                        key={repo.name}
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col p-8 glass-card rounded-[2rem] hover:bg-white/[0.05] hover:scale-[1.01] transition-all duration-300 group/repo shadow-md"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <p className="text-2xl font-serif font-bold text-white group-hover/repo:text-brand-light transition-colors line-clamp-1 mb-2 tracking-tight">{repo.name}</p>
                            {repo.description && (
                              <p className="text-sm text-foreground-muted leading-relaxed line-clamp-2 max-w-xl">{repo.description}</p>
                            )}
                          </div>
                          {repo.stars > 0 && (
                            <div className="flex items-center gap-1.5 bg-brand/10 border border-brand/30 px-3 py-1.5 rounded-xl text-[10px] font-black text-brand-light shadow-sm backdrop-blur-md">
                              <span className="text-brand shadow-[0_0_10px_rgba(0,230,91,0.5)]">★</span>
                              <span>{repo.stars}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/10">
                           <div className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                             <span className="text-[10px] font-black text-foreground-muted uppercase tracking-[0.2em] font-mono group-hover/repo:text-white transition-colors">{repo.language || "Native"}</span>
                           </div>
                           <span className="text-[10px] font-black font-mono uppercase tracking-[0.2em] text-brand-light opacity-0 group-hover/repo:opacity-100 transition-opacity transform translate-x-4 group-hover/repo:translate-x-0 duration-300">View Case Study →</span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar: Dimensions */}
              <div className="animate-slide-up h-full" style={{ animationDelay: '0.2s' }}>
                <div className="glass-card rounded-[3rem] p-10 h-full min-h-[500px] relative overflow-hidden shadow-2xl group/sidebar">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-brand/10 rounded-full filter blur-[100px] pointer-events-none group-hover/sidebar:bg-brand/20 transition-colors duration-1000" />
                  
                  <h3 className="font-serif text-4xl font-bold text-white mb-12 tracking-tight relative z-10">Skill Imprint</h3>
                  
                  <div className="space-y-12 relative z-10">
                    {dimensions.map((dim) => (
                      <div key={dim.label} className="group/dim">
                        <div className="flex items-baseline justify-between mb-4">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground-muted group-hover/dim:text-white transition-colors">{dim.label}</span>
                          <span className="text-xs text-brand-light font-mono font-black uppercase group-hover/dim:scale-110 transition-transform">
                            {isScored ? `${dim.score}%` : "--"}
                          </span>
                        </div>
                        <div className="h-1.5 bg-black/40 rounded-full overflow-hidden relative shadow-inner shadow-black border border-white/5">
                          <div
                            className="h-full bg-brand transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(0,230,91,0.6)]"
                            style={{ width: isScored ? `${dim.score}%` : "0%" }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Plan */}
            <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
               <div className="glass-card rounded-[3.5rem] p-10 sm:p-14 shadow-2xl relative overflow-hidden group/recs border border-white/10 hover:border-brand/20 transition-colors duration-500">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-brand/5 rounded-bl-full pointer-events-none group-hover/recs:bg-brand/10 transition-colors duration-1000 blur-[80px]" />
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12 relative z-10">
                    <div>
                      <h3 className="font-serif text-5xl font-bold text-white tracking-tighter text-shine">Tactical Roadmaps</h3>
                      <p className="text-foreground-muted text-lg mt-3 font-medium italic font-serif-italic">Personalized sequences to maximize your native code signal.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                    {student.recommended_projects && (student.recommended_projects as any[]).length > 0 ? (
                      (student.recommended_projects as { title: string; description: string }[]).slice(0, 3).map((proj, idx) => (
                        <div key={idx} className="glass-card rounded-[2.5rem] p-8 hover:bg-white/[0.04] transition-transform hover:-translate-y-2 flex flex-col items-start gap-6 group/tactical shadow-lg">
                          <div className="w-12 h-12 rounded-[1rem] bg-white text-background flex items-center justify-center font-serif italic text-xl font-black shadow-[0_10px_20px_rgba(255,255,255,0.2)] group-hover/tactical:scale-110 transition-transform">
                            {idx + 1}
                          </div>
                          <div>
                            <h4 className="font-serif text-3xl font-bold text-white mb-4 leading-tight group-hover/tactical:text-brand-light transition-colors">{proj.title}</h4>
                            <p className="text-sm text-foreground-muted leading-relaxed font-medium">{proj.description}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-1 md:col-span-3 glass-card rounded-[3rem] p-20 text-center border-dashed border-white/20">
                        <p className="text-foreground-muted mb-10 text-xl font-medium italic font-serif-italic max-w-lg mx-auto">No tactical plan generated yet. Analyzing your repos will reveal ways to bridge the gap to 100.</p>
                        <GenerateActionPlanButton githubUrl={student?.github_url} />
                      </div>
                    )}
                  </div>
                </div>
            </div>

            {/* Portfolio Section */}
            {student.all_repos && (student.all_repos as any[]).length > 0 && (
              <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <div className="glass-card rounded-[3rem] p-10 sm:p-14 shadow-xl">
                  <div className="flex items-center justify-between mb-12">
                     <div>
                       <h3 className="font-serif text-4xl font-bold text-white tracking-tight">Full Archive</h3>
                       <p className="text-foreground-muted text-md mt-2 font-medium">Analyzing {Math.min((student.all_repos as any[]).length, 30)} distinct repositories.</p>
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(student.all_repos as any[]).slice(0, 30).map((repo, idx) => (
                      <a
                        key={idx}
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col p-6 glass-card rounded-[2rem] hover:bg-white/[0.04] hover:-translate-y-1 transition-all group/archive shadow-md border-transparent hover:border-white/10"
                      >
                        <div className="flex items-start justify-between mb-4 gap-4">
                          <p className="text-lg font-serif font-bold text-white group-hover/archive:text-brand-light transition-colors line-clamp-1 break-all">{repo.name}</p>
                          {repo.stars > 0 && (
                            <div className="flex items-center gap-1.5 bg-white/5 py-1 px-2.5 rounded-lg text-[10px] font-black text-foreground-muted backdrop-blur-sm border border-white/5">
                              <span className="text-brand">★</span>
                              <span>{repo.stars}</span>
                            </div>
                          )}
                        </div>
                        {repo.description ? (
                           <p className="text-xs text-foreground-muted mb-8 leading-relaxed line-clamp-3 overflow-hidden">{repo.description}</p>
                        ) : (
                           <p className="text-xs text-foreground-muted/50 italic mb-8">No description cataloged.</p>
                        )}
                        
                        <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/10">
                           <div className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-foreground-muted" />
                             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground-muted font-mono">{repo.language || "Source"}</span>
                           </div>
                           {repo.updated_at && (
                             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground-muted/50 font-mono">
                               IDX: {new Date(repo.updated_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
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
