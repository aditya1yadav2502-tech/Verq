"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function GenerateActionPlanButton({ githubUrl }: { githubUrl: string | null }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleGenerate() {
    if (!githubUrl) return
    setLoading(true)
    try {
      const response = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ github_url: githubUrl }),
      })

      const data = await response.json()

      if (!response.ok) {
        alert("Error: " + (data.error || "Something went wrong"))
        return
      }

      router.refresh()
    } catch {
      alert("Network Error: Could not reach the server")
    } finally {
      setLoading(false)
    }
  }

  if (!githubUrl) return null

  return (
    <button
      onClick={handleGenerate}
      disabled={loading}
      className="bg-[#0E0E0C] text-white px-5 py-2.5 rounded-xl text-xs font-semibold hover:-translate-y-0.5 transition-transform shadow-[0_4px_14px_rgba(0,0,0,0.1)] disabled:opacity-50 inline-flex items-center gap-2"
    >
      {loading ? (
        <>
          <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          Analyzing GitHub...
        </>
      ) : "Generate Action Plan"}
    </button>
  )
}
