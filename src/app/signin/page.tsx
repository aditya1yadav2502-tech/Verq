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
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  async function handleSignin() {
    setLoading(true)
    setMessage("")

    const supabase = createClient()
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setMessage(error.message)
      setLoading(false)
      return
    }

    if (authData.user?.user_metadata?.role === "company") {
      localStorage.setItem("verq_view_mode", "company")
      window.dispatchEvent(new Event("view_mode_changed"))
      router.push("/company/dashboard")
    } else {
      localStorage.setItem("verq_view_mode", "builder")
      window.dispatchEvent(new Event("view_mode_changed"))
      router.push("/dashboard")
    }
  }

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-6 selection:bg-brand/20 relative overflow-hidden font-sans">
      
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand/5 rounded-full filter blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-white/5 rounded-full filter blur-[120px] pointer-events-none translate-y-1/2 -translate-x-1/2" />

      <div className="w-full max-w-md relative z-10 animate-fade-in">

        <Link href="/" className="flex items-center justify-center gap-3 mb-12 group">
          <div className="w-10 h-10 bg-brand rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
             <span className="font-serif text-background font-black italic text-xl">V</span>
          </div>
          <span className="font-serif text-3xl font-black text-white tracking-tighter">Verqify</span>
        </Link>

        <div className="text-center mb-10">
          <h1 className="font-serif text-5xl text-white font-black mb-4 tracking-tighter">
            Welcome back
          </h1>
          <p className="text-foreground/40 font-medium italic font-serif-italic text-lg">
            Synchronize your native signal.
          </p>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 shadow-2xl">

          <button
            onClick={handleGithubLogin}
            className="w-full bg-white text-background text-[11px] font-black uppercase tracking-widest py-4.5 rounded-full shadow-2xl hover:bg-brand transition-all flex items-center justify-center gap-3 mb-8 py-4 active:scale-95"
          >
            <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
              <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
            </svg>
            Continue with GitHub
          </button>

          <div className="flex items-center gap-5 mb-8">
            <div className="h-px bg-white/5 flex-1"></div>
            <span className="text-[9px] text-foreground/20 font-black uppercase tracking-[0.3em]">native access</span>
            <div className="h-px bg-white/5 flex-1"></div>
          </div>

          <div className="mb-6">
            <label className="block text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-3 ml-1">
              Terminal Identity
            </label>
            <input
              type="email"
              placeholder="you@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSignin()}
              className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-5 py-4 text-sm text-white placeholder:text-foreground/20 outline-none focus:border-brand/40 focus:bg-white/[0.04] transition-all"
            />
          </div>

          <div className="mb-4">
            <label className="block text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-3 ml-1">
              Secret Key
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSignin()}
              className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-5 py-4 text-sm text-white placeholder:text-foreground/20 outline-none focus:border-brand/40 focus:bg-white/[0.04] transition-all"
            />
          </div>
          
          <div className="mb-10 text-right">
            <Link href="/forgot-password" className="text-[10px] font-black uppercase tracking-widest text-brand-light hover:underline pr-1">
              Recover Access
            </Link>
          </div>

          {message && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-[11px] font-black uppercase tracking-widest text-red-400 text-center">
              {message}
            </div>
          )}

          <button
            onClick={handleSignin}
            disabled={loading}
            className="w-full bg-white/5 border border-white/10 text-white text-[11px] font-black uppercase tracking-widest py-4.5 rounded-full hover:bg-white/10 transition-all disabled:opacity-50 py-4 active:scale-95"
          >
            {loading ? "Establishing Link..." : "Initialize Session"}
          </button>

        </div>

        <p className="text-center text-[11px] font-black uppercase tracking-widest text-foreground/30 mt-10">
          New indices required?{" "}
          <Link href="/signup" className="text-white hover:text-brand-light transition-colors underline underline-offset-4">
            Create Identity
          </Link>
        </p>

      </div>
    </main>
  )
}
