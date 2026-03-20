export default function PulseFeed() {
  const events = [
    { builder: "Aditya Y.", action: "pushed 3 commits to", target: "verq-engine", time: "2 mins ago", color: "bg-[#0F52BA]", icon: "⚡️" },
    { builder: "Aarav S.", action: "deployed", target: "nexus-engine to production", time: "14 mins ago", color: "bg-[#0A7250]", icon: "🚀" },
    { builder: "Neha R.", action: "generated their Verq Score:", target: "76/100", time: "1 hour ago", color: "bg-[#D97706]", icon: "🎯" },
    { builder: "Rohan G.", action: "open-sourced", target: "aether-ui library", time: "3 hours ago", color: "bg-purple-500", icon: "📦" },
  ];

  return (
    <div className="bg-white/50 backdrop-blur-xl border border-black/5 rounded-[2rem] p-6 lg:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full flex flex-col">
      <div className="flex items-center gap-3 mb-8">
        <div className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0A7250] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#0A7250]"></span>
        </div>
        <h3 className="font-serif text-xl font-bold text-[#0E0E0C] tracking-tight">Platform Pulse</h3>
      </div>
      
      <div className="flex-1 overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white/50 to-transparent z-10" />
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white/90 to-transparent z-10" />
        
        <div className="space-y-6 relative z-0">
          {events.map((event, i) => (
            <div key={i} className="flex gap-4 group cursor-default">
              <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center text-white flex-shrink-0 shadow-sm transition-transform group-hover:scale-105 ${event.color}`}>
                <span className="text-sm">{event.icon}</span>
              </div>
              <div>
                <p className="text-sm text-[#0E0E0C] leading-snug">
                  <span className="font-bold">{event.builder}</span>{" "}
                  <span className="text-[#6A6A66]">{event.action}</span>{" "}
                  <span className="font-serif italic font-semibold">{event.target}</span>
                </p>
                <p className="text-xs font-mono text-[#9A9A95] mt-1 uppercase tracking-wider">{event.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
