import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import BookmarkButton from "@/components/BookmarkButton"
import VerifiedBadge from "@/components/VerifiedBadge"
import ShareModal from "@/components/ShareModal"
import { getRelativeRanking, getSkillFingerprint } from "@/lib/scoring"

interface PageProps {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { username } = await params
  const name = decodeURIComponent(username).trim()
  return {
    title: `${name} — Verqify Portfolio`,
    description: `View ${name}'s verified builder profile and Skill Fingerprint.`,
  }
}

export default async function StudentProfile({ params }: PageProps) {
  const { username } = await params
  const name = decodeURIComponent(username).trim()

  const supabase = await createClient()

  const { data: student } = await supabase
    .from("students")
    .select("name, email, college, github_url, verq_score, score_code_quality, score_project_complexity, score_commit_consistency, score_documentation, score_deployment, scored_at, top_repos, languages, all_repos")
    .ilike("name", name)
    .single()

  if (!student) {
    return (
      <main className="min-h-screen bg-[#FAFAFA] pt-24 text-[#0E0E0C]">
        <Navbar />
        <div className="flex items-center justify-center min-h-[70vh] animate-fade-in">
          <div className="text-center bg-white border border-black/5 rounded-3xl p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="w-16 h-16 bg-[#F6F5F1] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="font-serif text-3xl text-[#9A9A95]">?</span>
            </div>
            <p className="font-serif text-3xl text-[#0E0E0C] mb-3">Builder not found</p>
            <p className="text-[#6A6A66] mb-8 max-w-sm mx-auto">This profile doesn&apos;t exist yet or they haven&apos;t generated their Skill Fingerprint.</p>
            <Link
              href="/leaderboard"
              className="inline-block bg-[#0E0E0C] text-white px-6 py-3 rounded-full hover:bg-[#3B3B38] transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
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

  const fingerprint = isScored ? getSkillFingerprint({
    code_quality: student.score_code_quality || 0,
    project_complexity: student.score_project_complexity || 0,
    commit_consistency: student.score_commit_consistency || 0,
    documentation: student.score_documentation || 0,
    deployment: student.score_deployment || 0,
  }) : "Analyzing code fingerprint...";

  const topLanguage = student.languages && (student.languages as any[]).length > 0
    ? (student.languages as any[])[0].name
    : undefined;

  function getScoreColor(score: number | null): string {
    if (score === null || score === undefined) return "bg-[#E2E1DC]"
    if (score >= 70) return "bg-[#0A7250]"
    if (score >= 40) return "bg-[#0F52BA]"
    return "bg-[#D97706]"
  }

  function getScoreGlow(score: number | null): string {
    if (score === null || score === undefined) return ""
    if (score >= 70) return "shadow-[0_0_40px_rgba(10,114,80,0.2)]"
    if (score >= 40) return "shadow-[0_0_40px_rgba(15,82,186,0.2)]"
    return "shadow-[0_0_40px_rgba(217,119,6,0.2)]"
  }

  return (
    <main className="min-h-screen bg-background pt-32 pb-20 selection:bg-brand/20">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6">
        
        {/* Main Profile Header */}
        <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 sm:p-12 shadow-2xl mb-12 animate-slide-up relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand/5 rounded-full filter blur-[100px] pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row items-start justify-between gap-12 mb-12 relative z-10">
            <div className="flex items-center gap-8">
              <div className="w-28 h-28 bg-brand rounded-full flex items-center justify-center p-1 shadow-2xl flex-shrink-0 animate-fade-in border border-white/10">
                <span className="font-serif text-5xl text-background font-black italic">
                  {student.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="font-serif text-5xl sm:text-6xl text-white font-black mb-4 tracking-tighter flex items-center gap-4">
                  {student.name}
                  {isScored && <VerifiedBadge className="w-12 h-12 drop-shadow-[0_0_20px_rgba(0,200,83,0.4)]" />}
                </h1>
                <p className="text-foreground/40 text-xl font-medium flex items-center gap-3 font-serif-italic italic">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="opacity-40">
                    <path fillRule="evenodd" d="M8 0a6 6 0 0 0-6 6c0 4.1 5.3 9.4 5.6 9.7a1 1 0 0 0 1.4 0C9.3 14.8 14 10.1 14 6a6 6 0 0 0-6-6Zm0 9a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"/>
                  </svg>
                  {student.college || "Independent Builder"}
                </p>
                <div className="mt-6">
                  <BookmarkButton studentEmail={student.email} />
                </div>
              </div>
            </div>
            
            <div className="bg-black/20 border border-white/10 rounded-[2rem] p-8 min-w-[280px] max-w-[360px] shadow-2xl transition-shadow duration-500 flex flex-col justify-center text-center lg:text-right relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand/10 rounded-full filter blur-3xl pointer-events-none" />
              <div className="font-serif-italic text-2xl text-white font-bold italic mb-4 tracking-tight leading-tight text-balance relative z-10">
                "{isScored ? fingerprint : "Analyzing code fingerprint..."}"
              </div>
              <div className="text-[10px] text-brand-light font-black tracking-[0.25em] uppercase px-4 py-2 bg-brand/10 rounded-full inline-block self-center lg:self-end border border-brand/20 relative z-10">
                Skill Fingerprint
              </div>
            </div>
          </div>

          {/* Socials & Basic Details */}
          <div className="flex flex-wrap items-center justify-between gap-8 pt-10 border-t border-white/5 relative z-10">
            <div className="flex flex-wrap gap-10">
              <div>
                <p className="text-[10px] uppercase font-black tracking-[0.2em] text-foreground/20 mb-2">Native Identity</p>
                <p className="text-sm font-bold text-white/40">{student.email}</p>
              </div>
              {student.github_url && (
                <div>
                  <p className="text-[10px] uppercase font-black tracking-[0.2em] text-foreground/20 mb-2">Source Proof</p>
                  <a href={student.github_url} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-brand-light hover:underline flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                      <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                    </svg>
                    {student.github_url.replace("https://github.com/", "")}
                  </a>
                </div>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6 w-full lg:w-auto">
              {isScored && student.scored_at && (
                <div className="text-right">
                  <p className="text-[10px] uppercase font-black tracking-[0.2em] text-foreground/20 mb-2">Last Indexed</p>
                  <p className="text-sm font-bold text-white/40">
                    {new Date(student.scored_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </p>
                </div>
              )}
              {isScored && (
                <ShareModal student={student} topLanguage={topLanguage} fingerprint={fingerprint} />
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left Column: Top Repos & Languages */}
          <div className="lg:col-span-2 space-y-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            
            {student.languages && (student.languages as any[]).length > 0 && (
              <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8">
                <h3 className="font-serif text-2xl font-bold text-white mb-6 tracking-tight">Stack Signal</h3>
                <div className="flex flex-wrap gap-3">
                  {(student.languages as { name: string; bytes: number }[]).slice(0, 8).map((lang) => (
                    <div key={lang.name} className="flex items-center gap-3 bg-white/5 border border-white/5 px-4 py-2 rounded-xl hover:bg-white/10 transition-all">
                      <div className="w-2 h-2 rounded-full bg-brand shadow-[0_0_10px_rgba(0,200,83,0.5)]" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/60">{lang.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {student.top_repos && (student.top_repos as any[]).length > 0 ? (
              <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8">
                <div className="flex items-center justify-between mb-10">
                  <h3 className="font-serif text-2xl font-bold text-white tracking-tight">Primary Proof</h3>
                  <a href={student.github_url} target="_blank" rel="noopener noreferrer" className="text-[10px] font-black text-brand-light uppercase tracking-widest hover:underline px-5 py-2.5 bg-brand/10 border border-brand/20 rounded-full">
                    Inspect GitHub →
                  </a>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  {(student.top_repos as { name: string; description: string; url: string; stars: number; language: string }[]).map((repo) => (
                    <a
                      key={repo.name}
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col p-8 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/5 hover:border-white/10 transition-all group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="text-xl font-bold text-white group-hover:text-brand-light transition-colors line-clamp-1 mb-2">{repo.name}</p>
                          {repo.description && (
                            <p className="text-sm text-foreground/40 leading-relaxed line-clamp-2 max-w-xl">{repo.description}</p>
                          )}
                        </div>
                        {repo.stars > 0 && (
                          <div className="flex items-center gap-1.5 bg-brand/10 border border-brand/20 px-3 py-1 rounded-lg text-[10px] font-black text-brand-light shadow-sm">
                            <span className="text-brand">★</span>
                            <span>{repo.stars}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/5">
                         <div className="flex items-center gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-brand" />
                           <span className="text-[10px] font-black text-foreground/40 uppercase tracking-widest font-mono">{repo.language || "Native"}</span>
                         </div>
                         <span className="text-[10px] font-black uppercase tracking-widest text-brand-light opacity-0 group-hover:opacity-100 transition-opacity">View Case Study →</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ) : (
                <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-16 text-center text-foreground/20 italic font-serif">
                  No proof of work cataloged.
                </div>
            )}
          </div>

          {/* Right Column: Score Breakdown */}
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-10 h-full min-h-[500px] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-brand/5 rounded-full filter blur-[100px] pointer-events-none" />
              
              <h3 className="font-serif text-3xl font-bold text-white mb-12 tracking-tight relative z-10">Skill Imprint</h3>
              
              <div className="space-y-10 relative z-10">
                {dimensions.map((dim) => (
                  <div key={dim.label}>
                    <div className="flex items-baseline justify-between mb-4">
                      <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">{dim.label}</span>
                      <span className="text-[10px] text-brand-light font-mono font-black uppercase">
                        {isScored ? `${dim.score}%` : "--"}
                      </span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden relative">
                      <div
                        className="h-full bg-brand transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(0,200,83,0.3)]"
                        style={{ width: isScored ? `${dim.score}%` : "0%" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Portfolio Section Full Width */}
        {student.all_repos && (student.all_repos as any[]).length > 0 && (
          <div className="mt-12 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="bg-white/[0.03] border border-white/10 rounded-[3rem] p-10 sm:p-14">
              <div className="flex items-center justify-between mb-12">
                <div>
                   <h3 className="font-serif text-3xl font-bold text-white tracking-tight">Full Archive</h3>
                   <p className="text-foreground/40 text-sm mt-2 font-medium">Analyzing {Math.min((student.all_repos as any[]).length, 30)} distinct repositories.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(student.all_repos as any[]).slice(0, 30).map((repo, idx) => (
                  <a
                    key={idx}
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/5 transition-all group"
                  >
                    <div className="flex items-start justify-between mb-4 gap-4">
                      <p className="text-sm font-bold text-white group-hover:text-brand-light transition-colors line-clamp-1 break-all">{repo.name}</p>
                      {repo.stars > 0 && (
                        <div className="flex items-center gap-1.5 bg-white/5 px-2 py-0.5 rounded-md text-[9px] font-black text-foreground/40">
                          <span className="text-brand">★</span>
                          <span>{repo.stars}</span>
                        </div>
                      )}
                    </div>
                    {repo.description ? (
                       <p className="text-[11px] text-foreground/30 mb-6 leading-relaxed line-clamp-3">{repo.description}</p>
                    ) : (
                       <p className="text-[11px] text-foreground/20 italic mb-6">No description cataloged.</p>
                    )}
                    
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                       <div className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-foreground/20" />
                         <span className="text-[9px] font-black uppercase tracking-widest text-foreground/40 font-mono">{repo.language || "Source"}</span>
                       </div>
                       {repo.updated_at && (
                         <span className="text-[9px] font-black uppercase tracking-widest text-foreground/20 font-mono">
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
    </main>
  )
}