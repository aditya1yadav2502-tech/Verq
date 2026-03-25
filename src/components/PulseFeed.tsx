export default function PulseFeed() {
  const events = [
    { builder: "Aditya Y.", action: "pushed 3 commits to", target: "verqify-engine", time: "2 mins ago", color: "bg-white/10 border border-white/20", icon: "⚡️" },
    { builder: "Aarav S.", action: "deployed", target: "nexus-engine to production", time: "14 mins ago", color: "bg-brand/20 border border-brand/30", icon: "🚀" },
    { builder: "Neha R.", action: "generated their Skill Fingerprint:", target: "Strong in Next.js", time: "1 hour ago", color: "bg-white/10 border border-white/20", icon: "🎯" },
    { builder: "Rohan G.", action: "open-sourced", target: "aether-ui library", time: "3 hours ago", color: "bg-white/10 border border-white/20", icon: "📦" },
  ];

  return (
    <div className="glass-card rounded-[2.5rem] p-6 lg:p-8 shadow-2xl h-full flex flex-col relative overflow-hidden group">
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand/10 rounded-full filter blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      
      <div className="flex items-center gap-3 mb-8 relative z-10">
        <div className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand"></span>
        </div>
        <h3 className="font-serif text-2xl font-bold text-white tracking-tight">Platform Pulse</h3>
      </div>
      
      <div className="flex-1 overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-background to-transparent z-10 rounded-t-lg" />
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-background to-transparent z-10 rounded-b-lg" />
        
        <div className="space-y-6 relative z-0">
          {events.map((event, i) => (
            <div key={i} className="flex gap-4 group/item cursor-default">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-500 group-hover/item:scale-110 group-hover/item:-rotate-3 ${event.color}`}>
                <span className="text-sm drop-shadow-md">{event.icon}</span>
              </div>
              <div>
                <p className="text-sm text-foreground/90 leading-snug">
                  <span className="font-bold text-white group-hover/item:text-brand-light transition-colors">{event.builder}</span>{" "}
                  <span className="text-foreground/50">{event.action}</span>{" "}
                  <span className="font-serif italic font-semibold text-white/80">{event.target}</span>
                </p>
                <p className="text-[10px] font-mono font-black text-foreground/30 mt-1 uppercase tracking-widest">{event.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
