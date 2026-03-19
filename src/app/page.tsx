import Navbar from "@/components/Navbar"
import Link from "next/link"
import PulseFeed from "@/components/PulseFeed"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FAFAFA] text-[#0E0E0C] overflow-hidden selection:bg-[#0F52BA]/20">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 sm:pt-48 sm:pb-32 px-6 overflow-hidden">
        {/* Glowing Orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-full pointer-events-none">
          <div className="absolute top-[10%] left-[20%] w-72 h-72 bg-[#0F52BA]/20 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-float" />
          <div className="absolute top-[20%] right-[20%] w-96 h-96 bg-[#0A7250]/15 rounded-full mix-blend-multiply filter blur-[100px] opacity-60 animate-float" style={{ animationDelay: "2s" }} />
          <div className="absolute -bottom-[10%] left-[40%] w-80 h-80 bg-[#D97706]/15 rounded-full mix-blend-multiply filter blur-[90px] opacity-50 animate-float" style={{ animationDelay: "4s" }} />
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex flex-col items-center text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-black/5 shadow-sm text-sm font-medium text-[#0E0E0C] mb-8 hover:shadow-md transition-shadow">
              <span className="flex h-2 w-2 rounded-full bg-[#0A7250]"></span>
              India&apos;s first verified builder platform
            </div>
            
            <h1 className="font-serif text-5xl sm:text-7xl lg:text-[5rem] tracking-tight leading-[1.1] mb-6 drop-shadow-sm">
              Companies find you.<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0E0E0C] via-[#3B3B38] to-[#6A6A66]">
                Not the other way around.
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-[#6A6A66] mb-10 leading-relaxed max-w-2xl mx-auto">
              Build real projects. Get verified by the Verq engine. Let top companies discover your talent instantly — no resumes, no ATS, no silence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto">
              <Link
                href="/signup"
                className="w-full sm:w-auto px-8 py-4 bg-[#0E0E0C] text-white text-base font-semibold rounded-full shadow-[0_0_40px_rgba(15,82,186,0.3)] hover:shadow-[0_0_60px_rgba(15,82,186,0.5)] hover:-translate-y-1 transition-all duration-300 border border-white/10"
              >
                Get your Verq score
              </Link>
              <Link
                href="/explore"
                className="w-full sm:w-auto px-8 py-4 bg-white/60 backdrop-blur-md border border-black/10 text-[#0E0E0C] text-base font-semibold rounded-full hover:bg-white hover:border-black/20 hover:-translate-y-1 transition-all duration-300"
              >
                Explore builders
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-24 bg-white relative">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="font-serif text-3xl sm:text-5xl text-[#0E0E0C] mb-4 tracking-tight">
              Three steps to get discovered.
            </h2>
            <p className="text-base text-[#6A6A66] max-w-lg mx-auto">
              The fastest way to prove your skills and bypass traditional recruiting screens.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              { num: "1", title: "Sign up & link GitHub", desc: "Create your account securely and connect your public GitHub profile.", iconBg: "bg-[#E8EFFE]", iconColor: "text-[#0F52BA]" },
              { num: "2", title: "The Engine analyzes", desc: "Our algorithm automatically evaluates your repos across 5 critical dimensions.", iconBg: "bg-[#E4F4EE]", iconColor: "text-[#0A7250]" },
              { num: "3", title: "Companies find you", desc: "Top tech companies actively browse Verq to find verified builders directly.", iconBg: "bg-[#FEF3C7]", iconColor: "text-[#D97706]" }
            ].map((step, i) => (
              <div 
                key={i} 
                className="bg-[#FAFAFA] border border-black/5 rounded-3xl p-8 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className={`w-14 h-14 ${step.iconBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <span className={`font-serif text-2xl ${step.iconColor} font-semibold`}>{step.num}</span>
                </div>
                <h3 className="font-serif text-xl text-[#0E0E0C] mb-3">{step.title}</h3>
                <p className="text-[#6A6A66] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Market Pulse Section */}
      <section className="px-6 py-12 bg-[#FAFAFA] relative z-10 -mt-12">
        <div className="max-w-4xl mx-auto">
          <PulseFeed />
        </div>
      </section>

      {/* Score dimensions */}
      <section className="px-6 py-24 bg-[#0E0E0C] text-white relative overflow-hidden">
        {/* Subtle dark glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0F52BA]/20 rounded-full filter blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#0A7250]/15 rounded-full filter blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="animate-slide-up">
            <h2 className="font-serif text-4xl sm:text-5xl mb-6 tracking-tight leading-tight">
              Five dimensions of<br/>real skill.
            </h2>
            <p className="text-[#9A9A95] text-lg leading-relaxed mb-8 max-w-md">
              Verq doesn&apos;t just count your stars. We look at code quality, architecture complexity, consistency, documentation habits, and how you deploy.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 shadow-2xl animate-float">
            {[
              { name: "Code quality", desc: "Language diversity, repo quality", pct: 85, color: "bg-[#0F52BA]" },
              { name: "Project complexity", desc: "Architecture depth, full-stack", pct: 72, color: "bg-purple-500" },
              { name: "Commit consistency", desc: "Habits over the past 90 days", pct: 90, color: "bg-[#0A7250]" },
              { name: "Documentation", desc: "README presence and clarity", pct: 60, color: "bg-[#D97706]" },
              { name: "Deployment", desc: "CI/CD, external hosting config", pct: 45, color: "bg-blue-400" },
            ].map((dim) => (
              <div key={dim.name} className="mb-6 last:mb-0 group">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-sm font-medium text-white/90">{dim.name}</span>
                  <span className="text-xs text-white/50 font-mono tracking-wider">{dim.pct}/100</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-2 relative">
                  <div
                    className={`h-full rounded-full ${dim.color} transition-all duration-1000 ease-out group-hover:brightness-125`}
                    style={{ width: `${dim.pct}%` }}
                  />
                </div>
                <p className="text-xs text-white/50">{dim.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-32 bg-[#FAFAFA]">
        <div className="max-w-4xl mx-auto text-center animate-slide-up">
          <h2 className="font-serif text-4xl sm:text-6xl text-[#0E0E0C] mb-6 tracking-tight">
            Ready to get verified?
          </h2>
          <p className="text-lg text-[#6A6A66] mb-10 max-w-xl mx-auto">
            Join elite student builders who are getting discovered by companies through their work, not their resumes.
          </p>
          <Link
            href="/signup"
            className="inline-block px-10 py-5 bg-[#0E0E0C] text-white text-lg font-semibold rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-all duration-300"
          >
            Create your account now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/5 bg-white px-6 py-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#0F52BA] to-[#0A3D8F] rounded-full flex items-center justify-center shadow-inner">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="drop-shadow-sm">
                <path d="M3 13L8 3L13 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 9.5H11" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-serif font-bold tracking-tight text-[#0E0E0C]">verq © 2026</span>
          </div>
          <div className="flex items-center gap-8">
            <Link href="/leaderboard" className="text-sm font-medium text-[#6A6A66] hover:text-[#0E0E0C] transition-colors">
              Leaderboard
            </Link>
            <Link href="/explore" className="text-sm font-medium text-[#6A6A66] hover:text-[#0E0E0C] transition-colors">
              Explore
            </Link>
            <Link href="/company/signup" className="text-sm font-medium text-[#0F52BA] hover:text-[#0A3D8F] hover:underline transition-colors">
              For Companies
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}