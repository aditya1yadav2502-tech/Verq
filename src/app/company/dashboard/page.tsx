import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import Navbar from "@/components/Navbar"

export default async function CompanyDashboardPage() {
  const supabase = await createClient()

  // 1. Verify user is a company
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.user_metadata?.role !== "company") {
    redirect("/signin") // Kick normal students or unauthenticated users out
  }

  // 2. Fetch company profile
  const { data: company } = await supabase
    .from("companies")
    .select("*")
    .eq("email", user.email)
    .single()

  // 3. Fetch bookmarked students
  const { data: bookmarks } = await supabase
    .from("bookmarks")
    .select("student_email, students!inner(name, college, verq_score, score_code_quality, score_project_complexity)")
    .eq("company_email", user.email)
    .order("created_at", { ascending: false })

  function getScoreColor(score: number) {
    if (score >= 70) return "text-[#0A7250] bg-[#E4F4EE]"
    if (score >= 40) return "text-[#0F52BA] bg-[#E8EFFE]"
    return "text-[#D97706] bg-[#FEF3C7]"
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA] pt-24 pb-20 selection:bg-[#0F52BA]/20 relative overflow-hidden">
      <Navbar />

      {/* Decorative Orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#0F52BA]/5 rounded-full filter blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#0A7250]/5 rounded-full filter blur-[100px] pointer-events-none translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-5xl mx-auto px-6 relative z-10 animate-slide-up">
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <h1 className="font-serif text-4xl sm:text-5xl text-[#0E0E0C] font-bold mb-3 tracking-tight">
              Hey, {company?.company_name || "Hiring Team"} 👋
            </h1>
            <p className="text-lg text-[#6A6A66]">
              Here are the elite builders you've shortlisted.
            </p>
          </div>
          <Link
            href="/explore"
            className="inline-block bg-[#0E0E0C] text-white text-sm font-semibold px-6 py-3.5 rounded-2xl shadow-[0_4px_14px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 transition-all text-center"
          >
            Explore talent database
          </Link>
        </div>

        {!bookmarks || bookmarks.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-xl border border-black/5 rounded-[2rem] p-16 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center animate-fade-in">
            <div className="w-16 h-16 bg-[#F6F5F1] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="font-serif text-3xl">⭐</span>
            </div>
            <p className="font-serif text-2xl text-[#0E0E0C] font-bold mb-2">Your shortlist is empty</p>
            <p className="text-[#6A6A66] mb-8 max-w-sm mx-auto leading-relaxed">
              Browse the explore page to discover and natively bookmark the most impressive software engineers in India.
            </p>
            <Link
              href="/explore"
              className="inline-block px-8 py-3.5 bg-white border border-black/10 text-[#0E0E0C] text-sm font-semibold rounded-2xl hover:bg-[#FAFAFA] hover:shadow-sm transition-all"
            >
              Start exploring
            </Link>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-xl border border-black/5 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-black/5 bg-[#FAFAFA]">
                    <th className="px-8 py-5 text-xs font-semibold text-[#9A9A95] uppercase tracking-widest">Builder</th>
                    <th className="px-8 py-5 text-xs font-semibold text-[#9A9A95] uppercase tracking-widest hidden sm:table-cell">College</th>
                    <th className="px-8 py-5 text-xs font-semibold text-[#9A9A95] uppercase tracking-widest text-right">Verq Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {bookmarks?.map((b: any) => {
                    const student = b.students;
                    return (
                      <tr key={b.student_email} className="hover:bg-[#FAFAFA] transition-colors group">
                        <td className="px-8 py-6">
                          <Link href={`/s/${encodeURIComponent(student.name)}`} className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#0F52BA] to-[#0A3D8F] rounded-xl flex items-center justify-center p-0.5 shadow-inner">
                              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                                <span className="font-serif text-lg text-[#0F52BA] font-bold">
                                  {student.name?.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <span className="text-base font-bold text-[#0E0E0C] group-hover:text-[#0F52BA] transition-colors">
                              {student.name}
                            </span>
                          </Link>
                        </td>
                        <td className="px-8 py-6 hidden sm:table-cell">
                          <span className="text-sm font-medium text-[#6A6A66]">{student.college || "—"}</span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-4">
                            <span className={`text-sm font-mono font-bold px-3 py-1 rounded-full ${getScoreColor(student.verq_score)} shadow-sm`}>
                              {student.verq_score}
                            </span>
                            <Link
                              href={`/s/${encodeURIComponent(student.name)}`}
                              className="text-xs font-semibold text-[#0E0E0C] bg-white border border-black/10 px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 peer-focus:opacity-100 hover:bg-[#FAFAFA] transition-all duration-200"
                            >
                              View
                            </Link>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
