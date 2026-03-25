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
          score_project_complexity: 96,
          score_commit_consistency: 90,
          score_documentation: 85,
          score_deployment: 88,
        }
      },
      {
        student_email: "ananya@example.com",
        students: {
          name: "Ananya Iyer",
          college: "BITS Pilani",
          verq_score: 88,
          score_code_quality: 85,
          score_project_complexity: 90,
          score_commit_consistency: 80,
          score_documentation: 75,
          score_deployment: 82,
        }
      }
    ];
  } else {
    // 1. Verify user is a company
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) {
      redirect("/signin")
    }
    if (authUser.user_metadata?.role !== "company") {
      redirect("/dashboard")
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
      .select("student_email, notes, status, students!inner(name, college, verq_score, score_code_quality, score_project_complexity, score_commit_consistency, score_documentation, score_deployment)")
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
    <main className="min-h-screen bg-background pt-32 pb-20 selection:bg-brand/20 relative overflow-hidden font-sans">
      <Navbar />

      {/* Decorative Orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand/5 rounded-full filter blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/5 rounded-full filter blur-[100px] pointer-events-none translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-6xl mx-auto px-6 relative z-10 animate-slide-up">
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-10 pb-12 border-b border-white/5">
          <div>
            <h1 className="font-serif text-6xl sm:text-7xl text-white font-black mb-6 tracking-tighter">
              Hey, {company?.company_name || "Hiring Team"} 👋
            </h1>
            <p className="text-xl text-foreground/40 font-medium italic font-serif-italic">
              Acquiring the next generation of engineering talent.
            </p>
          </div>
          <Link
            href="/explore"
            className="inline-flex items-center justify-center gap-3 bg-brand text-background text-[11px] font-black uppercase tracking-widest px-10 py-5 rounded-full shadow-2xl hover:bg-brand-light transition-all group active:scale-95"
          >
            <span>Explore ecosystem</span>
            <span className="group-hover:translate-x-2 transition-transform duration-500">→</span>
          </Link>
        </div>

        {!bookmarks || bookmarks.length === 0 ? (
          <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[3.5rem] p-20 text-center animate-fade-in shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 rounded-full filter blur-3xl pointer-events-none" />
            <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
              <span className="font-serif text-3xl font-black italic text-white/20">S</span>
            </div>
            <p className="font-serif text-3xl text-white font-black mb-4 tracking-tighter">Search list empty</p>
            <p className="text-foreground/40 mb-10 max-w-sm mx-auto leading-relaxed font-medium italic font-serif-italic text-lg">
              Synchronize with the builder registry to manifest your engineering pipeline.
            </p>
            <Link
              href="/explore"
              className="inline-block px-10 py-5 bg-white/5 border border-white/10 text-white text-[11px] font-black uppercase tracking-widest rounded-full hover:bg-white/10 transition-all active:scale-95"
            >
              Initialize Registry
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
