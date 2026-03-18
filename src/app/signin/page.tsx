"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SigninPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const router = useRouter()

  async function handleGithubLogin() {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
  }

  async function handleSignin() {
    setLoading(true)
    setMessage("")

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setMessage(error.message)
      setLoading(false)
      return
    }

    router.push("/dashboard")
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

        <h1 className="font-serif text-3xl text-[#0E0E0C] mb-2">
          Welcome back
        </h1>
        <p className="text-sm text-[#6A6A66] mb-8">
          Sign in to view your Verq score and profile.
        </p>

        <div className="bg-white border border-black/10 rounded-2xl p-6 shadow-sm">

          <button
            onClick={handleGithubLogin}
            className="w-full bg-[#24292e] text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-[#1b1f23] transition-colors flex items-center justify-center gap-2 mb-6"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
            </svg>
            Continue with GitHub
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="h-px bg-black/10 flex-1"></div>
            <span className="text-xs text-[#9A9A95] uppercase font-mono tracking-wider">or sign in with email</span>
            <div className="h-px bg-black/10 flex-1"></div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-[#0E0E0C] mb-1.5">
              Email
            </label>
            <input
              type="email"
              placeholder="you@iitd.ac.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSignin()}
              className="w-full bg-[#F6F5F1] border border-black/10 rounded-lg px-3 py-2.5 text-sm text-[#0E0E0C] placeholder:text-[#9A9A95] outline-none focus:border-[#0F52BA] transition-colors"
            />
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium text-[#0E0E0C] mb-1.5">
              Password
            </label>
            <input
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSignin()}
              className="w-full bg-[#F6F5F1] border border-black/10 rounded-lg px-3 py-2.5 text-sm text-[#0E0E0C] placeholder:text-[#9A9A95] outline-none focus:border-[#0F52BA] transition-colors"
            />
          </div>
          <div className="mb-6 text-right">
            <Link href="/forgot-password" className="text-xs text-[#0F52BA] hover:underline">
              Forgot password?
            </Link>
          </div>

          {message && (
            <div className="mb-4 p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-lg text-sm text-[#DC2626]">
              {message}
            </div>
          )}

          <button
            onClick={handleSignin}
            disabled={loading}
            className="w-full bg-[#0F52BA] text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-[#0a45a0] transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

        </div>

        <p className="text-center text-sm text-[#6A6A66] mt-4">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-[#0F52BA] font-medium hover:underline">
            Sign up
          </Link>
        </p>

      </div>
    </main>
  )
}
