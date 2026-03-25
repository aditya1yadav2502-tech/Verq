"use client"

import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState, Suspense } from "react"
import { useSearchParams, usePathname } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import SignOutButton from "./SignOutButton"

function NavbarContent() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const isCompanyPreview = searchParams.get("preview") === "true"
  const [localViewMode, setLocalViewMode] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    
    const saved = localStorage.getItem("verqify_view_mode")
    setLocalViewMode(saved)

    const handleStorage = () => {
      const mode = localStorage.getItem("verqify_view_mode")
      setLocalViewMode(mode)
    }
    window.addEventListener("view_mode_changed", handleStorage)

    const supabase = createClient()
    supabase.auth.getUser().then(({ data }: { data: { user: User | null } }) => {
      setUser(data.user)
      if (data.user?.user_metadata?.role) {
        setRole(data.user.user_metadata.role)
      }
      setLoading(false)
    })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("view_mode_changed", handleStorage)
    }
  }, [])

  const isCompanyMode = role === "company" || isCompanyPreview || pathname.startsWith("/company") || (!user && localViewMode === "company")

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 animate-fade-in-up">
      <nav 
        className={`flex items-center justify-between px-6 h-14 max-w-5xl rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          scrolled ? "w-full max-w-4xl glass-card border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.8)]" : "w-full bg-transparent border border-transparent"
        }`}
      >
        {/* Logo */}
        <Link 
          href="/" 
          className="flex items-center gap-2 relative z-10 transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center shadow-[0_0_15px_rgba(0,230,91,0.4)]">
            <span className="font-serif-italic text-lg font-black text-background italic leading-none pt-1">V</span>
          </div>
          <span className="font-serif-italic text-2xl font-bold text-white italic tracking-tighter">Verqify</span>
        </Link>

        {/* Center Links */}
        <div className="hidden md:flex flex-1 items-center justify-center gap-8 absolute left-1/2 -translate-x-1/2 z-10">
          {!user && !isCompanyPreview ? (
            <>
              <Link href="#" className="nav-link text-[11px] font-bold uppercase tracking-[0.15em] text-foreground-muted hover:text-white transition-colors">Builders</Link>
              <Link href="#" className="nav-link text-[11px] font-bold uppercase tracking-[0.15em] text-foreground-muted hover:text-white transition-colors">For Companies</Link>
              <Link href="#" className="nav-link text-[11px] font-bold uppercase tracking-[0.15em] text-foreground-muted hover:text-white transition-colors">How It Works</Link>
            </>
          ) : (
            <>
              <Link href="/" className="nav-link text-[11px] font-bold uppercase tracking-[0.15em] text-foreground-muted hover:text-white transition-colors">Home</Link>
              <Link 
                href={isCompanyMode ? "/explore" : "/leaderboard"} 
                className="nav-link text-[11px] font-bold uppercase tracking-[0.15em] text-foreground-muted hover:text-white transition-colors"
                data-active={pathname === (isCompanyMode ? "/explore" : "/leaderboard")}
              >
                {isCompanyMode ? "Search ATS" : "Leaderboard"}
              </Link>
              <Link 
                href={isCompanyMode ? "/company/dashboard" : "/dashboard"} 
                className="nav-link text-[11px] font-bold uppercase tracking-[0.15em] text-foreground-muted hover:text-white transition-colors"
                data-active={pathname.includes("/dashboard")}
              >
                Dashboard
              </Link>
            </>
          )}
        </div>

        {/* Auth CTAs */}
        <div className="flex items-center justify-end gap-4 min-w-[140px] relative z-10">
          {!loading && (
             user || isCompanyPreview ? (
              <div className="flex items-center gap-4">
                {!user && isCompanyPreview && (
                   <span className="text-[9px] font-black uppercase tracking-widest text-brand bg-brand/10 border border-brand/20 px-2 py-1 rounded-md">Preview</span>
                )}
                <SignOutButton />
              </div>
            ) : (
              <Link
                href={isCompanyMode ? "/company/signup" : "/signup"}
                className="relative overflow-hidden group bg-white text-background text-[10px] font-black uppercase tracking-widest px-6 py-2.5 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] active:scale-95"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent -translate-x-[150%] skew-x-[-15deg] group-hover:animate-shine transition-all z-0" />
                <span className="relative z-10">Get Access</span>
              </Link>
            )
          )}
        </div>
      </nav>
      
      {/* Global generic nav-link active states css overrides specifically intended for Navbar context */}
      <style dangerouslySetInnerHTML={{__html: `
        .nav-link[data-active="true"] {
           color: var(--foreground);
        }
        .nav-link {
           position: relative;
        }
        .nav-link::after {
           content: '';
           position: absolute;
           bottom: -4px;
           left: 50%;
           transform: translateX(-50%);
           width: 0%;
           height: 2px;
           background: var(--brand-green);
           transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
           border-radius: 2px;
        }
        .nav-link:hover::after, .nav-link[data-active="true"]::after {
           width: 100%;
        }
      `}} />
    </div>
  )
}

export default function Navbar() {
  return (
    <Suspense fallback={<div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4"><div className="h-14 w-full max-w-5xl bg-white/[0.02] border border-white/5 backdrop-blur-md rounded-full" /></div>}>
      <NavbarContent />
    </Suspense>
  )
}