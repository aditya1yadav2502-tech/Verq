"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [message, setMessage] = useState("")

  async function handleReset() {
    setLoading(true)
    setMessage("")

    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
    })

    if (error) {
      setMessage(error.message)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-[#F6F5F1] flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md">

        <Link href="/" className="flex items-center gap-2 mb-8">
          <div className="w-7 h-7 bg-[#0F52BA] rounded-lg flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M3 13L8 3L13 13" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 9.5H11" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-serif text-lg font-medium text-[#0E0E0C]">verq</span>
        </Link>

        {sent ? (
          <div className="bg-white border border-black/10 rounded-2xl p-8 shadow-sm text-center">
            <div className="w-12 h-12 bg-[#E4F4EE] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0A7250" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h1 className="font-serif text-2xl text-[#0E0E0C] mb-2">Check your email</h1>
            <p className="text-sm text-[#6A6A66] mb-6">
              We sent a password reset link to <strong className="text-[#0E0E0C]">{email}</strong>. Click the link to reset your password.
            </p>
            <Link href="/signin" className="text-sm text-[#0F52BA] font-medium hover:underline">
              ← Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <h1 className="font-serif text-3xl text-[#0E0E0C] mb-2">Reset password</h1>
            <p className="text-sm text-[#6A6A66] mb-8">
              Enter your email and we&apos;ll send you a link to reset your password.
            </p>

            <div className="bg-white border border-black/10 rounded-2xl p-6 shadow-sm">
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#0E0E0C] mb-1.5">Email</label>
                <input
                  type="email"
                  placeholder="you@iitd.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleReset()}
                  className="w-full bg-[#F6F5F1] border border-black/10 rounded-lg px-3 py-2.5 text-sm text-[#0E0E0C] placeholder:text-[#9A9A95] outline-none focus:border-[#0F52BA] transition-colors"
                />
              </div>

              {message && (
                <div className="mb-4 p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-lg text-sm text-[#DC2626]">
                  {message}
                </div>
              )}

              <button
                onClick={handleReset}
                disabled={loading || !email}
                className="w-full bg-[#0F52BA] text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-[#0a45a0] transition-colors disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send reset link"}
              </button>
            </div>

            <p className="text-center text-sm text-[#6A6A66] mt-4">
              Remember your password?{" "}
              <Link href="/signin" className="text-[#0F52BA] font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </>
        )}

      </div>
    </main>
  )
}
