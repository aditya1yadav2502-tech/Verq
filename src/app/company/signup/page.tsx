"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function CompanySignupPage() {
  const [companyName, setCompanyName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error">("success")
  const router = useRouter()

  async function handleSignup() {
    setLoading(true)
    setMessage("")

    const supabase = createClient()

    // 1. Sign up user with role metadata
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { 
          name: companyName,
          role: "company" 
        }
      }
    })

    if (authError) {
      setMessage(authError.message)
      setMessageType("error")
      setLoading(false)
      return
    }

    // 2. Insert into public.companies
    const { error: dbError } = await supabase.from("companies").insert({
      id: authData?.user?.id,
      email,
      company_name: companyName,
    })

    if (dbError) {
      console.error(dbError)
      // Supabase RLS or missing table might cause an error here
      setMessage("Account created, but failed to save company profile. Ensure database tables exist.")
      setMessageType("error")
      setLoading(false)
      setTimeout(() => router.push("/company/dashboard"), 2000)
      return
    }

    setLoading(false)
    setMessage("Company account created! Redirecting...")
    setMessageType("success")
    setTimeout(() => router.push("/company/dashboard"), 1000)
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center px-6 py-20 selection:bg-[#0F52BA]/20 relative overflow-hidden">
      
      {/* Orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#0F52BA]/10 rounded-full filter blur-[100px] pointer-events-none -translate-y-1/2 -translate-x-1/2" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#0A7250]/10 rounded-full filter blur-[100px] pointer-events-none translate-y-1/2 translate-x-1/2" />

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <Link href="/" className="flex items-center justify-center gap-2 mb-10 hover:scale-105 transition-transform">
          <div className="w-8 h-8 bg-gradient-to-br from-[#0E0E0C] to-[#3B3B38] rounded-full flex items-center justify-center shadow-inner">
             <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-white drop-shadow-sm">
              <path d="M3 13L8 3L13 13" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 9.5H11" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-serif text-2xl font-bold text-[#0E0E0C] tracking-tight">Verqify for companies</span>
        </Link>

        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl text-[#0E0E0C] font-bold mb-2 tracking-tight">
            Discover elite builders
          </h1>
          <p className="text-[#6A6A66]">
            Search, filter, and shortlist India's top verified developers.
          </p>
        </div>

        <form className="bg-white/80 backdrop-blur-xl border border-black/5 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)]" onSubmit={(e) => { e.preventDefault(); handleSignup(); }}>
          <div className="mb-5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#6A6A66] mb-2 pl-1">Company Name</label>
            <input
              type="text"
              placeholder="Acme Corp"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full bg-[#FAFAFA] border border-black/5 rounded-xl px-4 py-3.5 text-sm text-[#0E0E0C] placeholder:text-[#9A9A95] focus:bg-white focus:border-[#0F52BA]/50 focus:ring-4 focus:ring-[#0F52BA]/10 outline-none transition-all"
            />
          </div>

          <div className="mb-5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#6A6A66] mb-2 pl-1">Work Email</label>
            <input
              type="email"
              placeholder="you@acme.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#FAFAFA] border border-black/5 rounded-xl px-4 py-3.5 text-sm text-[#0E0E0C] placeholder:text-[#9A9A95] focus:bg-white focus:border-[#0F52BA]/50 focus:ring-4 focus:ring-[#0F52BA]/10 outline-none transition-all"
            />
          </div>

          <div className="mb-8">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#6A6A66] mb-2 pl-1">Password</label>
            <input
              type="password"
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#FAFAFA] border border-black/5 rounded-xl px-4 py-3.5 text-sm text-[#0E0E0C] placeholder:text-[#9A9A95] focus:bg-white focus:border-[#0F52BA]/50 focus:ring-4 focus:ring-[#0F52BA]/10 outline-none transition-all"
            />
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${
              messageType === "error"
                ? "bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626]"
                : "bg-[#E4F4EE] border border-[#A7D7C5] text-[#0A7250]"
            }`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !companyName || !email || !password}
            className="w-full bg-[#0E0E0C] text-white text-sm font-semibold py-4 rounded-xl shadow-[0_4px_14px_rgb(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgb(0,0,0,0.15)] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {loading ? "Creating account..." : "Create Verqify account"}
          </button>
        </form>

        <p className="text-center text-sm text-[#6A6A66] mt-8">
          Are you a student?{" "}
          <Link href="/signup" className="text-[#0E0E0C] font-semibold hover:underline">
            Sign up as builder
          </Link>
        </p>

      </div>
    </main>
  )
}
