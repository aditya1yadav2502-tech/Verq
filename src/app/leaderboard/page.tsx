import Navbar from "@/components/Navbar"
import Link from "next/link"

export const metadata = {
  title: "Leaderboard | Verqify",
  description: "Top verified builders indexed by native project signal.",
}

const mockLeaders = [
  { name: "Aditya Yadav", rank: "01", college: "IIT Delhi", fingerprint: "Strong in Deployment. High Complexity.", quality: 98, complexity: 92, consistency: 99 },
  { name: "Sanya Malhotra", rank: "02", college: "NSUT", fingerprint: "Elite Architecture. Rapid Commits.", quality: 95, complexity: 96, consistency: 88 },
  { name: "Rohan Gupta", rank: "03", college: "DTU", fingerprint: "System Scaling Expert. Clean Code.", quality: 92, complexity: 94, consistency: 91 },
  { name: "Ananya Iyer", rank: "04", college: "BITS Pilani", fingerprint: "Documentation Lead. Growing Scale.", quality: 88, complexity: 76, consistency: 98 },
  { name: "Ishaan Verma", rank: "05", college: "VIT", fingerprint: "React Specialist. High Consistency.", quality: 84, complexity: 82, consistency: 95 },
]

export default function LeaderboardPage() {
  return (
    <main className="min-h-screen bg-background pt-32 pb-20 selection:bg-brand/20 relative overflow-hidden">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
           <div className="animate-fade-in">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-[10px] font-black uppercase tracking-widest text-brand-light mb-6">
               <span className="flex h-1.5 w-1.5 rounded-full bg-brand animate-pulse"></span>
               Live Indexing
             </div>
             <h1 className="font-serif text-6xl sm:text-8xl font-bold tracking-tighter leading-none mb-6">
                The Global <br/>
                <span className="font-serif-italic italic text-brand-light">Stack Ranking.</span>
             </h1>
             <p className="text-foreground/40 text-lg sm:text-xl font-medium max-w-xl">
                The top 1% of student developers in India, verified by native code signal and manual protocol audits.
             </p>
           </div>

           <div className="flex items-center gap-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="text-right">
                 <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30">Builders Indexed</p>
                 <p className="font-serif text-4xl font-bold">1,402</p>
              </div>
              <div className="w-[1px] h-12 bg-white/10" />
              <div className="text-right">
                 <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30">Top Percentile</p>
                 <p className="font-serif text-4xl font-bold text-brand-light">0.1%</p>
              </div>
           </div>
        </div>

        {/* Global Table */}
        <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl animate-slide-up">
           <div className="grid grid-cols-[80px_1fr_200px] sm:grid-cols-[100px_1fr_300px_150px] p-8 border-b border-white/5 bg-white/[0.02]">
              <span className="text-[10px] font-black uppercase tracking-widest text-foreground/20">Rank</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-foreground/20">Builder</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-foreground/20 hidden sm:block">Skill Fingerprint</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-foreground/20 text-right">Intensity</span>
           </div>

           {mockLeaders.map((leader, i) => (
             <Link 
               key={leader.rank} 
               href="#" 
               className="grid grid-cols-[80px_1fr_200px] sm:grid-cols-[100px_1fr_300px_150px] items-center p-8 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors group"
             >
                <span className={`font-serif text-3xl font-bold italic ${i < 3 ? 'text-brand-light' : 'text-foreground/20'}`}>
                   {leader.rank}
                </span>
                
                <div className="flex flex-col">
                   <span className="font-serif text-2xl font-bold group-hover:text-brand-light transition-colors">{leader.name}</span>
                   <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mt-1">{leader.college}</span>
                </div>

                <div className="hidden sm:flex flex-col gap-1 pr-6">
                   <p className="text-[11px] font-medium text-foreground/50 leading-snug italic truncate">"{leader.fingerprint}"</p>
                   <div className="flex gap-1.5 mt-1">
                      <div className="h-1 w-12 bg-white/5 rounded-full overflow-hidden">
                         <div className="h-full bg-brand/40" style={{ width: `${leader.quality}%` }} />
                      </div>
                      <div className="h-1 w-12 bg-white/5 rounded-full overflow-hidden">
                         <div className="h-full bg-brand/40" style={{ width: `${leader.complexity}%` }} />
                      </div>
                      <div className="h-1 w-12 bg-white/5 rounded-full overflow-hidden">
                         <div className="h-full bg-brand/40" style={{ width: `${leader.consistency}%` }} />
                      </div>
                   </div>
                </div>

                <div className="text-right">
                   <div className="inline-flex flex-col items-end">
                      <span className="text-xl font-serif font-black text-brand-light tracking-tighter">
                         {Math.round((leader.quality + leader.complexity + leader.consistency) / 3)}%
                      </span>
                      <span className="text-[9px] font-black uppercase tracking-widest text-foreground/30">NATIVE SIGNAL</span>
                   </div>
                </div>
             </Link>
           ))}

           <div className="p-12 text-center bg-white/[0.01]">
              <p className="text-sm font-medium text-foreground/40 mb-6">Want to see your name on the board?</p>
              <Link 
                href="/signup" 
                className="inline-block px-8 py-4 bg-white text-background text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-brand hover:text-background transition-all"
              >
                Join the Index
              </Link>
           </div>
        </div>
      </div>

      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand/5 rounded-full filter blur-[120px] pointer-events-none opacity-30" />
    </main>
  )
}
