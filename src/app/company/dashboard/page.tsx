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
    <main className="min-h-screen bg-[#F6F5F1] pt-14">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="font-serif text-3xl text-[#0E0E0C] mb-1">
              Hey, {company?.company_name || "Hiring Team"} 👋
            </h1>
            <p className="text-sm text-[#6A6A66]">
              Here are the builders you've shortlisted.
            </p>
          </div>
          <Link
            href="/explore"
            className="hidden sm:inline-block bg-[#0E0E0C] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#3B3B38] transition-colors"
          >
            Explore more builders
          </Link>
        </div>

        {!bookmarks || bookmarks.length === 0 ? (
          <div className="bg-white border border-black/10 rounded-2xl p-12 shadow-sm text-center">
            <div className="w-12 h-12 bg-[#F6F5F1] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-xl">⭐</span>
            </div>
            <p className="font-serif text-xl text-[#0E0E0C] mb-2">Your shortlist is empty</p>
            <p className="text-sm text-[#6A6A66] mb-6">
              Browse the explore page to discover and bookmark top student talent.
            </p>
            <Link
              href="/explore"
              className="inline-block bg-[#0E0E0C] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#3B3B38] transition-colors"
            >
              Start exploring
            </Link>
          </div>
        ) : (
          <div className="bg-white border border-black/10 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-black/10 bg-[#FAFAFA]">
                    <th className="px-6 py-4 text-xs font-mono text-[#6A6A66] uppercase tracking-wider font-medium">Builder</th>
                    <th className="px-6 py-4 text-xs font-mono text-[#6A6A66] uppercase tracking-wider font-medium">College</th>
                    <th className="px-6 py-4 text-xs font-mono text-[#6A6A66] uppercase tracking-wider font-medium text-right">Verq Score</th>
                    <th className="px-6 py-4 text-xs font-mono text-[#6A6A66] uppercase tracking-wider font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {bookmarks.map((b: any) => {
                    const student = b.students;
                    return (
                      <tr key={b.student_email} className="hover:bg-[#FAFAFA] transition-colors group">
                        <td className="px-6 py-4">
                          <Link href={`/s/${encodeURIComponent(student.name)}`} className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-[#E8EFFE] rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="font-serif text-sm text-[#0F52BA] font-medium">
                                {student.name?.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="text-sm font-medium text-[#0E0E0C] group-hover:text-[#0F52BA] transition-colors">
                              {student.name}
                            </span>
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-[#6A6A66]">{student.college || "—"}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={`text-sm font-mono font-semibold px-2 py-0.5 rounded-full ${getScoreColor(student.verq_score)}`}>
                            {student.verq_score}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <Link
                            href={`/s/${encodeURIComponent(student.name)}`}
                            className="text-sm text-[#0F52BA] hover:underline font-medium"
                          >
                            View full profile →
                          </Link>
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
