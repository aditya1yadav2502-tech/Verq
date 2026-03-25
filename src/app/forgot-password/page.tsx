"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  async function handleReset() {
    setLoading(true)
    setMessage("")
    
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email)

    if (error) {
      setMessage(error.message)
    } else {
      setMessage("Check your email for a password reset link.")
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-6 selection:bg-brand/20 relative overflow-hidden font-sans">
      
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-brand/5 rounded-full filter blur-[120px] pointer-events-none -translate-y-1/2 -translate-x-1/2" />

      <div className="w-full max-w-md relative z-10 animate-fade-in">

        <Link href="/" className="flex items-center justify-center gap-3 mb-12 group">
          <div className="w-10 h-10 bg-brand rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
             <span className="font-serif text-background font-black italic text-xl">V</span>
          </div>
          <span className="font-serif text-3xl font-black text-white tracking-tighter">Verqify</span>
        </Link>

        <div className="text-center mb-10">
          <h1 className="font-serif text-5xl text-white font-black mb-4 tracking-tighter">
            Recover Access
          </h1>
          <p className="text-foreground/40 font-medium italic font-serif-italic text-lg">
            Re-authorize your native terminal.
          </p>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 shadow-2xl">

          <div className="mb-8">
            <label className="block text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-3 ml-1">
              Terminal Identity
            </label>
            <input
              type="email"
              placeholder="you@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleReset()}
              className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-5 py-4 text-sm text-white placeholder:text-foreground/20 outline-none focus:border-brand/40 focus:bg-white/[0.04] transition-all"
            />
          </div>

          {message && (
            <div className={`mb-8 p-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-center ${
              message.includes("Check your email") 
                ? "bg-brand/10 border border-brand/20 text-brand-light"
                : "bg-red-500/10 border border-red-500/20 text-red-400"
            }`}>
              {message}
            </div>
          )}

          <button
            onClick={handleReset}
            disabled={loading}
            className="w-full bg-white/5 border border-white/10 text-white text-[11px] font-black uppercase tracking-widest py-4.5 rounded-full hover:bg-white/10 transition-all disabled:opacity-50 py-4 active:scale-95"
          >
            {loading ? "Transmitting..." : "Send link"}
          </button>

        </div>

        <p className="text-center text-[11px] font-black uppercase tracking-widest text-foreground/30 mt-10">
          Remember secret?{" "}
          <Link href="/signin" className="text-white hover:text-brand-light transition-colors underline underline-offset-4">
            Authorize Native
          </Link>
        </p>

      </div>
    </main>
  )
}
