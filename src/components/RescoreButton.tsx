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
      const response = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ github_url: githubUrl }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        const errorText = data.error || data.warning || "Something went wrong";
        alert(`Scoring Failed: ${errorText}`);
        return
      }

      if (data.warning) {
        alert("Warning: " + data.warning)
      }

      router.refresh()
    } catch (e: any) {
      alert("Network Error: Could not reach the server")
    } finally {
      setLoading(false)
    }
  }

  if (!githubUrl) return null

  return (
    <button
      onClick={handleRescore}
      disabled={loading}
      className="w-full relative overflow-hidden group bg-white text-background text-[10px] sm:text-xs font-black uppercase tracking-widest py-3 sm:py-4 px-6 rounded-full transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent -translate-x-[150%] skew-x-[-15deg] group-hover:animate-shine transition-all z-0" />
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading ? (
           <>
             <span className="w-3 h-3 border-2 border-background border-t-transparent rounded-full animate-spin" />
             Analyzing...
           </>
        ) : "Update Fingerprint"}
      </span>
    </button>
  )
}
