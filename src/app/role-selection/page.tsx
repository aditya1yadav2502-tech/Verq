"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function RoleSelectionPage() {
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }: { data: { user: any } }) => {
      const user = data.user
      if (user) {
        const role = user.user_metadata?.role || "builder"
        localStorage.setItem("verqify_view_mode", role)
        window.dispatchEvent(new Event("view_mode_changed"))
        router.push(role === "company" ? "/company/dashboard" : "/dashboard")
      }
    })
  }, [router])

  const selectRole = (role: "builder" | "company") => {
    localStorage.setItem("verqify_view_mode", role)
    window.dispatchEvent(new Event("view_mode_changed"))
    router.push("/")
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-background text-white overflow-hidden selection:bg-brand/20 bg-grain">
      {/* Decorative Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-brand/10 rounded-full filter blur-[150px] opacity-70 animate-float" />
        <div className="absolute bottom-[10%] right-[20%] w-[500px] h-[500px] bg-white/5 rounded-full filter blur-[150px] opacity-60 animate-float" style={{ animationDelay: "2s" }} />
      </div>

      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="w-full max-w-[1000px] relative z-10"
      >
        <div className="text-center mb-16 px-4">
          <div className="inline-block px-4 py-1.5 rounded-full glass-card border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-foreground-muted mb-8 shadow-2xl">
            Identity Configuration
          </div>
          <h1 className="font-serif text-6xl sm:text-7xl text-white font-bold mb-6 tracking-tighter text-shine">
            Select Protocol.
          </h1>
          <p className="text-xl text-foreground-muted font-medium italic font-serif-italic max-w-lg mx-auto leading-relaxed">How should we index your presence today?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          {/* Builder Card */}
          <button
            onClick={() => selectRole("builder")}
            className="group relative flex flex-col items-start p-10 lg:p-12 glass-card rounded-[3.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:bg-white/[0.04] hover:border-brand/30 hover:scale-[1.02] transition-all duration-500 text-left overflow-hidden cursor-pointer"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand/10 rounded-full filter blur-[80px] group-hover:bg-brand/20 transition-all pointer-events-none duration-700" />
            <div className="w-20 h-20 bg-brand rounded-[1.5rem] flex items-center justify-center mb-10 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 shadow-[0_0_30px_rgba(0,230,91,0.4)]">
               <span className="font-serif text-background font-black italic text-4xl">B</span>
            </div>
            <h2 className="font-serif text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tighter">Native Builder</h2>
            <p className="text-foreground-muted leading-relaxed mb-12 font-medium text-lg italic font-serif-italic">
              Synchronize your source proof, generate your Skill Fingerprint, and manifest your career protocol.
            </p>
            <div className="mt-auto flex items-center gap-3 text-xs font-black font-mono uppercase tracking-[0.25em] text-brand-light group-hover:text-brand transition-colors">
              Initialize Protocol <span className="group-hover:translate-x-3 transition-transform duration-500">→</span>
            </div>
          </button>

          {/* Company Card */}
          <button
            onClick={() => selectRole("company")}
            className="group relative flex flex-col items-start p-10 lg:p-12 glass-card rounded-[3.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:bg-white/[0.04] hover:border-white/30 hover:scale-[1.02] transition-all duration-500 text-left overflow-hidden cursor-pointer"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full filter blur-[80px] group-hover:bg-white/10 transition-all pointer-events-none duration-700" />
            <div className="w-20 h-20 bg-white/10 border border-white/20 rounded-[1.5rem] flex items-center justify-center mb-10 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500 shadow-2xl backdrop-blur-md">
               <span className="font-serif text-white font-black italic text-4xl">R</span>
            </div>
            <h2 className="font-serif text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tighter">Talent Scout</h2>
            <p className="text-foreground-muted leading-relaxed mb-12 font-medium text-lg italic font-serif-italic">
              Verify pre-vetted builders, evaluate code fingerprints natively, and acquire top-tier engineering talent.
            </p>
            <div className="mt-auto flex items-center gap-3 text-xs font-black font-mono uppercase tracking-[0.25em] text-white/50 group-hover:text-white transition-colors">
              Access Ecosystem <span className="group-hover:translate-x-3 transition-transform duration-500">→</span>
            </div>
          </button>
        </div>
        
        <p className="text-center mt-16 text-foreground/30 text-[10px] font-black font-mono uppercase tracking-[0.3em]">
          Perspectives can be toggled via the landing interface.
        </p>
      </motion.div>
    </main>
  )
}

