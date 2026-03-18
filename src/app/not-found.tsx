import Link from "next/link"

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#F6F5F1] flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="font-serif text-8xl text-[#E2E1DC] mb-4">404</div>
        <h1 className="font-serif text-2xl text-[#0E0E0C] mb-2">Page not found</h1>
        <p className="text-sm text-[#6A6A66] mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="bg-[#0F52BA] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#0a45a0] transition-colors"
          >
            Go home
          </Link>
          <Link
            href="/leaderboard"
            className="bg-white border border-black/10 text-[#0E0E0C] text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#F0EFEB] transition-colors"
          >
            Leaderboard
          </Link>
        </div>
      </div>
    </main>
  )
}
