import { supabase } from "@/lib/supabase"

interface PageProps {
  params: { username: string }
}

export default async function StudentProfile({ params }: PageProps) {
  const { data: students } = await supabase
    .from("students")
    .select("name, email, college")

  const name = decodeURIComponent(params.username).trim()
  const student = students?.find(s => 
    s.name?.trim().toLowerCase() === name.toLowerCase()
  ) || students?.[0]

  if (!student) {
    return (
      <main className="min-h-screen bg-[#F6F5F1] flex items-center justify-center">
        <div className="text-center">
          <p className="font-serif text-2xl text-[#0E0E0C] mb-2">Student not found</p>
          <p className="text-sm text-[#6A6A66]">This profile does not exist yet.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#F6F5F1]">
      <nav className="flex items-center justify-between px-8 h-14 bg-[#F6F5F1]/90 backdrop-blur-sm border-b border-black/10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#0F52BA] rounded-lg flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M3 13L8 3L13 13" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 9.5H11" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-serif text-lg font-medium text-[#0E0E0C]">verq</span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="bg-white border border-black/10 rounded-2xl p-8 shadow-sm mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#E8EFFE] rounded-full flex items-center justify-center">
                <span className="font-serif text-2xl text-[#0F52BA] font-medium">
                  {student.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="font-serif text-2xl text-[#0E0E0C] mb-1">
                  {student.name}
                </h1>
                <p className="text-sm text-[#6A6A66]">
                  {student.college || "College not set"}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="font-serif text-4xl text-[#0E0E0C] leading-none mb-1">--</div>
              <div className="text-xs text-[#9A9A95] font-mono">Verq Score</div>
              <div className="text-xs bg-[#E4F4EE] text-[#0A7250] px-2 py-0.5 rounded-full font-mono mt-1">
                Pending verification
              </div>
            </div>
          </div>

          <div className="border-t border-black/06 pt-6">
            <p className="text-xs font-mono text-[#9A9A95] uppercase tracking-wider mb-3">
              Details
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-[#9A9A95] mb-1">Email</p>
                <p className="text-sm text-[#0E0E0C]">{student.email}</p>
              </div>
              <div>
                <p className="text-xs text-[#9A9A95] mb-1">College</p>
                <p className="text-sm text-[#0E0E0C]">{student.college || "Not set"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-black/10 rounded-2xl p-6 shadow-sm">
          <p className="text-xs font-mono text-[#9A9A95] uppercase tracking-wider mb-4">
            Verq Score Breakdown
          </p>
          {["Code quality", "Project complexity", "Commit consistency", "Documentation", "Deployment"].map((dim) => (
            <div key={dim} className="flex items-center gap-3 mb-3">
              <span className="text-sm text-[#6A6A66] w-40">{dim}</span>
              <div className="flex-1 h-1.5 bg-[#E2E1DC] rounded-full">
                <div className="h-1.5 bg-[#E2E1DC] rounded-full w-0"></div>
              </div>
              <span className="text-xs font-mono text-[#9A9A95]">--</span>
            </div>
          ))}
          <p className="text-xs text-[#9A9A95] mt-4">
            Score will appear after GitHub verification is complete.
          </p>
        </div>

      </div>
    </main>
  )
}