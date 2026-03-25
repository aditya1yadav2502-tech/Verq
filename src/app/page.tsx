"use client"

import Navbar from "@/components/Navbar"
import Link from "next/link"
import PulseFeed from "@/components/PulseFeed"
import { Suspense, useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function Home() {
  const [viewMode, setViewMode] = useState<"builder" | "company">("builder")
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }: { data: { user: any } }) => {
      const user = data.user
      const saved = localStorage.getItem("verqify_view_mode")

      if (user) {
        const role = user.user_metadata?.role || "builder"
        setViewMode(role as "builder" | "company")
        localStorage.setItem("verqify_view_mode", role)
        return
      }

      if (!saved) {
        router.push("/role-selection")
        return
      }

      if (saved === "company" || saved === "builder") {
        setViewMode(saved)
      }
    })

    const handleStorage = () => {
      const mode = localStorage.getItem("verqify_view_mode")
      if (mode === "company" || mode === "builder") {
        setViewMode(mode)
      }
    }

    window.addEventListener("view_mode_changed", handleStorage)
    return () => window.removeEventListener("view_mode_changed", handleStorage)
  }, [router])


  return (
    <main className="min-h-screen bg-background text-foreground overflow-hidden selection:bg-brand/20 relative bg-grain">
      {/* Dynamic background lighting */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand/10 rounded-full filter blur-[150px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand/5 rounded-full filter blur-[200px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <Suspense fallback={<div className="h-16 w-full" />}>
        <Navbar />
      </Suspense>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 sm:pt-52 sm:pb-32 px-6 overflow-hidden z-10 min-h-[90vh] flex flex-col justify-center">
        <div className="max-w-6xl mx-auto relative w-full">
          <div className="flex flex-col items-center text-center">
            
            <div className="animate-fade-in-up" style={{ animationDelay: '0.1s', opacity: 0, animationFillMode: 'forwards' }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 shadow-[0_4px_16px_rgba(0,0,0,0.5)] text-[10px] font-black uppercase tracking-[0.2em] text-foreground-muted mb-8 hover:bg-white/10 transition-colors cursor-default backdrop-blur-md">
                <span className="flex h-2 w-2 rounded-full bg-brand animate-pulse shadow-[0_0_8px_rgba(0,230,91,0.8)]"></span>
                Protocol v2.0 Operational
              </div>
            </div>
            
            <h1 className="font-serif text-6xl sm:text-8xl lg:text-[8rem] tracking-tighter leading-[0.85] mb-8 max-w-5xl animate-fade-in-up" style={{ animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards' }}>
              Hired for what you <span className="font-serif-italic text-shine italic relative whitespace-nowrap">
                built.
                <svg className="absolute -bottom-2 sm:-bottom-4 left-0 w-full" viewBox="0 0 100 20" preserveAspectRatio="none" style={{height: '0.25em'}}>
                  <path d="M0 10 Q 50 20 100 10" fill="none" stroke="var(--brand-green)" strokeWidth="4" strokeLinecap="round" className="animate-pulse" style={{ animationDuration: '3s' }}/>
                </svg>
              </span><br/>
              Not what you claimed.
            </h1>
            
            <p className="text-lg sm:text-2xl text-foreground-muted mb-12 leading-relaxed max-w-2xl mx-auto font-medium animate-fade-in-up" style={{ animationDelay: '0.3s', opacity: 0, animationFillMode: 'forwards' }}>
              Every builder on Verqify is natively analyzed and scored based on source code. <br className="hidden sm:block" /> No resumes. No noise. Just proof of work.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center w-full sm:w-auto animate-fade-in-up" style={{ animationDelay: '0.4s', opacity: 0, animationFillMode: 'forwards' }}>
              <Link
                href={viewMode === "builder" ? "/signup" : "/company/signup"}
                className="w-full sm:w-auto px-10 py-5 bg-white text-background text-sm font-black uppercase tracking-widest rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_10px_40px_rgba(255,255,255,0.2)] hover:shadow-[0_15px_50px_rgba(255,255,255,0.4)] relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/20 to-transparent -translate-x-[150%] skew-x-[-15deg] group-hover:animate-shine transition-all z-0" />
                <span className="relative z-10">{viewMode === "builder" ? "Get your Skill Fingerprint" : "Browse Verified Builders"}</span>
              </Link>
              <Link
                href="/explore"
                className="w-full sm:w-auto px-10 py-4 glass-card border border-white/10 text-white text-sm font-black uppercase tracking-widest rounded-full hover:bg-white/10 hover:border-white/20 transition-all duration-300 active:scale-95"
              >
                {viewMode === "builder" ? "View Leaderboard" : "Hire Through Verqify"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Bento Dashboard Preview */}
      <section className="relative z-20 pb-20 px-6 -mt-10 sm:-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="glass-card rounded-[3rem] p-4 sm:p-10 shadow-[0_20px_80px_rgba(0,0,0,0.8)] border border-white/10 transform perspective-1000 animate-slide-up" style={{ animationDelay: '0.6s', opacity: 0, animationFillMode: 'forwards' }}>
            <div className="bg-background/80 rounded-[2rem] border border-white/5 w-full aspect-[16/9] relative overflow-hidden flex items-center justify-center">
              {/* Fake Dashboard UI */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand/5 to-transparent mix-blend-overlay" />
              <div className="grid grid-cols-3 gap-6 w-full h-full p-8">
                <div className="col-span-1 border border-white/5 rounded-2xl bg-white/5 p-6 backdrop-blur-md relative overflow-hidden">
                   <div className="w-10 h-10 rounded-full bg-brand/20 flex items-center justify-center mb-6"><span className="text-brand">⚡</span></div>
                   <div className="h-4 w-1/2 bg-white/10 rounded mb-4" />
                   <div className="h-3 w-3/4 bg-white/5 rounded mb-2" />
                   <div className="h-3 w-2/3 bg-white/5 rounded" />
                   <div className="absolute bottom-6 left-6 right-6 h-2 bg-white/5 rounded-full overflow-hidden"><div className="w-3/4 h-full bg-brand rounded-full" /></div>
                </div>
                <div className="col-span-2 border border-white/5 rounded-2xl bg-white/5 p-6 backdrop-blur-md relative overflow-hidden h-full">
                   <div className="flex justify-between items-center mb-8">
                     <div className="h-4 w-1/4 bg-white/10 rounded" />
                     <div className="h-8 w-24 bg-white/10 rounded-full" />
                   </div>
                   <div className="space-y-4">
                     {[1,2,3].map(i => (
                       <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                         <div className="flex items-center gap-4">
                           <div className="w-8 h-8 rounded-lg bg-white/10" />
                           <div>
                             <div className="h-3 w-24 bg-white/20 rounded mb-2" />
                             <div className="h-2 w-16 bg-white/5 rounded" />
                           </div>
                         </div>
                         <div className="h-4 w-12 bg-white/10 rounded-full" />
                       </div>
                     ))}
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid: How it works & Metrics */}
      <section className="px-6 py-20 relative z-10 max-w-6xl mx-auto">
        <div className="mb-16 text-center">
           <h2 className="font-serif text-5xl sm:text-6xl text-white font-bold tracking-tighter">System Architecture</h2>
           <p className="text-foreground-muted mt-4 text-lg">The three pillars of verified abstraction.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Bento Box 1 */}
          <div className="md:col-span-1 glass-card rounded-[2.5rem] p-10 hover:bg-white/[0.04] transition-colors group">
            <span className="font-serif-italic text-6xl text-brand/20 italic block mb-6 leading-none group-hover:text-brand transition-colors duration-500">01</span>
            <h3 className="font-serif text-3xl font-bold mb-4 tracking-tight text-white">Enrollment Verification</h3>
            <p className="text-foreground-muted leading-relaxed font-medium">
              Direct university API integration or manual ID verification to confirm active student status and graduation year.
            </p>
          </div>
          
          {/* Bento Box 2 */}
          <div className="md:col-span-2 glass-card rounded-[2.5rem] p-10 hover:bg-white/[0.04] transition-colors relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 rounded-full filter blur-[80px] group-hover:bg-brand/10 transition-colors duration-500 pointer-events-none" />
            <span className="font-serif-italic text-6xl text-brand/20 italic block mb-6 leading-none group-hover:text-brand transition-colors duration-500">02</span>
            <h3 className="font-serif text-3xl font-bold mb-4 tracking-tight text-white">Identity & Work Quality Base</h3>
            <p className="text-foreground-muted leading-relaxed font-medium max-w-xl">
              Proof of identity across social profiles. Once verified, AI-driven code audits paired with manual peer review score documentation, logic, and deployment consistency automatically.
            </p>
          </div>

          {/* Metrics Bento row */}
          {[
            { label: "Verified Base", value: "24", unit: "k+" },
            { label: "Manually Reviewed", value: "100", unit: "%" },
            { label: "Verification Layers", value: "3", unit: "" },
            { label: "Cost to Students", value: "₹0", unit: "" }
          ].map((stat, i) => (
            <div key={i} className={`glass-card rounded-[2.5rem] p-8 flex flex-col justify-center items-center text-center ${i === 0 ? 'md:col-span-1' : ''} hover:-translate-y-1 transition-transform cursor-default group`}>
              <p className="text-[10px] font-black font-mono text-foreground-muted uppercase tracking-[0.3em] mb-4">{stat.label}</p>
              <p className="font-serif text-5xl font-bold tracking-tighter text-white flex items-baseline justify-center gap-1 group-hover:text-brand transition-colors duration-300">
                {stat.value}
                {stat.unit && <span className="text-xl text-foreground-muted">{stat.unit}</span>}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Live Market Pulse Section */}
      <section className="px-6 py-20 relative z-10 max-w-6xl mx-auto">
        <PulseFeed />
      </section>

      {/* Skill Fingerprint Preview */}
      <section className="px-6 py-32 relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
             <div className="inline-flex items-center gap-2 px-3 py-1.5 glass-card rounded-full text-[10px] font-black uppercase tracking-widest text-brand-light mb-8 border-brand/20">
               <span className="w-1.5 h-1.5 bg-brand rounded-full animate-pulse" />
               Native Analysis Protocol
             </div>
             <h2 className="font-serif text-6xl sm:text-7xl mb-8 tracking-tighter leading-[0.9] text-white">
               Five dimensions of<br/>real technical <span className="font-serif-italic italic text-shine">signal.</span>
             </h2>
             <p className="text-foreground-muted text-lg leading-relaxed mb-10 max-w-md font-medium">
               Resumes are noise. We natively audit commit history natively via GitHub—scoring abstraction ability, deployment cleanliness, and consistency over time.
             </p>
             <Link
                href="/explore"
                className="inline-flex items-center gap-3 text-white font-black uppercase tracking-[0.2em] text-xs group hover:text-brand-light transition-colors"
              >
                Browse verified profiles 
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-brand/20 transition-colors">
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>
          </div>

          <div className="glass-card rounded-[3rem] p-10 sm:p-14 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-brand/10 rounded-full filter blur-[100px] pointer-events-none group-hover:bg-brand/20 transition-colors duration-700" />
            
            <div className="flex items-center gap-6 mb-12 relative z-10">
               <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center font-serif text-3xl text-background font-black italic shadow-[0_0_30px_rgba(255,255,255,0.3)]">A</div>
               <div>
                 <p className="font-serif text-3xl font-bold text-white tracking-tight">Aditya Yadav</p>
                 <p className="text-[10px] uppercase font-mono tracking-widest text-brand-light mt-1 flex items-center gap-2">
                   <span className="w-1.5 h-1.5 rounded-full bg-brand" />
                   Verified Builder • top 0.1%
                 </p>
               </div>
            </div>

            <div className="space-y-6 relative z-10">
              {[
                { name: "Code Quality", pct: 92 },
                { name: "Complexity", pct: 88 },
                { name: "Consistency", pct: 98 },
                { name: "Documentation", pct: 76 },
                { name: "Deployment", pct: 82 },
              ].map((dim, i) => (
                <div key={dim.name} className="group/bar">
                  <div className="flex items-baseline justify-between mb-2">
                     <span className="text-[10px] font-black uppercase tracking-widest text-foreground-muted transition-colors group-hover/bar:text-white">{dim.name}</span>
                     <span className="text-[10px] text-brand-light font-black font-mono transition-transform group-hover/bar:scale-110">{dim.pct}%</span>
                  </div>
                  <div className="h-2 bg-black/40 rounded-full overflow-hidden relative shadow-inner">
                    <div
                      className="h-full bg-brand rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${dim.pct}%`, boxShadow: '0 0 10px rgba(0,230,91,0.5)' }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap gap-3 relative z-10">
               {["React", "TypeScript", "Node.js", "PostgreSQL", "AWS"].map(tag => (
                 <span key={tag} className="px-4 py-1.5 glass-card hover:bg-white/10 transition-colors cursor-default rounded-full text-[10px] font-bold text-white">{tag}</span>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-40 text-center relative z-10">
        <div className="max-w-4xl mx-auto relative glass-card p-20 rounded-[4rem] overflow-hidden border border-white/10 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-brand/10 to-transparent pointer-events-none" />
          <h1 className="font-serif text-7xl sm:text-[8rem] font-bold mb-10 tracking-tighter leading-[0.8] text-white relative z-10">
            Built with <br />
            <span className="text-shine font-serif-italic italic">intent.</span>
          </h1>
          <p className="text-xl sm:text-2xl text-foreground-muted mb-12 max-w-2xl mx-auto font-medium leading-relaxed relative z-10">
            Stop reading resumes. Start evaluating code. Join the future of technical sourcing today.
          </p>
          <div className="relative z-10">
            <Link
              href="/company/signup"
              className="inline-block px-12 py-6 bg-white text-background text-sm font-black uppercase tracking-widest rounded-full shadow-[0_15px_50px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/20 to-transparent -translate-x-[150%] skew-x-[-15deg] group-hover:animate-shine transition-all z-0" />
              <span className="relative z-10">Get Early Access</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-background px-6 py-20 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand rounded-full flex items-center justify-center font-serif text-xl text-background font-black italic shadow-inner">V</div>
              <span className="font-serif text-2xl font-bold tracking-tighter text-white">Verqify</span>
            </div>
            <p className="text-xs text-foreground-muted font-medium">© 2026 Verqify India. All rights reserved.</p>
          </div>
          <div className="flex items-center gap-10">
            {["Builders", "For Companies", "Leaderboard", "Search ATS"].map(item => (
              <Link key={item} href="#" className="text-[10px] font-black uppercase tracking-widest text-foreground-muted hover:text-white transition-colors">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </main>
  )
}