import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import AtsTableClient from "./AtsTableClient"

export default async function CompanyDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ preview?: string }>;
}) {
  const { preview } = await searchParams;
  const isPreview = preview === "true";
  const supabase = await createClient()

  let user = null;
  let company = null;
  let bookmarks = null;

  if (isPreview) {
    // Mock data for preview
    user = { email: "demo@company.com" };
    company = { company_name: "Google (India)" };
    bookmarks = [
      {
        student_email: "siddharth@example.com",
        notes: "Strong system design skills. Scheduled technical round.",
        status: "interviewing",
        students: {
          name: "Siddharth Sharma",
          college: "IIT Delhi",
          verq_score: 94,
          score_code_quality: 92,
          score_project_complexity: 96
        }
      },
      {
        student_email: "ananya@example.com",
        students: {
          name: "Ananya Iyer",
          college: "BITS Pilani",
          verq_score: 88,
          score_code_quality: 85,
          score_project_complexity: 90
        }
      }
    ];
  } else {
    // 1. Verify user is a company
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser || authUser.user_metadata?.role !== "company") {
      redirect("/signin")
    }
    user = authUser;

    // 2. Fetch company profile
    const { data: companyData } = await supabase
      .from("companies")
      .select("*")
      .eq("email", user.email)
      .single()
    company = companyData;

    // 3. Fetch bookmarked students
    const { data: bookmarksData } = await supabase
      .from("bookmarks")
      .select("student_email, notes, status, students!inner(name, college, verq_score, score_code_quality, score_project_complexity)")
      .eq("company_email", user.email)
      .order("created_at", { ascending: false })
    bookmarks = bookmarksData;
  }

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
        <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-8 pb-8 border-b border-black/5">
          <div>
            <h1 className="font-serif text-5xl sm:text-6xl text-[#0E0E0C] font-bold mb-4 tracking-tighter">
              Hey, {company?.company_name || "Hiring Team"} 👋
            </h1>
            <p className="text-xl text-[#6A6A66] font-medium">
              Elite builders shortlisted for your engineering team.
            </p>
          </div>
          <Link
            href="/explore"
            className="inline-flex items-center justify-center gap-2 bg-[#0E0E0C] text-white text-base font-bold px-8 py-4 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-all group"
          >
            <span>Explore talent database</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
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
          <AtsTableClient initialBookmarks={bookmarks.map((b: any) => ({
             ...b,
             students: Array.isArray(b.students) ? b.students[0] : b.students
          }))} />
        )}
      </div>
    </main>
  )
}
