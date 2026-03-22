"use client"

import { useState } from "react"
import Link from "next/link"
import { getSkillFingerprint } from "@/lib/scoring"

interface Bookmark {
  student_email: string
  notes?: string
  status?: string
  students: {
    name: string
    college: string
    verq_score: number
    score_code_quality: number
    score_project_complexity: number
    score_commit_consistency: number
    score_documentation: number
    score_deployment: number
  }
}

export default function AtsTableClient({ initialBookmarks }: { initialBookmarks: Bookmark[] }) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks)

  function getScoreColor(score: number) {
    if (score >= 70) return "text-[#0A7250] bg-[#E4F4EE]"
    if (score >= 40) return "text-[#0F52BA] bg-[#E8EFFE]"
    return "text-[#D97706] bg-[#FEF3C7]"
  }

  const handleStatusChange = (email: string, newStatus: string) => {
    // In a real app, hit Supabase API
    setBookmarks(bookmarks.map(b => b.student_email === email ? { ...b, status: newStatus } : b))
  }

  const handleNoteChange = (email: string, newNote: string) => {
    // In a real app, hit Supabase API
    setBookmarks(bookmarks.map(b => b.student_email === email ? { ...b, notes: newNote } : b))
  }

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-black/5 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden animate-slide-up" style={{ animationDelay: '0.1s' }}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-black/5 bg-[#FAFAFA]">
              <th className="px-6 py-5 text-[10px] font-black text-[#9A9A95] uppercase tracking-[0.2em] w-1/4">Builder</th>
              <th className="px-6 py-5 text-[10px] font-black text-[#9A9A95] uppercase tracking-[0.2em] w-[25%] hidden sm:table-cell">Fingerprint</th>
              <th className="px-6 py-5 text-[10px] font-black text-[#9A9A95] uppercase tracking-[0.2em] w-[40%]">Private Note</th>
              <th className="px-6 py-5 text-[10px] font-black text-[#9A9A95] uppercase tracking-[0.2em] w-[20%] text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {bookmarks.map((b) => {
              const student = b.students;
              return (
                <tr key={b.student_email} className="hover:bg-[#FAFAFA] transition-colors group">
                  <td className="px-6 py-6 border-r border-black/5">
                    <Link href={`/s/${encodeURIComponent(student.name)}`} className="flex items-center gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#0F52BA] to-[#0A3D8F] rounded-xl flex items-center justify-center p-0.5 shadow-inner shrink-0">
                        <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                          <span className="font-serif sm:text-lg text-[#0F52BA] font-bold">
                            {student.name?.charAt(0).toUpperCase() || "?"}
                          </span>
                        </div>
                      </div>
                      <div className="min-w-0">
                        <span className="text-sm sm:text-base font-bold text-[#0E0E0C] group-hover:text-[#0F52BA] transition-colors truncate block">
                          {student.name}
                        </span>
                        <span className="text-[10px] sm:text-xs font-medium text-[#6A6A66] truncate block">{student.college || "—"}</span>
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell border-r border-black/5 align-middle">
                     <p className="text-[10px] font-medium text-[#6A6A66] leading-relaxed pr-2 text-balance w-full">
                      {getSkillFingerprint({
                        code_quality: student.score_code_quality,
                        project_complexity: student.score_project_complexity,
                        commit_consistency: student.score_commit_consistency,
                        documentation: student.score_documentation,
                        deployment: student.score_deployment
                      })}
                     </p>
                  </td>
                  <td className="px-6 py-4 border-r border-black/5">
                    <textarea 
                      value={b.notes || ""}
                      onChange={(e) => handleNoteChange(b.student_email, e.target.value)}
                      placeholder="Add an interview note..."
                      className="w-full h-12 bg-transparent border border-transparent hover:border-black/5 focus:border-[#0F52BA] focus:bg-white rounded-lg px-3 py-2 text-sm text-[#0E0E0C] placeholder:text-[#9A9A95] resize-none outline-none transition-all"
                    />
                  </td>
                  <td className="px-6 py-6 text-right">
                    <select
                      value={b.status || "saved"}
                      onChange={(e) => handleStatusChange(b.student_email, e.target.value)}
                      className={`text-xs font-bold uppercase tracking-widest px-3 py-2 rounded-lg border appearance-none outline-none cursor-pointer text-center w-full transition-colors ${
                        b.status === "hired" 
                          ? "bg-[#0A7250] text-white border-[#0A7250]" 
                          : b.status === "interviewing"
                          ? "bg-[#0F52BA] text-white border-[#0F52BA]"
                          : "bg-white text-[#0E0E0C] border-black/10 hover:border-black/20"
                      }`}
                    >
                      <option value="saved">Saved</option>
                      <option value="interviewing">Interviewing</option>
                      <option value="hired">Placed ✓</option>
                    </select>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
