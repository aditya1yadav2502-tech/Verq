import Navbar from "@/components/Navbar"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F6F5F1] flex flex-col items-center justify-center px-6 pt-20">
      <Navbar />
      <div className="max-w-2xl w-full text-center">
        <p className="text-xs font-mono text-[#0A7250] bg-[#E4F4EE] px-3 py-1 rounded-full inline-block mb-6">
          India's first verified builder platform
        </p>
        <h1 className="font-serif text-6xl text-[#0E0E0C] mb-4 leading-tight">
          Companies find you.<br/>Not the other way around.
        </h1>
        <p className="text-base text-[#6A6A66] mb-8 leading-relaxed">
          Build real projects. Get verified by Verq. Let companies discover you — no applications, no ATS, no silence.
        </p>
        <button className="bg-[#0E0E0C] text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-[#3B3B38] transition-colors">
          Get my Verq score
        </button>
      </div>
    </main>
  )
}