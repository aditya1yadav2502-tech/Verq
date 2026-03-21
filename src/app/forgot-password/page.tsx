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
    <main className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center px-6 selection:bg-[#0F52BA]/20 relative overflow-hidden">
      
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#0F52BA]/10 rounded-full filter blur-[100px] pointer-events-none -translate-y-1/2 -translate-x-1/2" />

      <div className="w-full max-w-md relative z-10 animate-fade-in">

        <Link href="/" className="flex items-center justify-center gap-2 mb-10 hover:scale-105 transition-transform">
          <div className="w-8 h-8 bg-gradient-to-br from-[#0F52BA] to-[#0A3D8F] rounded-full flex items-center justify-center shadow-inner">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" className="text-white drop-shadow-sm">
              <path fillRule="evenodd" d="M8 0a6 6 0 0 0-6 6c0 4.1 5.3 9.4 5.6 9.7a1 1 0 0 0 1.4 0C9.3 14.8 14 10.1 14 6a6 6 0 0 0-6-6Zm0 9a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"/>
            </svg>
          </div>
          <span className="font-serif text-2xl font-bold text-[#0E0E0C] tracking-tight">Verqify</span>
        </Link>

        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl text-[#0E0E0C] font-bold mb-2 tracking-tight">
            Reset password
          </h1>
          <p className="text-[#6A6A66]">
            Enter your email to receive a recovery link.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-black/5 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">

          <div className="mb-8">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#6A6A66] mb-2 pl-1">
              Email
            </label>
            <input
              type="email"
              placeholder="you@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleReset()}
              className="w-full bg-[#FAFAFA] border border-black/5 rounded-2xl px-4 py-3.5 text-sm text-[#0E0E0C] placeholder:text-[#9A9A95] outline-none focus:ring-2 focus:ring-[#0F52BA]/20 focus:border-[#0F52BA]/30 hover:bg-white transition-all inset-shadow-sm"
            />
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-xl text-sm font-medium shadow-sm ${
              message.includes("Check your email") 
                ? "bg-[#E4F4EE] border border-[#A7D7C5] text-[#0A7250]"
                : "bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626]"
            }`}>
              {message}
            </div>
          )}

          <button
            onClick={handleReset}
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#0F52BA] to-[#0A3D8F] text-white text-sm font-semibold py-3.5 rounded-2xl shadow-[0_4px_14px_rgba(15,82,186,0.2)] hover:shadow-[0_6px_20px_rgba(15,82,186,0.3)] hover:-translate-y-0.5 transition-all disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send link"}
          </button>

        </div>

        <p className="text-center text-sm font-medium text-[#6A6A66] mt-8">
          Remember it?{" "}
          <Link href="/signin" className="text-[#0E0E0C] hover:text-[#0F52BA] transition-colors hover:underline">
            Back to sign in
          </Link>
        </p>

      </div>
    </main>
  )
}
