"use client"

import { useState } from "react"
import VerqifyCard from "./VerqifyCard"

export default function ShareModal({ student, topLanguage, fingerprint }: { student: any, topLanguage?: string, fingerprint: string }) {
  const [open, setOpen] = useState(false)
  
  const ButtonEl = (
    <button 
      onClick={() => setOpen(true)}
      className="w-full sm:w-auto px-8 py-4 bg-white text-background text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-brand transition-all flex items-center justify-center gap-2 shadow-xl shadow-white/5 active:scale-95"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
      Generate Verqify Card
    </button>
  )

  if (!open) {
    return ButtonEl;
  }

  return (
    <>
      {ButtonEl}

      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xl animate-fade-in" onClick={() => setOpen(false)}>
        <div className="relative animate-slide-up" onClick={e => e.stopPropagation()}>
          <button 
            onClick={() => setOpen(false)} 
            className="absolute -top-16 right-0 text-white/40 hover:text-white bg-white/5 border border-white/10 p-3 rounded-full hover:scale-105 transition-all"
            title="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          
          <VerqifyCard 
            name={student.name}
            fingerprint={fingerprint}
            college={student.college}
            topLanguage={topLanguage}
            avatar={student.name?.charAt(0).toUpperCase()}
          />
        </div>
      </div>
    </>
  )
}

