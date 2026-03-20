"use client"

import { useRef, useState } from "react"
import * as htmlToImage from "html-to-image"
import VerifiedBadge from "./VerifiedBadge"

interface VerqifyCardProps {
  name: string
  score: number | string
  college: string
  topLanguage?: string
  avatar: string
}

export default function VerqifyCard({ name, score, college, topLanguage, avatar }: VerqifyCardProps) {
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
        className="relative w-[340px] h-[520px] bg-[#0E0E0C] rounded-[2.5rem] overflow-hidden shadow-2xl transition-all"
        style={{
          fontFamily: "'Inter', sans-serif",
          boxShadow: "0 30px 60px -12px rgba(0,0,0,0.5), 0 18px 36px -18px rgba(0,0,0,0.5)"
        }}
      >
        {/* --- 1. MESH BACKGROUND BLOBS --- */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Blue Blob - Top Right */}
          <div className="absolute -top-10 -right-10 w-72 h-72 bg-[#0F52BA] rounded-full filter blur-[80px] opacity-40 mix-blend-screen animate-pulse" style={{ animationDuration: '6s' }} />
          {/* Green/Emerald Blob - Center Left */}
          <div className="absolute top-[30%] -left-10 w-64 h-64 bg-[#0A7250] rounded-full filter blur-[90px] opacity-30 mix-blend-screen animate-pulse" style={{ animationDuration: '8s', animationDelay: '1s' }} />
          {/* Amber Blob - Bottom Right */}
          <div className="absolute -bottom-20 right-0 w-80 h-80 bg-[#D97706] rounded-full filter blur-[100px] opacity-20 mix-blend-screen animate-pulse" style={{ animationDuration: '7s', animationDelay: '2s' }} />
        </div>

        {/* --- 2. HOLOGRAPHIC SHIMMER OVERLAY --- */}
        <div 
          className="absolute inset-0 pointer-events-none z-10 opacity-30"
          style={{
            background: "linear-gradient(135deg, transparent 0%, transparent 45%, rgba(255,255,255,0.4) 50%, transparent 55%, transparent 100%)",
            backgroundSize: "250% 250%",
            backgroundPosition: "-20% -20%"
          }}
        />

        {/* --- 3. MAIN GLASS CONTAINER --- */}
        <div className="absolute inset-4 z-20 bg-white/[0.03] backdrop-blur-[30px] border border-white/10 rounded-[2rem] p-8 flex flex-col items-center shadow-2xl">
          
          {/* Card Header - Centered logo */}
          <div className="w-full flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center shadow-lg transform -rotate-6">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path d="M3 13L8 3L13 13" stroke="#0E0E0C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5 9.5H11" stroke="#0E0E0C" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="font-serif text-xl font-black text-white tracking-tight">Verqify</span>
            </div>
            <VerifiedBadge className="w-6 h-6 drop-shadow-[0_0_10px_rgba(15,82,186,0.5)]" />
          </div>

          {/* Builder Identity Panel */}
          <div className="flex flex-col items-center flex-1 w-full justify-center">
             <div className="relative mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-white/20 to-transparent p-[1px] rounded-full shadow-inner">
                  <div className="w-full h-full bg-gradient-to-br from-[#0F52BA] to-[#012A6B] rounded-full flex items-center justify-center border border-white/10">
                    <span className="font-serif text-4xl font-bold text-white tracking-tighter" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}>
                      {avatar}
                    </span>
                  </div>
                </div>
                {/* Micro Floating Tag */}
                <div className="absolute -right-2 bottom-1 bg-white text-[#0E0E0C] text-[7px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-full shadow-lg border border-black/5">
                   Verified
                </div>
             </div>
             
             <h2 className="font-serif text-3xl font-black text-white text-center leading-tight mb-1 truncate w-full px-2" style={{ textShadow: "0 4px 12px rgba(0,0,0,0.4)" }}>
               {name}
             </h2>
             <p className="text-white/50 text-[9px] uppercase font-mono tracking-[0.3em] text-center mb-10 truncate w-full px-4">
               {college || "Independent Builder"}
             </p>

             <div className="w-full grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col items-center group/stat shadow-inner">
                   <p className="text-[8px] uppercase font-black tracking-widest text-[#BFD4FF] mb-2 group-hover/stat:text-white transition-colors">Verqify Score</p>
                   <p className="font-serif text-4xl font-bold text-white leading-none">
                     {score}
                   </p>
                </div>
                <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col items-center group/stat shadow-inner">
                   <p className="text-[8px] uppercase font-black tracking-widest text-[#A7D7C5] mb-2 group-hover/stat:text-white transition-colors">Top Stack</p>
                   <p className="font-mono text-[10px] font-bold text-white uppercase tracking-tighter mt-1 truncate max-w-full">
                     {topLanguage || "Fullstack"}
                   </p>
                </div>
             </div>
          </div>

          {/* Card Footer / Holographic Strip */}
          <div className="w-full mt-auto">
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6" />
            <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-[0.3em] text-white/30 px-1">
               <span>Trust Mark 2.0</span>
               <div className="flex items-center gap-1.5">
                 <div className="w-1.5 h-1.5 rounded-full bg-[#0F52BA] animate-pulse" />
                 <span>Verqify Protocol</span>
               </div>
            </div>
          </div>
        </div>

        {/* --- 4. GLASS REFLECTION --- */}
        <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden opacity-20">
           <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-tr from-transparent via-white/10 to-transparent rotate-45 transform translate-y-[-10%]" />
        </div>
      </div>
      
      {/* External Action Button */}
      <div className="mt-8 flex flex-col items-center gap-4">
        <button 
          onClick={downloadCard}
          disabled={downloading}
          className="group relative flex items-center gap-3 bg-[#0E0E0C] text-white px-10 py-4 rounded-2xl text-sm font-bold shadow-2xl hover:shadow-[#0F52BA]/30 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50"
        >
          {downloading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          )}
          <span>Download Trading Card</span>
          <div className="absolute inset-0 rounded-2xl border border-white/10 group-hover:border-white/20 transition-colors pointer-events-none" />
        </button>

        <p className="text-[9px] text-[#6A6A66] uppercase font-black tracking-[0.3em] max-w-[280px] text-center leading-relaxed">
          Optimized for LinkedIn & X verified feed sharing
        </p>
      </div>
    </div>
  )
}
