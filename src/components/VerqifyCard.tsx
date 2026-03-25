"use client"

import { useRef, useState } from "react"
import * as htmlToImage from "html-to-image"
import VerifiedBadge from "./VerifiedBadge"

interface VerqifyCardProps {
  name: string
  fingerprint: string
  college?: string
  topLanguage?: string
  avatar?: string
  stats?: { label: string; value: string }[]
}

export default function VerqifyCard({ 
  name, 
  fingerprint, 
  college, 
  topLanguage, 
  avatar = name.charAt(0).toUpperCase(),
  stats
}: VerqifyCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [downloading, setDownloading] = useState(false)

  const downloadCard = async () => {
    if (!cardRef.current) return
    setDownloading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      const dataUrl = await htmlToImage.toPng(cardRef.current, { 
        quality: 1, 
        pixelRatio: 3,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left'
        }
      })
      const link = document.createElement("a")
      link.download = `verqify-${name.toLowerCase().replace(/\s+/g, '-')}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error("Failed to generate Verqify Card capture.", err)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="flex flex-col items-center">
      {/* 
          The Actual Downloadable Card 
          We use a fixed size (340x500) for a standard "Trading Card" aspect ratio.
      */}
      <div 
        ref={cardRef} 
        className="relative w-[340px] h-[520px] bg-[#0A0A0A] rounded-[2.5rem] overflow-hidden shadow-2xl transition-all"
        style={{
          fontFamily: "'Inter', sans-serif",
          boxShadow: "0 30px 60px -12px rgba(0,0,0,0.8), 0 18px 36px -18px rgba(0,0,0,0.9)"
        }}
      >
        {/* --- 1. MESH BACKGROUND BLOBS --- */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Brand Green Blob - Top Right */}
          <div className="absolute -top-10 -right-10 w-72 h-72 bg-brand rounded-full filter blur-[80px] opacity-20 mix-blend-screen animate-pulse" style={{ animationDuration: '6s' }} />
          {/* White/Silver Blob - Center Left */}
          <div className="absolute top-[30%] -left-10 w-64 h-64 bg-white/10 rounded-full filter blur-[90px] opacity-10 mix-blend-screen animate-pulse" style={{ animationDuration: '8s', animationDelay: '1s' }} />
        </div>

        {/* --- 2. HOLOGRAPHIC SHIMMER OVERLAY --- */}
        <div 
          className="absolute inset-0 pointer-events-none z-10 opacity-20"
          style={{
            background: "linear-gradient(135deg, transparent 0%, transparent 45%, rgba(255,255,255,0.4) 50%, transparent 55%, transparent 100%)",
            backgroundSize: "250% 250%",
            backgroundPosition: "-20% -20%"
          }}
        />

        {/* --- 3. MAIN GLASS CONTAINER --- */}
        <div className="absolute inset-4 z-20 bg-white/[0.02] backdrop-blur-[40px] border border-white/10 rounded-[2rem] p-8 flex flex-col items-center shadow-2xl">
          
          {/* Card Header - Centered logo */}
          <div className="w-full flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-brand rounded-full flex items-center justify-center shadow-lg transform -rotate-6 font-serif text-background font-black italic text-lg">
                V
              </div>
              <span className="font-serif text-xl font-black text-white tracking-tight">Verqify</span>
            </div>
            <VerifiedBadge className="w-7 h-7 drop-shadow-[0_0_15px_rgba(0,200,83,0.5)]" />
          </div>

          {/* Builder Identity Panel */}
          <div className="flex flex-col items-center flex-1 w-full justify-center">
             <div className="relative mb-8">
                <div className="w-28 h-28 bg-gradient-to-br from-white/10 to-transparent p-[1px] rounded-full shadow-2xl">
                  <div className="w-full h-full bg-brand rounded-full flex items-center justify-center border border-white/10 shadow-inner">
                    <span className="font-serif text-5xl font-bold text-background tracking-tighter italic">
                      {avatar}
                    </span>
                  </div>
                </div>
                {/* Micro Floating Tag */}
                <div className="absolute -right-3 bottom-0 bg-white text-background text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full shadow-2xl border border-black/5">
                   Verified
                </div>
             </div>
             
             <h2 className="font-serif text-4xl font-black text-white text-center leading-[0.9] mb-3 truncate w-full px-2 tracking-tighter">
               {name}
             </h2>
             <p className="text-foreground/40 text-[10px] uppercase font-mono tracking-[0.4em] text-center mb-8 truncate w-full px-4 font-bold">
               {college || "Independent Builder"}
             </p>

             <div className="w-full flex flex-col gap-5 mb-4">
                {stats ? (
                  <div className="grid grid-cols-2 gap-4">
                    {stats.map((s, i) => (
                      <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col items-center group/stat shadow-inner">
                         <p className="text-[8px] uppercase font-black tracking-widest text-foreground/40 mb-2 group-hover/stat:text-white transition-colors">{s.label}</p>
                         <p className="font-serif text-2xl font-bold text-white leading-none tracking-tight">
                           {s.value}
                         </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="bg-white/5 border border-white/5 rounded-[1.5rem] p-5 flex flex-col items-center group/stat shadow-inner w-full text-center">
                      <p className="text-[9px] uppercase font-black tracking-widest text-brand-light mb-3 group-hover/stat:text-white transition-colors">Skill Fingerprint</p>
                      <p className="font-serif-italic text-base font-bold text-white leading-tight text-balance italic italic">
                         "{fingerprint}"
                      </p>
                    </div>
                    <div className="bg-white/5 border border-white/5 rounded-[1.5rem] p-5 flex flex-col items-center group/stat shadow-inner w-full">
                      <p className="text-[9px] uppercase font-black tracking-widest text-foreground/40 mb-2 group-hover/stat:text-white transition-colors">Stack Signal</p>
                      <p className="font-mono text-[11px] font-black text-white uppercase tracking-tighter mt-1 truncate max-w-full">
                         {topLanguage || "Multi-stack"}
                      </p>
                    </div>
                  </>
                )}
             </div>
          </div>

          {/* Card Footer / Holographic Strip */}
          <div className="w-full mt-auto">
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />
            <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-[0.3em] text-foreground/20 px-1">
               <span>Native ID v2.0</span>
               <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                 <span>Verqify Protocol</span>
               </div>
            </div>
          </div>
        </div>

        {/* --- 4. GLASS REFLECTION --- */}
        <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden opacity-30">
           <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-tr from-transparent via-white/5 to-transparent rotate-45 transform translate-y-[-10%]" />
        </div>
      </div>
      
      {/* External Action Button */}
      <div className="mt-10 flex flex-col items-center gap-5">
        <button 
          onClick={downloadCard}
          disabled={downloading}
          className="group relative flex items-center gap-4 bg-white text-background px-12 py-5 rounded-full text-[11px] font-black uppercase tracking-widest shadow-2xl hover:bg-brand transition-all active:scale-95 disabled:opacity-50"
        >
          {downloading ? (
            <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          )}
          <span>Download Builder Card</span>
        </button>

        <p className="text-[10px] text-foreground/30 uppercase font-black tracking-[0.3em] max-w-[280px] text-center leading-relaxed">
          Optimized for manual review in elite ATS workflows
        </p>
      </div>
    </div>
  )
}
