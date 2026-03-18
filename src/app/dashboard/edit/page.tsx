"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function EditProfilePage() {
  const [name, setName] = useState("")
  const [college, setCollege] = useState("")
  const [githubUrl, setGithubUrl] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error">("success")
  const [userEmail, setUserEmail] = useState("")
  const router = useRouter()

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/signin")
        return
      }
      setUserEmail(user.email || "")

      const { data: student } = await supabase
        .from("students")
        .select("*")
        .eq("email", user.email)
        .single()

      if (student) {
        setName(student.name || "")
        setCollege(student.college || "")
        setGithubUrl(student.github_url || "")
      }
      setLoading(false)
    }
    loadProfile()
  }, [router])

  async function handleSave() {
    setSaving(true)
    setMessage("")
    const supabase = createClient()

    const { error } = await supabase
      .from("students")
      .update({
        name,
        college,
        github_url: githubUrl,
      })
      .eq("email", userEmail)

    if (error) {
      setMessage(error.message)
      setMessageType("error")
    } else {
      setMessage("Profile updated successfully!")
      setMessageType("success")
      setTimeout(() => router.push("/dashboard"), 1000)
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F6F5F1] flex items-center justify-center">
        <div className="animate-pulse text-sm text-[#9A9A95]">Loading profile...</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#F6F5F1] pt-14">
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 h-14 bg-[#F6F5F1]/90 backdrop-blur-sm border-b border-black/10">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#0F52BA] rounded-lg flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M3 13L8 3L13 13" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 9.5H11" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-serif text-lg font-medium text-[#0E0E0C]">verq</span>
        </Link>
        <Link href="/dashboard" className="text-sm text-[#6A6A66] hover:text-[#0E0E0C] transition-colors">
          ← Back to dashboard
        </Link>
      </nav>

      <div className="max-w-lg mx-auto px-6 py-12">
        <h1 className="font-serif text-3xl text-[#0E0E0C] mb-2">Edit profile</h1>
        <p className="text-sm text-[#6A6A66] mb-8">Update your information visible on your public profile.</p>

        <div className="bg-white border border-black/10 rounded-2xl p-6 shadow-sm">

          <div className="mb-4">
            <label className="block text-sm font-medium text-[#0E0E0C] mb-1.5">Full name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#F6F5F1] border border-black/10 rounded-lg px-3 py-2.5 text-sm text-[#0E0E0C] placeholder:text-[#9A9A95] outline-none focus:border-[#0F52BA] transition-colors"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-[#0E0E0C] mb-1.5">Email</label>
            <input
              type="email"
              value={userEmail}
              disabled
              className="w-full bg-[#EEEDEA] border border-black/10 rounded-lg px-3 py-2.5 text-sm text-[#9A9A95] cursor-not-allowed"
            />
            <p className="text-xs text-[#9A9A95] mt-1.5">Email cannot be changed.</p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-[#0E0E0C] mb-1.5">College</label>
            <input
              type="text"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              placeholder="e.g. IIT Delhi"
              className="w-full bg-[#F6F5F1] border border-black/10 rounded-lg px-3 py-2.5 text-sm text-[#0E0E0C] placeholder:text-[#9A9A95] outline-none focus:border-[#0F52BA] transition-colors"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-[#0E0E0C] mb-1.5">GitHub profile URL</label>
            <input
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/yourusername"
              className="w-full bg-[#F6F5F1] border border-black/10 rounded-lg px-3 py-2.5 text-sm text-[#0E0E0C] placeholder:text-[#9A9A95] outline-none focus:border-[#0F52BA] transition-colors"
            />
            <p className="text-xs text-[#9A9A95] mt-1.5">Changing this will require re-scoring.</p>
          </div>

          {message && (
            <div className={`mb-4 p-3 rounded-lg text-sm ${
              messageType === "error"
                ? "bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626]"
                : "bg-[#E4F4EE] border border-[#9FE1CB] text-[#085041]"
            }`}>
              {message}
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-[#0F52BA] text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-[#0a45a0] transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>

        </div>
      </div>
    </main>
  )
}
