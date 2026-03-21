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
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const isCompanyPreview = searchParams.get("preview") === "true"

  const [localViewMode, setLocalViewMode] = useState<string | null>(null)

  useEffect(() => {
    // Initial load
    const saved = localStorage.getItem("verqify_view_mode")
    setLocalViewMode(saved)

    // Listen for changes
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

    return () => window.removeEventListener("view_mode_changed", handleStorage)
  }, [])

  // Determine display mode: "company" if explicitly company role, preview mode, on company pages, or localStorage says so (for landing page)
  const isCompanyMode = role === "company" || isCompanyPreview || pathname.startsWith("/company") || (!user && localViewMode === "company")


  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 animate-slide-up">
      <nav className="flex items-center justify-between px-4 sm:px-5 h-14 w-full max-w-4xl bg-white/70 backdrop-blur-xl border border-black/5 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.06)] relative overflow-hidden">
        
        {/* Subtle top edge highlight */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />

        <Link href="/" title="Home" className="flex items-center gap-2 relative z-10 transition-transform hover:scale-105 mr-2 sm:mr-4 shrink-0">
          <div className="w-8 h-8 bg-gradient-to-br from-[#0F52BA] to-[#0A3D8F] rounded-full flex items-center justify-center shadow-inner shrink-0">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="drop-shadow-sm">
              <path d="M3 13L8 3L13 13" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 9.5H11" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-serif text-lg font-bold text-[#0E0E0C] tracking-tight hidden md:block">Verqify</span>
        </Link>

        {/* The switch gear has been removed. Experience is now role-based. */}
        <div className="flex-1 flex justify-center" />

        {!loading && (
          <div className="flex items-center justify-end gap-1 sm:gap-2 relative z-10">
            <Link
              href="/"
              className="text-sm font-medium text-[#6A6A66] hover:text-[#0E0E0C] hover:bg-black/5 rounded-full transition-all px-3 py-1.5"
            >
              Home
            </Link>

            {!isCompanyMode ? (
              <Link
                href="/leaderboard"
                className="text-sm font-medium text-[#6A6A66] hover:text-[#0E0E0C] hover:bg-black/5 rounded-full transition-all px-3 py-1.5 hidden sm:block"
              >
                Leaderboard
              </Link>

            ) : (
              <Link
                href="/explore"
                className="text-sm font-medium text-[#6A6A66] hover:text-[#0E0E0C] hover:bg-black/5 rounded-full transition-all px-3 py-1.5 hidden sm:block"
              >
                Search ATS
              </Link>
            )}

            <Link
              href={isCompanyMode ? "/company/dashboard" : "/dashboard"}
              className="text-sm font-medium text-[#6A6A66] hover:text-[#0E0E0C] hover:bg-black/5 rounded-full transition-all px-3 py-1.5"
            >
              Dashboard
            </Link>

            {user || isCompanyPreview ? (
              <div className="flex items-center gap-3 ml-1 pl-3 border-l border-black/10">
                {!user && isCompanyPreview && (
                   <span className="text-[10px] font-black uppercase tracking-widest text-[#0F52BA] bg-[#0F52BA]/5 px-2 py-1 rounded-md">Preview</span>
                )}
                <SignOutButton />
              </div>
            ) : (
              <div className="flex items-center gap-1 ml-1 sm:ml-2">
                <Link
                  href={!isCompanyMode ? "/signin" : "/company/signup"}
                  className="text-sm font-medium text-[#6A6A66] hover:text-[#0E0E0C] transition-colors px-3 py-1.5 hidden sm:block"
                >
                  Sign in
                </Link>
                <Link
                  href={!isCompanyMode ? "/signup" : "/company/signup"}
                  className={`text-sm font-semibold text-white px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 ${!isCompanyMode ? "bg-[#0E0E0C] hover:bg-[#3B3B38]" : "bg-[#0A7250] hover:bg-[#075A3F]"}`}
                >
                  {!isCompanyMode ? "Get your score" : "Hire Developers"}
                </Link>
              </div>
            )}
          </div>
        )}


      </nav>
    </div>
  )
}

export default function Navbar() {
  return (
    <Suspense fallback={<div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4"><div className="h-14 w-full max-w-4xl" /></div>}>
      <NavbarContent />
    </Suspense>
  )
}