"use client"

import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import SignOutButton from "./SignOutButton"

function NavbarContent() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const isCompanyPreview = searchParams.get("preview") === "true"

  const [viewMode, setViewMode] = useState<"builder" | "company">("builder")

  useEffect(() => {
    const saved = localStorage.getItem("verq_view_mode")
    if (saved === "company" || saved === "builder") {
      setViewMode(saved)
    }

    const supabase = createClient()
    supabase.auth.getUser().then(({ data }: { data: { user: User | null } }) => {
      setUser(data.user)
      if (data.user?.user_metadata?.role) {
        const userRole = data.user.user_metadata.role
        setRole(userRole)
        setViewMode(userRole === "company" ? "company" : "builder")
      }
      setLoading(false)
    })
  }, [])

  const handleToggle = (mode: "builder" | "company") => {
    setViewMode(mode)
    localStorage.setItem("verq_view_mode", mode)
    window.dispatchEvent(new Event("view_mode_changed"))
  }

  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 animate-slide-up">
      <nav className="flex items-center justify-between px-4 sm:px-5 h-14 w-full max-w-4xl bg-white/70 backdrop-blur-xl border border-black/5 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.06)] relative overflow-hidden">
        
        {/* Subtle top edge highlight */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />

        <Link href="/" className="flex items-center gap-2 relative z-10 transition-transform hover:scale-105 mr-4">
          <div className="w-8 h-8 bg-gradient-to-br from-[#0F52BA] to-[#0A3D8F] rounded-full flex items-center justify-center shadow-inner">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="drop-shadow-sm">
              <path d="M3 13L8 3L13 13" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 9.5H11" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-serif text-lg font-bold text-[#0E0E0C] tracking-tight hidden sm:block">Verqify</span>
        </Link>

        {/* The Dual Market Toggle */}
        <div className="flex-1 flex justify-start lg:justify-center relative z-10">
          <div className="flex items-center bg-[#FAFAFA] border border-black/5 rounded-full p-1 shadow-inner relative">
            <div 
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${viewMode === "company" ? "translate-x-[calc(100%+4px)]" : "translate-x-0"}`}
            />
            <button 
              onClick={() => handleToggle("builder")}
              className={`relative px-4 py-1.5 text-xs font-bold rounded-full transition-colors z-10 ${viewMode === "builder" ? "text-[#0F52BA]" : "text-[#9A9A95] hover:text-[#6A6A66]"}`}
            >
              For Builders
            </button>
            <button 
              onClick={() => handleToggle("company")}
              className={`relative px-4 py-1.5 text-xs font-bold rounded-full transition-colors z-10 ${viewMode === "company" ? "text-[#0A7250]" : "text-[#9A9A95] hover:text-[#6A6A66]"}`}
            >
               For Teams
            </button>
          </div>
        </div>

        {!loading && (
          <div className="flex items-center justify-end gap-1 sm:gap-2 relative z-10">
            {viewMode === "builder" ? (
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
              href={role === "company" || isCompanyPreview || viewMode === "company" ? "/company/dashboard" : "/dashboard"}
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
                  href={viewMode === "builder" ? "/signin" : "/company/signup"}
                  className="text-sm font-medium text-[#6A6A66] hover:text-[#0E0E0C] transition-colors px-3 py-1.5 hidden sm:block"
                >
                  Sign in
                </Link>
                <Link
                  href={viewMode === "builder" ? "/signup" : "/company/signup"}
                  className={`text-sm font-semibold text-white px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 ${viewMode === "builder" ? "bg-[#0E0E0C] hover:bg-[#3B3B38]" : "bg-[#0A7250] hover:bg-[#075A3F]"}`}
                >
                  {viewMode === "builder" ? "Get your score" : "Hire Developers"}
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