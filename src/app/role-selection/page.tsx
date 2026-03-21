"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

export default function RoleSelectionPage() {
  const router = useRouter()

  const selectRole = (role: "builder" | "company") => {
    localStorage.setItem("verq_view_mode", role)
    window.dispatchEvent(new Event("view_mode_changed"))
    router.push("/")
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-[#FAFAFA] text-[#0E0E0C] overflow-hidden selection:bg-[#0F52BA]/20">
      {/* Decorative Orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-72 h-72 bg-[#0F52BA]/10 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-float" />
        <div className="absolute bottom-[10%] right-[20%] w-96 h-96 bg-[#0A7250]/10 rounded-full mix-blend-multiply filter blur-[100px] opacity-60 animate-float" style={{ animationDelay: "2s" }} />
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="w-full max-w-4xl relative z-10"
      >
        <div className="text-center mb-12">
          <h1 className="font-serif text-5xl sm:text-6xl text-[#0E0E0C] font-bold mb-4 tracking-tighter">
            Welcome to Verqify
          </h1>
          <p className="text-xl text-[#6A6A66] font-medium">How would you like to use the platform today?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Builder Card */}
          <button
            onClick={() => selectRole("builder")}
            className="group relative flex flex-col items-start p-8 bg-white border border-black/5 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgb(15,82,186,0.1)] hover:-translate-y-2 transition-all duration-500 text-left overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#0F52BA]/5 to-transparent rounded-bl-full pointer-events-none" />
            <div className="w-16 h-16 bg-[#E8EFFE] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
              <span className="text-3xl">🚀</span>
            </div>
            <h2 className="font-serif text-3xl font-bold text-[#0E0E0C] mb-3 tracking-tight">I'm a Builder</h2>
            <p className="text-[#6A6A66] leading-relaxed mb-6 font-medium">
              Connect your GitHub, get your Verqify score, and get discovered by top tech companies.
            </p>
            <span className="text-sm font-bold text-[#0F52BA] uppercase tracking-widest flex items-center gap-2">
              Get Started <span className="group-hover:translate-x-1 transition-transform">→</span>
            </span>
          </button>

          {/* Company Card */}
          <button
            onClick={() => selectRole("company")}
            className="group relative flex flex-col items-start p-8 bg-white border border-black/5 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgb(10,114,80,0.1)] hover:-translate-y-2 transition-all duration-500 text-left overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#0A7250]/5 to-transparent rounded-bl-full pointer-events-none" />
            <div className="w-16 h-16 bg-[#E4F4EE] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
              <span className="text-3xl">👥</span>
            </div>
            <h2 className="font-serif text-3xl font-bold text-[#0E0E0C] mb-3 tracking-tight">I'm a Recruiter</h2>
            <p className="text-[#6A6A66] leading-relaxed mb-6 font-medium">
              Search through pre-vetted builders, evaluate code habits natively, and hire the top 1%.
            </p>
            <span className="text-sm font-bold text-[#0A7250] uppercase tracking-widest flex items-center gap-2">
              Explore Talent <span className="group-hover:translate-x-1 transition-transform">→</span>
            </span>
          </button>
        </div>
        
        <p className="text-center mt-12 text-[#9A9A95] text-sm font-medium">
          You can always switch your perspective later through our landing page links.
        </p>
      </motion.div>
    </main>
  )
}
