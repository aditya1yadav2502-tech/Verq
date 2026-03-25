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
    <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden animate-slide-up relative" style={{ animationDelay: '0.1s' }}>
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="border-b border-white/5 bg-white/5">
              <th className="px-8 py-6 text-[10px] font-black text-foreground/20 uppercase tracking-[0.3em] w-1/4">Builder Protocol</th>
              <th className="px-8 py-6 text-[10px] font-black text-foreground/20 uppercase tracking-[0.3em] w-[25%] hidden sm:table-cell">Skill Fingerprint</th>
              <th className="px-8 py-6 text-[10px] font-black text-foreground/20 uppercase tracking-[0.3em] w-[40%]">Internal Log</th>
              <th className="px-8 py-6 text-[10px] font-black text-foreground/20 uppercase tracking-[0.3em] w-[20%] text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {bookmarks.map((b) => {
              const student = b.students;
              return (
                <tr key={b.student_email} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-8 py-8 border-r border-white/5">
                    <Link href={`/s/${encodeURIComponent(student.name)}`} className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center p-0.5 shadow-2xl shrink-0 group-hover:scale-110 group-hover:bg-brand transition-all">
                         <span className="font-serif text-xl text-white font-black italic group-hover:text-background transition-colors">
                            {student.name?.charAt(0).toUpperCase() || "?"}
                         </span>
                      </div>
                      <div className="min-w-0">
                        <span className="text-lg font-black text-white group-hover:text-brand-light transition-colors truncate block tracking-tighter">
                          {student.name}
                        </span>
                        <span className="text-[10px] font-black text-foreground/20 uppercase tracking-widest truncate block mt-1">{student.college || "Native Builder"}</span>
                      </div>
                    </Link>
                  </td>
                  <td className="px-8 py-6 hidden sm:table-cell border-r border-white/5 align-middle">
                     <p className="text-[12px] font-bold italic font-serif-italic text-foreground/40 leading-relaxed pr-6 text-balance w-full group-hover:text-white transition-colors duration-500">
                      "{getSkillFingerprint({
                        code_quality: student.score_code_quality,
                        project_complexity: student.score_project_complexity,
                        commit_consistency: student.score_commit_consistency,
                        documentation: student.score_documentation,
                        deployment: student.score_deployment
                      })}"
                     </p>
                  </td>
                  <td className="px-8 py-6 border-r border-white/5">
                    <textarea 
                      value={b.notes || ""}
                      onChange={(e) => handleNoteChange(b.student_email, e.target.value)}
                      placeholder="Append internal log entry..."
                      className="w-full h-16 bg-white/[0.02] border border-white/5 hover:border-white/10 focus:border-white/20 focus:bg-white/[0.04] rounded-2xl px-4 py-3 text-xs text-white placeholder:text-foreground/10 resize-none outline-none transition-all font-medium"
                    />
                  </td>
                  <td className="px-8 py-8 text-right">
                    <div className="relative group/select">
                      <select
                        value={b.status || "saved"}
                        onChange={(e) => handleStatusChange(b.student_email, e.target.value)}
                        className={`text-[10px] font-black uppercase tracking-[0.2em] px-5 py-3 rounded-full border appearance-none outline-none cursor-pointer text-center w-full transition-all shadow-xl active:scale-95 ${
                          b.status === "hired" 
                            ? "bg-brand text-background border-brand shadow-[0_0_20px_rgba(0,200,83,0.3)]" 
                            : b.status === "interviewing"
                            ? "bg-white text-background border-white"
                            : "bg-white/5 text-white/40 border-white/10 hover:border-white/20 hover:text-white"
                        }`}
                      >
                        <option value="saved">Index</option>
                        <option value="interviewing">Relay</option>
                        <option value="hired">Acquired ✓</option>
                      </select>
                    </div>
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
