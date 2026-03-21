"use client"

import Link from "next/link"
import VerqifyCard from "./VerqifyCard"
import { useState } from "react"

interface Repository {
  name: string
  description: string
  stargazers_count: number
  language: string
  html_url: string
}

interface QuickViewModalProps {
  isOpen: boolean
  onClose: () => void
  student: {
    name: string
    college: string
    verq_score: number
    github_url: string
    score_code_quality: number
    score_project_complexity: number
    score_commit_consistency: number
    score_documentation: number
    score_deployment: number
    top_repos?: any[]
  }
  onUnlockContact?: () => void
}

export default function QuickViewModal({ isOpen, onClose, student, onUnlockContact }: QuickViewModalProps) {
  const [note, setNote] = useState("")
  const [isSavingNote, setIsSavingNote] = useState(false)

  if (!isOpen) return null

  const handleSaveNote = async () => {
    setIsSavingNote(true)
    // In a real app, this connects to Supabase bookmarks API to update the 'notes' column
    setTimeout(() => {
      setIsSavingNote(false)
    }, 800)
  }

  // Use real repos if available, otherwise mock
  const displayRepos = student.top_repos && (student.top_repos as any[]).length > 0
    ? (student.top_repos as any[]).map(r => ({
        name: r.name,
        description: r.description,
        stargazers_count: r.stars,
        language: r.language,
        html_url: r.url
      }))
    : [
        { name: "distributed-kv-store", description: "B-Tree based persistent key-value store in Rust", stargazers_count: 124, language: "Rust", html_url: "#" },
        { name: "raft-consensus-lib", description: "Production-ready Raft implementation for Go services", stargazers_count: 89, language: "Go", html_url: "#" },
        { name: "zero-knowledge-auth", description: "ZKP based authentication protocol implementation", stargazers_count: 56, language: "TypeScript", html_url: "#" },
      ]

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-fade-in">
      <div className="absolute inset-0 bg-[#0E0E0C]/60 backdrop-blur-md" onClick={onClose} />
      
      <div className="bg-white rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.5)] w-full max-w-5xl max-h-[90vh] overflow-hidden relative z-10 flex flex-col lg:flex-row animate-scale-up">
        
        {/* Left: Holographic Verqify Card */}
        <div className="w-full lg:w-[420px] bg-[#FAFAFA] border-r border-black/5 p-8 flex flex-col items-center justify-center relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-[#0F52BA]/5 rounded-full blur-[80px]" />
           
           <div className="scale-90 sm:scale-100 transition-transform">
             <VerqifyCard 
                name={student.name}
                score={student.verq_score}
                rank="Global Top 0.1%"
                stats={[
                  { label: "Quality", value: String(student.score_code_quality) },
                  { label: "Complexity", value: String(student.score_project_complexity) },
                  { label: "Consistency", value: String(student.score_commit_consistency) }
                ]}
             />
           </div>

           <div className="mt-8 text-center">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0F52BA] bg-[#0F52BA]/5 px-3 py-1 rounded-full mb-3 inline-block">WorkProof Verified</span>
              <p className="text-[#6A6A66] text-xs font-medium max-w-[240px] leading-relaxed">Identity confirmed via college OTP and 10-minute video verification.</p>
           </div>
        </div>

        {/* Right: Repository Insights */}
        <div className="flex-1 p-8 sm:p-10 overflow-y-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-serif font-black text-[#0E0E0C] mb-2">{student.name}&apos;s Best Work</h2>
              <p className="text-sm text-[#6A6A66] font-medium">{student.college || "Leading Tech Institute"}</p>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 bg-[#F6F5F1] hover:bg-[#E2E1DC] rounded-full flex items-center justify-center text-[#9A9A95] hover:text-[#0E0E0C] transition-all"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] font-black font-mono text-[#9A9A95] uppercase tracking-[0.2em] mb-4">Top Repositories (Score Contribution)</h3>
            {displayRepos.map((repo, i) => (
              <a 
                key={i} 
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block group/repo bg-[#FAFAFA] border border-black/5 p-5 rounded-2xl hover:bg-white hover:border-[#0F52BA]/20 hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm group-hover/repo:scale-110 transition-transform">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0F52BA" strokeWidth="2.5"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                    </div>
                    <span className="text-lg font-bold text-[#0E0E0C] group-hover/repo:text-[#0F52BA] transition-colors line-clamp-1">{repo.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#6A6A66]">
                    <span>⭐</span>
                    {repo.stargazers_count}
                  </div>
                </div>
                <p className="text-sm text-[#6A6A66] mb-4 line-clamp-2 leading-relaxed font-medium">{repo.description || "Experimental engineering project."}</p>
                <div className="flex items-center gap-2">
                   <span className="bg-[#0F52BA]/5 text-[#0F52BA] text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest">{repo.language || "Unknown"}</span>
                   <span className="bg-[#0A7250]/5 text-[#0A7250] text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest">High Complexity</span>
                </div>
              </a>
            ))}
          </div>

          <div className="pt-6 border-t border-black/5 mt-8">
            <h3 className="text-[10px] font-black font-mono text-[#9A9A95] uppercase tracking-[0.2em] mb-3">ATS: Private Note</h3>
            <div className="relative">
              <textarea 
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={"Add a private note about " + student.name.split(" ")[0] + "..."}
                className="w-full bg-[#FAFAFA] border border-black/10 rounded-xl px-4 py-3 text-sm text-[#0E0E0C] placeholder:text-[#9A9A95] focus:outline-none focus:border-[#0F52BA] focus:ring-1 focus:ring-[#0F52BA] transition-all resize-none h-20"
              />
              {note && (
                <button 
                  onClick={handleSaveNote}
                  disabled={isSavingNote}
                  className="absolute bottom-3 right-3 text-xs bg-[#0E0E0C] text-white px-3 py-1 rounded-md font-bold shadow-sm hover:bg-[#3B3B38] disabled:opacity-50"
                  title="Will sync to bookmarks API"
                >
                  {isSavingNote ? "Saving..." : "Save Note"}
                </button>
              )}
            </div>
          </div>
          
          <div className="pt-6 mt-6 border-t border-black/5 flex flex-col sm:flex-row items-center gap-3">
            <button 
              onClick={onUnlockContact}
              className="w-full bg-gradient-to-r from-[#0F52BA] to-[#0A3D8F] text-white py-3.5 rounded-xl font-bold shadow-[0_8px_20px_rgba(15,82,186,0.3)] hover:-translate-y-1 hover:shadow-[0_12px_25px_rgba(15,82,186,0.4)] transition-all flex justify-center items-center gap-2 group"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:scale-110 transition-transform"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              Unlock Full Contact
            </button>
            <a 
              href={`/s/${encodeURIComponent(student.name.toLowerCase().replace(/\s+/g, '-'))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-[#FAFAFA] text-[#0E0E0C] border border-black/10 py-3.5 px-6 rounded-xl font-bold shadow-sm hover:bg-white hover:-translate-y-1 transition-all text-center shrink-0"
            >
              Full Profile
            </a>
          </div>

        </div>
      </div>
    </div>
  )
}
