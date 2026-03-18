import Navbar from "@/components/Navbar"
import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F6F5F1]">
      <Navbar />

      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-6 pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div className="max-w-2xl w-full text-center">
          <p className="text-xs font-mono text-[#0A7250] bg-[#E4F4EE] px-3 py-1 rounded-full inline-block mb-6">
            India&apos;s first verified builder platform
          </p>
          <h1 className="font-serif text-4xl sm:text-6xl text-[#0E0E0C] mb-4 leading-tight">
            Companies find you.<br/>Not the other way around.
          </h1>
          <p className="text-base text-[#6A6A66] mb-8 leading-relaxed max-w-lg mx-auto">
            Build real projects. Get verified by Verq. Let companies discover you — no applications, no ATS, no silence.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/signup"
              className="inline-block bg-[#0E0E0C] text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-[#3B3B38] transition-colors"
            >
              Get my Verq score
            </Link>
            <Link
              href="/leaderboard"
              className="inline-block bg-white border border-black/10 text-[#0E0E0C] text-sm font-semibold px-6 py-3 rounded-xl hover:bg-[#F0EFEB] transition-colors"
            >
              View leaderboard
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 pb-20">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-mono text-[#0F52BA] bg-[#E8EFFE] px-3 py-1 rounded-full inline-block mb-4">
            How it works
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#0E0E0C] mb-10">
            Three steps to get discovered.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white border border-black/10 rounded-2xl p-6 shadow-sm">
              <div className="w-10 h-10 bg-[#E8EFFE] rounded-xl flex items-center justify-center mb-4">
                <span className="font-serif text-lg text-[#0F52BA] font-medium">1</span>
              </div>
              <h3 className="font-serif text-lg text-[#0E0E0C] mb-2">Sign up & link GitHub</h3>
              <p className="text-sm text-[#6A6A66] leading-relaxed">
                Create your account with your college email and connect your GitHub profile.
              </p>
            </div>

            <div className="bg-white border border-black/10 rounded-2xl p-6 shadow-sm">
              <div className="w-10 h-10 bg-[#E4F4EE] rounded-xl flex items-center justify-center mb-4">
                <span className="font-serif text-lg text-[#0A7250] font-medium">2</span>
              </div>
              <h3 className="font-serif text-lg text-[#0E0E0C] mb-2">Get your Verq score</h3>
              <p className="text-sm text-[#6A6A66] leading-relaxed">
                Our engine analyzes your repos across 5 dimensions: code quality, complexity, consistency, documentation, and deployment.
              </p>
            </div>

            <div className="bg-white border border-black/10 rounded-2xl p-6 shadow-sm">
              <div className="w-10 h-10 bg-[#FEF3C7] rounded-xl flex items-center justify-center mb-4">
                <span className="font-serif text-lg text-[#D97706] font-medium">3</span>
              </div>
              <h3 className="font-serif text-lg text-[#0E0E0C] mb-2">Get discovered</h3>
              <p className="text-sm text-[#6A6A66] leading-relaxed">
                Companies browse the leaderboard and find verified builders. No resumes, no applications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Score dimensions */}
      <section className="px-6 pb-20">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-mono text-[#9A9A95] bg-[#EEEDEA] px-3 py-1 rounded-full inline-block mb-4">
            What we measure
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#0E0E0C] mb-8">
            Five dimensions of real skill.
          </h2>
          <div className="bg-white border border-black/10 rounded-2xl p-6 sm:p-8 shadow-sm">
            {[
              { name: "Code quality", desc: "Language diversity, repo quality, community validation", pct: 85 },
              { name: "Project complexity", desc: "Multi-language repos, depth of work, open-source impact", pct: 72 },
              { name: "Commit consistency", desc: "Regular coding habits over the past 90 days", pct: 90 },
              { name: "Documentation", desc: "README presence and quality across repositories", pct: 60 },
              { name: "Deployment", desc: "Shipping to production — CI/CD, Docker, cloud configs", pct: 45 },
            ].map((dim) => (
              <div key={dim.name} className="mb-5 last:mb-0">
                <div className="flex items-baseline justify-between mb-1.5">
                  <span className="text-sm font-medium text-[#0E0E0C]">{dim.name}</span>
                  <span className="text-xs text-[#9A9A95] font-mono">{dim.pct}</span>
                </div>
                <div className="h-2 bg-[#E2E1DC] rounded-full overflow-hidden mb-1.5">
                  <div
                    className="h-2 rounded-full bg-[#0F52BA]"
                    style={{ width: `${dim.pct}%` }}
                  />
                </div>
                <p className="text-xs text-[#9A9A95]">{dim.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-20">
        <div className="max-w-3xl mx-auto bg-[#0E0E0C] rounded-2xl p-8 sm:p-12 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl text-white mb-3">
            Ready to get verified?
          </h2>
          <p className="text-sm text-[#9A9A95] mb-6 max-w-md mx-auto">
            Join hundreds of student builders who are getting discovered by companies through their work, not words.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-[#0F52BA] text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-[#0a45a0] transition-colors"
          >
            Create your account →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/10 px-6 py-8">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-[#0F52BA] rounded flex items-center justify-center">
              <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                <path d="M3 13L8 3L13 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 9.5H11" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-sm text-[#9A9A95]">Verq © 2026</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/leaderboard" className="text-xs text-[#9A9A95] hover:text-[#0E0E0C] transition-colors">
              Leaderboard
            </Link>
            <Link href="/explore" className="text-xs text-[#9A9A95] hover:text-[#0E0E0C] transition-colors">
              Explore
            </Link>
            <Link href="/signup" className="text-xs text-[#9A9A95] hover:text-[#0E0E0C] transition-colors">
              Sign up
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}