"use client"

import { useState } from "react"

interface PricingModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function PricingModal({ isOpen, onClose }: PricingModalProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  if (!isOpen) return null

  const handleUpgrade = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      setTimeout(() => {
        onClose()
        setSuccess(false)
      }, 2000)
    }, 1500)
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-[#0E0E0C]/60 backdrop-blur-md" onClick={onClose} />
      
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-scale-up">
        {success ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-[#0A7250]/10 rounded-full flex items-center justify-center mb-6">
              <span className="text-2xl">🎉</span>
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#0E0E0C] mb-2">Growth Tier Activated!</h3>
            <p className="text-[#6A6A66]">You now have unlimited access to verified builder contact information.</p>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-br from-[#0F52BA] to-[#0A3D8F] p-8 text-center text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full filter blur-2xl" />
               <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#0A7250] rounded-full filter blur-3xl opacity-50 mix-blend-screen" />
               
               <h3 className="font-serif text-3xl font-bold mb-2 relative z-10">Premium Access Required</h3>
               <p className="text-white/80 text-sm mb-6 relative z-10 font-medium">Unlock full contact details and bulk ATS export.</p>
               
               <div className="text-5xl font-black font-serif relative z-10 drop-shadow-lg">
                 ₹15,000 <span className="text-lg font-mono font-medium text-white/50 tracking-widest uppercase">/ mo</span>
               </div>
            </div>

            <div className="p-8">
              <ul className="space-y-4 mb-8">
                {[
                  "Unlimited profile unlocks",
                  "Direct pipeline to student inboxes",
                  "1-click ATS export (CSV/JSON)",
                  "Custom employer brand on platform",
                  "Score alerts for shortlisted talent"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-[#0E0E0C] font-semibold">
                    <div className="w-5 h-5 rounded-full bg-[#0A7250]/10 flex items-center justify-center text-[#0A7250]">
                      <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
                        <path fillRule="evenodd" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" />
                      </svg>
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <button 
                onClick={handleUpgrade}
                disabled={loading}
                className="w-full bg-[#0E0E0C] text-white py-4 rounded-xl font-bold text-sm shadow-xl hover:-translate-y-1 hover:shadow-2xl transition-all disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Upgrade to Growth Tier"}
              </button>
              
              <button onClick={onClose} className="w-full text-center mt-4 text-xs font-bold text-[#9A9A95] hover:text-[#0E0E0C] uppercase tracking-widest transition-colors">
                Maybe Later
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
