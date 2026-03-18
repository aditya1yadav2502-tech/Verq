"use client"

import { useState, useEffect } from "react"

export default function BookmarkButton({ studentEmail }: { studentEmail: string }) {
  const [isCompany, setIsCompany] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/bookmarks")
      .then(r => r.json())
      .then(data => {
        setIsCompany(data.isCompany)
        setBookmarked(data.emails?.includes(studentEmail))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [studentEmail])

  async function toggleBookmark() {
    const previousState = bookmarked
    setBookmarked(!bookmarked)
    const res = await fetch("/api/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ student_email: studentEmail })
    })
    if (!res.ok) {
      setBookmarked(previousState)
    }
  }

  if (loading || !isCompany || !studentEmail) return null

  return (
    <div className="mt-4">
      <button
        onClick={toggleBookmark}
        className={`inline-flex flex-row items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
          bookmarked 
            ? "bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]" 
            : "bg-white border border-black/10 text-[#0E0E0C] hover:bg-[#F6F5F1]"
        }`}
      >
        <span className="text-base leading-none">{bookmarked ? "⭐" : "☆"}</span>
        {bookmarked ? "Saved" : "Save Profile"}
      </button>
    </div>
  )
}
