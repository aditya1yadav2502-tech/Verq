"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function RescoreButton({ githubUrl }: { githubUrl: string | null }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleRescore() {
    if (!githubUrl) return
    setLoading(true)
    try {
      await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ github_url: githubUrl }),
      })
      router.refresh()
    } catch {
      // silent fail
    } finally {
      setLoading(false)
    }
  }

  if (!githubUrl) return null

  return (
    <button
      onClick={handleRescore}
      disabled={loading}
      className="flex-1 bg-[#0F52BA] text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-[#0a45a0] transition-colors disabled:opacity-50"
    >
      {loading ? "Analyzing GitHub..." : "Re-score my GitHub"}
    </button>
  )
}
