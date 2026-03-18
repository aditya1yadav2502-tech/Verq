"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  async function handleSignup() {
    setLoading(true)
    setMessage("")

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    })

    if (error) {
      setMessage(error.message)
      setLoading(false)
      return
    }

    await supabase.from("students").insert({ name, email })

    setMessage("Check your email for a verification link!")
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-[#F6F5F1] flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md">

        <div className="flex items-center gap-2 mb-8">
          <div className="w-7 h-7 bg-[#0F52BA] rounded-lg flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M3 13L8 3L13 13" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 9.5H11" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-serif text-lg font-medium text-[#0E0E0C]">verq</span>
        </div>

        <h1 className="font-serif text-3xl text-[#0E0E0C] mb-2">
          Create your account
        </h1>
        <p className="text-sm text-[#6A6A66] mb-8">
          Use your college email to verify your enrollment.
        </p>

        <div className="bg-white border border-black/10 rounded-2xl p-6 shadow-sm">

          <div className="mb-4">
            <label className="block text-sm font-medium text-[#0E0E0C] mb-1.5">
              Full name
            </label>
            <input
              type="text"
              placeholder="Aditya Yadav"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#F6F5F1] border border-black/10 rounded-lg px-3 py-2.5 text-sm text-[#0E0E0C] placeholder:text-[#9A9A95] outline-none focus:border-[#0F52BA] transition-colors"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-[#0E0E0C] mb-1.5">
              College email
            </label>
            <input
              type="email"
              placeholder="you@iitd.ac.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#F6F5F1] border border-black/10 rounded-lg px-3 py-2.5 text-sm text-[#0E0E0C] placeholder:text-[#9A9A95] outline-none focus:border-[#0F52BA] transition-colors"
            />
            <p className="text-xs text-[#9A9A95] mt-1.5">
              Must be a .ac.in, .edu, or recognised college email
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-[#0E0E0C] mb-1.5">
              Password
            </label>
            <input
              type="password"
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#F6F5F1] border border-black/10 rounded-lg px-3 py-2.5 text-sm text-[#0E0E0C] placeholder:text-[#9A9A95] outline-none focus:border-[#0F52BA] transition-colors"
            />
          </div>

          {message && (
            <div className="mb-4 p-3 bg-[#E4F4EE] border border-[#9FE1CB] rounded-lg text-sm text-[#085041]">
              {message}
            </div>
          )}

          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full bg-[#0F52BA] text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-[#0a45a0] transition-colors disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>

        </div>

        <p className="text-center text-sm text-[#6A6A66] mt-4">
          Already have an account?{" "}
          <span className="text-[#0F52BA] font-medium cursor-pointer hover:underline">
            Sign in
          </span>
        </p>

      </div>
    </main>
  )
}