"use client"

import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import SignOutButton from "./SignOutButton"

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setLoading(false)
    })
  }, [])

  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 animate-slide-up">
      <nav className="flex items-center justify-between px-4 sm:px-5 h-14 w-full max-w-4xl bg-white/70 backdrop-blur-xl border border-black/5 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.06)] relative overflow-hidden">
        
        {/* Subtle top edge highlight */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />

        <Link href="/" className="flex items-center gap-2 relative z-10 transition-transform hover:scale-105">
          <div className="w-8 h-8 bg-gradient-to-br from-[#0F52BA] to-[#0A3D8F] rounded-full flex items-center justify-center shadow-inner">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="drop-shadow-sm">
              <path d="M3 13L8 3L13 13" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 9.5H11" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-serif text-lg font-bold text-[#0E0E0C] tracking-tight">verq</span>
        </Link>

        {!loading && (
          <div className="flex items-center gap-1 sm:gap-2 relative z-10">
            <Link
              href="/"
              className="text-sm font-medium text-[#6A6A66] hover:text-[#0E0E0C] hover:bg-black/5 rounded-full transition-all px-3 py-1.5 hidden sm:block"
            >
              Home
            </Link>
            <Link
              href="/leaderboard"
              className="text-sm font-medium text-[#6A6A66] hover:text-[#0E0E0C] hover:bg-black/5 rounded-full transition-all px-3 py-1.5 hidden sm:block"
            >
              Leaderboard
            </Link>
            <Link
              href="/explore"
              className="text-sm font-medium text-[#6A6A66] hover:text-[#0E0E0C] hover:bg-black/5 rounded-full transition-all px-3 py-1.5 hidden sm:block"
            >
              Explore
            </Link>
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-[#6A6A66] hover:text-[#0E0E0C] hover:bg-black/5 rounded-full transition-all px-3 py-1.5"
                >
                  Dashboard
                </Link>
                <div className="ml-1 pl-3 border-l border-black/10">
                  <SignOutButton />
                </div>
              </>
            ) : (
              <div className="flex items-center gap-1 ml-1 sm:ml-2">
                <Link
                  href="/signin"
                  className="text-sm font-medium text-[#6A6A66] hover:text-[#0E0E0C] transition-colors px-3 py-1.5"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="text-sm font-semibold bg-[#0E0E0C] hover:bg-[#3B3B38] text-white px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
                >
                  Get your score
                </Link>
              </div>
            )}
          </div>
        )}

      </nav>
    </div>
  )
}