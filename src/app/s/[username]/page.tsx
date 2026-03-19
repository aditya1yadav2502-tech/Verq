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

  const { data: student } = await supabase
    .from("students")
    .select("name, email, college, github_url, verq_score, score_code_quality, score_project_complexity, score_commit_consistency, score_documentation, score_deployment, scored_at, top_repos, languages")
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
            <p className="text-[#6A6A66] mb-8 max-w-sm mx-auto">This profile doesn&apos;t exist yet or they haven&apos;t generated their Verq score.</p>
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
  
  // Fetch global rank
  let rank: number | null = null;
  let percentile: number | null = null;
  let totalScored = 0;

  if (isScored) {
    const { count: total } = await supabase
      .from("students")
      .select("*", { count: "exact", head: true })
      .not("verq_score", "is", null);

    const { count: higher } = await supabase
      .from("students")
      .select("*", { count: "exact", head: true })
      .gt("verq_score", student.verq_score);

    if (total !== null && higher !== null) {
      totalScored = total;
      rank = higher + 1;
      percentile = Math.max(1, Math.ceil((rank / total) * 100));
    }
  }

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

  function getScoreGlow(score: number | null): string {
    if (score === null || score === undefined) return ""
    if (score >= 70) return "shadow-[0_0_40px_rgba(10,114,80,0.2)]"
    if (score >= 40) return "shadow-[0_0_40px_rgba(15,82,186,0.2)]"
    return "shadow-[0_0_40px_rgba(217,119,6,0.2)]"
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA] pt-24 pb-20 selection:bg-[#0F52BA]/20">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Main Profile Header */}
        <div className="bg-white border border-black/5 rounded-[2rem] p-6 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-8 animate-slide-up relative overflow-hidden">
          
          <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-10 relative z-10">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-[#0F52BA] to-[#0A3D8F] rounded-full flex items-center justify-center p-1 shadow-inner flex-shrink-0 animate-fade-in">
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                  <span className="font-serif text-4xl text-[#0F52BA] font-bold">
                    {student.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div>
                <h1 className="font-serif text-3xl sm:text-4xl text-[#0E0E0C] font-bold mb-2 tracking-tight">
                  {student.name}
                </h1>
                <p className="text-[#6A6A66] flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" className="opacity-70">
                    <path fillRule="evenodd" d="M8 0a6 6 0 0 0-6 6c0 4.1 5.3 9.4 5.6 9.7a1 1 0 0 0 1.4 0C9.3 14.8 14 10.1 14 6a6 6 0 0 0-6-6Zm0 9a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"/>
                  </svg>
                  {student.college || "College not set"}
                </p>
                <div className="mt-3">
                  <BookmarkButton studentEmail={student.email} />
                </div>
              </div>
            </div>
            
            <div className={`text-center md:text-right bg-white border border-black/5 rounded-3xl p-6 min-w-[160px] ${getScoreGlow(student.verq_score)} transition-shadow duration-500`}>
              <div className="font-serif text-5xl sm:text-6xl text-[#0E0E0C] font-bold mb-1 tracking-tighter">
                {isScored ? student.verq_score : "--"}
              </div>
              <div className="text-xs text-[#9A9A95] font-mono tracking-widest uppercase mb-3">Verq Score</div>
              {isScored ? (
                <div className="flex flex-col items-center md:items-end gap-2 mt-2">
                  <div className="text-xs bg-[#E4F4EE] border border-[#A7D7C5] text-[#0A7250] py-1 px-3 rounded-full font-mono shadow-sm">
                    Verified ✓
                  </div>
                  {rank && (
                    <div className="text-xs bg-[#F0F5FF] border border-[#BFD4FF] text-[#0F52BA] py-1 px-3 rounded-full font-mono shadow-sm" title={`Ranked #${rank} out of ${totalScored}`}>
                      Top {percentile}%
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-xs bg-[#FEF3C7] border border-[#FDE68A] text-[#D97706] py-1 px-3 rounded-full font-mono inline-block shadow-sm mt-3">
                  Pending
                </div>
              )}
            </div>
          </div>

          {/* Socials & Basic Details */}
          <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-black/5">
            <div>
              <p className="text-[10px] uppercase font-mono tracking-widest text-[#9A9A95] mb-1">Email</p>
              <p className="text-sm font-medium text-[#0E0E0C]">{student.email}</p>
            </div>
            {student.github_url && (
              <div>
                <p className="text-[10px] uppercase font-mono tracking-widest text-[#9A9A95] mb-1">GitHub</p>
                <a href={student.github_url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-[#0F52BA] hover:underline flex items-center gap-1.5">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                    <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                  </svg>
                  {student.github_url.replace("https://github.com/", "")}
                </a>
              </div>
            )}
            {isScored && student.scored_at && (
              <div className="ml-auto text-right w-full sm:w-auto mt-4 sm:mt-0">
                <p className="text-[10px] uppercase font-mono tracking-widest text-[#9A9A95] mb-1">Last Updated</p>
                <p className="text-sm font-medium text-[#0E0E0C]">
                  {new Date(student.scored_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Top Repos & Languages */}
          <div className="lg:col-span-2 space-y-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            
            {student.languages && student.languages.length > 0 && (
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

            {student.top_repos && student.top_repos.length > 0 ? (
              <div className="bg-white border border-black/5 rounded-[2rem] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-serif text-xl font-bold text-[#0E0E0C] tracking-tight">Best Work</h3>
                  <a href={student.github_url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-[#0F52BA] hover:underline">
                    View GitHub →
                  </a>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {(student.top_repos as { name: string; description: string; url: string; stars: number; language: string }[]).map((repo) => (
                    <a
                      key={repo.name}
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-5 bg-[#FAFAFA] border border-black/5 rounded-2xl hover:bg-white hover:border-black/10 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1 transition-all group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-base font-bold text-[#0E0E0C] group-hover:text-[#0F52BA] transition-colors">{repo.name}</p>
                        {repo.stars > 0 && (
                          <div className="flex items-center gap-1.5 bg-white border border-black/5 px-2 py-0.5 rounded-md text-xs font-medium text-[#6A6A66] shadow-sm">
                            <span className="text-[#D97706]">★</span>
                            <span>{repo.stars}</span>
                          </div>
                        )}
                      </div>
                      {repo.description && (
                        <p className="text-sm text-[#6A6A66] mb-4 line-clamp-2 leading-relaxed">{repo.description}</p>
                      )}
                      {repo.language && (
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-[#0E0E0C]" />
                          <span className="text-xs font-mono font-medium text-[#9A9A95]">{repo.language}</span>
                        </div>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            ) : (
                <div className="bg-white border border-black/5 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center text-[#9A9A95]">
                  No public repositories found.
                </div>
            )}
          </div>

          {/* Right Column: Score Breakdown */}
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="bg-[#0E0E0C] text-white rounded-[2rem] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.15)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#0F52BA]/20 rounded-full filter blur-[80px] pointer-events-none" />
              
              <h3 className="font-serif text-xl font-bold mb-6 tracking-tight relative z-10">Score Breakdown</h3>
              
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
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}