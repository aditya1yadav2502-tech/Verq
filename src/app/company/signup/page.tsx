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
    const { error: authError } = await supabase.auth.signUp({
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
    <main className="min-h-screen bg-[#F6F5F1] flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center gap-2 mb-8">
          <div className="w-7 h-7 bg-[#0E0E0C] rounded-lg border border-black/20 flex items-center justify-center">
             <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M3 13L8 3L13 13" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 9.5H11" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-serif text-lg font-medium text-[#0E0E0C]">verq for companies</span>
        </Link>

        <h1 className="font-serif text-3xl text-[#0E0E0C] mb-2">
          Discover verified builders
        </h1>
        <p className="text-sm text-[#6A6A66] mb-8">
          Create a company account to search, filter, and shortlist India's best student developers.
        </p>

        <div className="bg-white border border-black/10 rounded-2xl p-6 shadow-sm">
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#0E0E0C] mb-1.5">Company Name</label>
            <input
              type="text"
              placeholder="Acme Corp"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full bg-[#F6F5F1] border border-black/10 rounded-lg px-3 py-2.5 text-sm text-[#0E0E0C] placeholder:text-[#9A9A95] outline-none focus:border-[#0E0E0C] transition-colors"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-[#0E0E0C] mb-1.5">Work Email</label>
            <input
              type="email"
              placeholder="you@acme.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#F6F5F1] border border-black/10 rounded-lg px-3 py-2.5 text-sm text-[#0E0E0C] placeholder:text-[#9A9A95] outline-none focus:border-[#0E0E0C] transition-colors"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-[#0E0E0C] mb-1.5">Password</label>
            <input
              type="password"
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#F6F5F1] border border-black/10 rounded-lg px-3 py-2.5 text-sm text-[#0E0E0C] placeholder:text-[#9A9A95] outline-none focus:border-[#0E0E0C] transition-colors"
            />
          </div>

          {message && (
            <div className={`mb-4 p-3 rounded-lg text-sm ${
              messageType === "error"
                ? "bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626]"
                : "bg-[#E4F4EE] border border-[#9FE1CB] text-[#085041]"
            }`}>
              {message}
            </div>
          )}

          <button
            onClick={handleSignup}
            disabled={loading || !companyName || !email || !password}
            className="w-full bg-[#0E0E0C] text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-[#3B3B38] transition-colors disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create company account"}
          </button>
        </div>

        <p className="text-center text-sm text-[#6A6A66] mt-4">
          Are you a student?{" "}
          <Link href="/signup" className="text-[#0E0E0C] font-medium hover:underline">
            Sign up as builder
          </Link>
        </p>

      </div>
    </main>
  )
}
