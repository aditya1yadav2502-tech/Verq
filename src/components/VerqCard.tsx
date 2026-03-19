"use client"

import { useRef, useState } from "react"
import * as htmlToImage from "html-to-image"
import VerifiedBadge from "./VerifiedBadge"

interface VerqCardProps {
  name: string
  score: number | string
  college: string
  topLanguage?: string
  avatar: string
}

export default function VerqCard({ name, score, college, topLanguage, avatar }: VerqCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [downloading, setDownloading] = useState(false)

  const downloadCard = async () => {
    if (!cardRef.current) return
    setDownloading(true)
    try {
      // Small timeout ensures the DOM has fully painted any dynamic fonts/assets before capture
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const dataUrl = await htmlToImage.toPng(cardRef.current, { 
        quality: 1, 
        pixelRatio: 3, // High-res export for sharing
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left'
        }
      })
      
      const link = document.createElement("a")
      link.download = `verq-${name.toLowerCase().replace(/\\s+/g, '-')}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error("Failed to generate Verq Card capture.", err)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="flex flex-col items-center">
      {/* The Actual Downloadable Card */}
      <div 
        ref={cardRef} 
        className="relative w-[340px] h-[480px] bg-gradient-to-br from-[#0E0E0C] via-[#1A1A18] to-[#0E0E0C] rounded-[2rem] p-8 text-white shadow-2xl overflow-hidden"
      >
        {/* Glow Effects */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#0F52BA] rounded-full filter blur-[80px] opacity-40 mix-blend-screen" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#0A7250] rounded-full filter blur-[80px] opacity-30 mix-blend-screen" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white/[0.02] rounded-full filter blur-xl border border-white/5 pointer-events-none" />
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center shadow-inner">
               <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M3 13L8 3L13 13" stroke="#0E0E0C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 9.5H11" stroke="#0E0E0C" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-serif text-xl font-bold tracking-tight">verq</span>
          </div>
          <VerifiedBadge className="w-6 h-6" />
        </div>

        {/* Core Content */}
        <div className="flex flex-col items-center justify-center flex-1 h-[65%] relative z-10 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-white to-[#E8EFFE] p-1 rounded-full mb-6 shadow-[0_0_30px_rgba(15,82,186,0.3)]">
            <div className="w-full h-full bg-gradient-to-br from-[#0F52BA] to-[#0A3D8F] rounded-full flex items-center justify-center">
              <span className="font-serif text-4xl font-bold text-white shadow-sm">{avatar}</span>
            </div>
          </div>
          
          <h2 className="font-serif text-3xl font-bold mb-1 truncate w-full px-2" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>{name}</h2>
          <p className="text-white/60 text-sm mb-6 truncate w-full px-4">{college || "Builder"}</p>
          
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6" />
          
          <div className="flex items-center justify-center gap-6 w-full px-2">
            <div className="flex-1 flex flex-col items-center">
              <div className="text-[10px] uppercase tracking-widest text-[#A7D7C5] mb-1 font-mono font-semibold">Verq Score</div>
              <div className="font-serif text-5xl font-bold" style={{ textShadow: "0 0 20px rgba(10,114,80,0.4)" }}>{score}</div>
            </div>
            {topLanguage && (
              <div className="w-[1px] h-12 bg-white/20" />
            )}
            {topLanguage && (
              <div className="flex-1 flex flex-col items-center">
                <div className="text-[10px] uppercase tracking-widest text-[#BFD4FF] mb-1 font-mono font-semibold">Top Stack</div>
                <div className="font-mono text-xl mt-3 font-semibold text-white/90 truncate max-w-full px-1">{topLanguage}</div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-6 left-0 right-0 text-center text-[10px] text-white/40 tracking-widest font-mono uppercase bg-black/20 py-2 border-y border-white/5 backdrop-blur-md">
          india's verified builder network
        </div>
      </div>
      
      {/* External Action Button */}
      <button 
        onClick={downloadCard}
        disabled={downloading}
        className="mt-6 flex items-center gap-2 bg-gradient-to-r from-[#0E0E0C] to-[#1A1A18] border border-black/10 text-white px-8 py-3.5 rounded-2xl text-sm font-semibold shadow-[0_8px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_rgba(15,82,186,0.3)] hover:-translate-y-1 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
      >
        {downloading ? (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        )}
        Download trading card
      </button>
      <p className="text-xs text-[#6A6A66] mt-3 max-w-[260px] text-center">
        Export this card to natively share your Verq score on LinkedIn or Twitter.
      </p>
    </div>
  )
}
