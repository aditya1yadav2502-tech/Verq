export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 h-14 bg-[#F6F5F1]/90 backdrop-blur-sm border-b border-black/10">
      
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 bg-[#0F52BA] rounded-lg flex items-center justify-center flex-shrink-0">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 13L8 3L13 13" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5 9.5H11" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </div>
        <span className="font-serif text-lg font-medium text-[#0E0E0C]">verq</span>
      </div>

      <div className="flex items-center gap-3">
        <button className="text-sm text-[#6A6A66] hover:text-[#0E0E0C] transition-colors px-3 py-1.5">
          Sign in
        </button>
        <button className="text-sm font-semibold bg-[#0F52BA] text-white px-4 py-1.5 rounded-lg hover:bg-[#0a45a0] transition-colors">
          Get your score →
        </button>
      </div>

    </nav>
  )
}