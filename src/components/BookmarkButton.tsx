"use client"

import { useState, useEffect } from "react"

export default function BookmarkButton({ studentEmail }: { studentEmail: string }) {
  const [isCompany, setIsCompany] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<string>("builder")

  // Ensure hydration matches SSR by waiting for first render
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleSync = () => {
      const mode = localStorage.getItem("verqify_view_mode")
      if (mode) setViewMode(mode)
    }

    handleSync() // Init
    
    window.addEventListener("view_mode_changed", handleSync)

    fetch("/api/bookmarks")
      .then(r => r.json())
      .then(data => {
        setIsCompany(data.isCompany)
        setBookmarked(data.emails?.includes(studentEmail))
        setLoading(false)
      })
      .catch(() => setLoading(false))

    return () => window.removeEventListener("view_mode_changed", handleSync)
  }, [studentEmail])

  async function toggleBookmark() {
    if (!isCompany) {
      window.location.href = "/company/signup"
      return
    }
    const previousState = bookmarked
    setBookmarked(!bookmarked)
    const res = await fetch("/api/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ student_email: studentEmail })
    })
    if (!res.ok) setBookmarked(previousState)
  }

  // Prevent hydration mismatch
  if (!mounted) return null

  // Hide button if we are absolutely sure they are a builder
  if (!isCompany && viewMode !== "company") return null

  return (
    <div className="mt-4 transition-all duration-300">
      <button
        onClick={toggleBookmark}
        disabled={loading}
        className={`inline-flex flex-row items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
          bookmarked 
            ? "bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]" 
            : "bg-white border border-black/10 text-[#0E0E0C] hover:bg-[#F6F5F1]"
        } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <span className="text-base leading-none">{bookmarked ? "⭐" : "☆"}</span>
        {bookmarked ? "Saved" : "Save Profile"}
      </button>
    </div>
  )
}
