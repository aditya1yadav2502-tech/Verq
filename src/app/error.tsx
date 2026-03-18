"use client"

import Link from "next/link"

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="min-h-screen bg-[#F6F5F1] flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-12 h-12 bg-[#FEF2F2] rounded-full flex items-center justify-center mx-auto mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        </div>
        <h1 className="font-serif text-2xl text-[#0E0E0C] mb-2">Something went wrong</h1>
        <p className="text-sm text-[#6A6A66] mb-8">
          An unexpected error occurred. Please try again.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="bg-[#0F52BA] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#0a45a0] transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="bg-white border border-black/10 text-[#0E0E0C] text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#F0EFEB] transition-colors"
          >
            Go home
          </Link>
        </div>
      </div>
    </main>
  )
}
