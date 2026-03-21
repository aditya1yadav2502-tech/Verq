"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [githubUrl, setGithubUrl] = useState("")

  const [loading, setLoading] = useState(false)
  const [scoring, setScoring] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error">("success")
  const router = useRouter()

  async function handleGithubLogin() {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  async function handleSignup() {
    setLoading(true)
    setMessage("")

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setMessage("Please enter a valid college email address.")
      setMessageType("error")
      setLoading(false)
      return
    }

    const supabase = createClient()
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    })

    if (authError) {
      setMessage(authError.message)
      setMessageType("error")
      setLoading(false)
      return
    }

    await supabase.from("students").insert({
      name,
      email,
      github_url: githubUrl
    })

    setLoading(false)
    setMessage("Account created! Analyzing your GitHub...")
    setMessageType("success")

    if (githubUrl) {
      setScoring(true)
      try {
        const res = await fetch("/api/score", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ github_url: githubUrl }),
        })
        const data = await res.json()
        if (data.scores) {
          setMessage(`Your Verqify score: ${data.scores.overall}/100 🎉 Redirecting...`)
          setTimeout(() => router.push("/dashboard"), 1500)
        } else {
          setMessage("Account created! Redirecting...")
          setTimeout(() => router.push("/dashboard"), 1000)
        }
      } catch {
        setTimeout(() => router.push("/dashboard"), 1000)
      }
    } else {
      setTimeout(() => router.push("/dashboard"), 1000)
    }
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center px-6 py-20 selection:bg-[#0F52BA]/20 relative overflow-hidden">

      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#0F52BA]/10 rounded-full filter blur-[100px] pointer-events-none -translate-y-1/2 -translate-x-1/2" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#0A7250]/10 rounded-full filter blur-[100px] pointer-events-none translate-y-1/2 translate-x-1/2" />

      <div className="w-full max-w-md relative z-10 animate-fade-in">

        <Link href="/" className="flex items-center justify-center gap-2 mb-10 hover:scale-105 transition-transform">
          <div className="w-8 h-8 bg-gradient-to-br from-[#0F52BA] to-[#0A3D8F] rounded-full flex items-center justify-center shadow-inner">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" className="text-white drop-shadow-sm">
              <path fillRule="evenodd" d="M8 0a6 6 0 0 0-6 6c0 4.1 5.3 9.4 5.6 9.7a1 1 0 0 0 1.4 0C9.3 14.8 14 10.1 14 6a6 6 0 0 0-6-6Zm0 9a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
            </svg>
          </div>
          <span className="font-serif text-2xl font-bold text-[#0E0E0C] tracking-tight">Verqify</span>
        </Link>

        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl text-[#0E0E0C] font-bold mb-2 tracking-tight">
            Create your account
          </h1>
          <p className="text-[#6A6A66]">
            Use your college email to verify your enrollment.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-black/5 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] relative">

          <button
            onClick={handleGithubLogin}
            className="w-full bg-[#0E0E0C] text-white text-sm font-semibold py-3.5 rounded-2xl shadow-[0_4px_14px_rgb(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgb(0,0,0,0.15)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 mb-6"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
            </svg>
            Continue with GitHub
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="h-px bg-black/5 flex-1"></div>
            <span className="text-[10px] text-[#9A9A95] font-semibold uppercase font-mono tracking-widest">or sign up with email</span>
            <div className="h-px bg-black/5 flex-1"></div>
          </div>

          {scoring && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center rounded-[2rem] animate-fade-in">
              <div className="w-12 h-12 border-4 border-[#E8EFFE] border-t-[#0F52BA] rounded-full animate-spin mb-4"></div>
              <p className="text-sm font-semibold text-[#0E0E0C]">{message}</p>
              <p className="text-xs text-[#6A6A66] mt-2">This usually takes about 5 seconds.</p>
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6A6A66] mb-2 pl-1">
                Full name
              </label>
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#FAFAFA] border border-black/5 rounded-2xl px-4 py-3.5 text-sm text-[#0E0E0C] placeholder:text-[#9A9A95] outline-none focus:ring-2 focus:ring-[#0F52BA]/20 focus:border-[#0F52BA]/30 hover:bg-white transition-all inset-shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6A6A66] mb-2 pl-1">
                College email
              </label>
              <input
                type="email"
                placeholder="you@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#FAFAFA] border border-black/5 rounded-2xl px-4 py-3.5 text-sm text-[#0E0E0C] placeholder:text-[#9A9A95] outline-none focus:ring-2 focus:ring-[#0F52BA]/20 focus:border-[#0F52BA]/30 hover:bg-white transition-all inset-shadow-sm"
              />
              <p className="text-[10px] text-[#9A9A95] mt-2 pl-1">
                Must be a valid student email
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6A6A66] mb-2 pl-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#FAFAFA] border border-black/5 rounded-2xl px-4 py-3.5 text-sm text-[#0E0E0C] placeholder:text-[#9A9A95] outline-none focus:ring-2 focus:ring-[#0F52BA]/20 focus:border-[#0F52BA]/30 hover:bg-white transition-all inset-shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6A6A66] mb-2 pl-1">
                Public GitHub URL
              </label>
              <input
                type="url"
                placeholder="https://github.com/yourusername"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="w-full bg-[#FAFAFA] border border-black/5 rounded-2xl px-4 py-3.5 text-sm text-[#0E0E0C] placeholder:text-[#9A9A95] outline-none focus:ring-2 focus:ring-[#0F52BA]/20 focus:border-[#0F52BA]/30 hover:bg-white transition-all inset-shadow-sm"
              />
              <p className="text-[10px] text-[#9A9A95] mt-2 pl-1">
                This is what Verqify scores — make sure it is accurate.
              </p>
            </div>
          </div>

          {message && !scoring && (
            <div className={`mt-6 p-4 rounded-xl text-sm font-medium shadow-sm ${messageType === "error"
              ? "bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626]"
              : "bg-[#E4F4EE] border border-[#A7D7C5] text-[#0A7250]"
              }`}>
              {message}
            </div>
          )}

          <button
            onClick={handleSignup}
            disabled={loading || scoring}
            className="w-full mt-8 bg-gradient-to-r from-[#0F52BA] to-[#0A3D8F] text-white text-sm font-semibold py-3.5 rounded-2xl shadow-[0_4px_14px_rgba(15,82,186,0.2)] hover:shadow-[0_6px_20px_rgba(15,82,186,0.3)] hover:-translate-y-0.5 transition-all disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>

        </div>

        <p className="text-center text-sm font-medium text-[#6A6A66] mt-8">
          Already have an account?{" "}
          <Link href="/signin" className="text-[#0E0E0C] hover:text-[#0F52BA] transition-colors hover:underline">
            Sign in
          </Link>
        </p>

      </div>
    </main>
  )
}