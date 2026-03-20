"use client"

import { useState } from "react"
import VerqifyCard from "./VerqifyCard"

export default function ShareModal({ student, topLanguage }: { student: any, topLanguage?: string }) {
  const [open, setOpen] = useState(false)
  
  const ButtonEl = (
    <button 
      onClick={() => setOpen(true)}
      className="w-full sm:w-auto mt-4 sm:mt-0 bg-[#0F52BA] text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-[0_4px_14px_rgba(15,82,186,0.2)] hover:shadow-[0_6px_20px_rgba(15,82,186,0.3)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
      Share Verqify Card
    </button>
  )

  if (!open) {
    return ButtonEl;
  }

  return (
    <>
      {ButtonEl}

      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#FAFAFA]/80 backdrop-blur-md animate-fade-in" onClick={() => setOpen(false)}>
        <div className="relative animate-slide-up" onClick={e => e.stopPropagation()}>
          <button 
            onClick={() => setOpen(false)} 
            className="absolute -top-14 right-0 text-[#6A6A66] hover:text-[#0E0E0C] bg-white border border-black/5 p-2.5 rounded-full shadow-sm transition-all hover:scale-105"
            title="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          
          <VerqifyCard 
            name={student.name}
            score={student.verq_score}
            college={student.college}
            topLanguage={topLanguage}
            avatar={student.name.charAt(0).toUpperCase()}
          />
        </div>
      </div>
    </>
  )
}
