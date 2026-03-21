import Navbar from "@/components/Navbar"

export const metadata = {
  title: "Leaderboard",
  description: "Leaderboard coming soon.",
}

export default function LeaderboardPage() {
  return (
    <main className="min-h-screen bg-[#FAFAFA] pt-24 pb-20 selection:bg-[#0F52BA]/20 relative overflow-hidden flex flex-col items-center justify-center text-center px-4">
      <Navbar />
      <div className="w-16 h-16 bg-[#F6F5F1] rounded-2xl flex items-center justify-center mb-6 animate-fade-in">
        <span className="font-serif text-3xl">🏆</span>
      </div>
      <h1 className="font-serif text-4xl sm:text-6xl text-[#0E0E0C] font-bold mb-4 tracking-tight animate-slide-up">
        Leaderboard coming soon
      </h1>
      <p className="text-lg text-[#6A6A66] font-medium">The top builders on Verqify, ranked by skill.</p>
      <p className="text-lg text-[#6A6A66] max-w-md mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
        We are currently indexing the first massive wave of elite builders. Global rankings will unlock shortly!
      </p>
    </main>
  )
}
