"use client"

import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function SignOutButton() {
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <button
      onClick={handleSignOut}
      className="text-sm text-[#6A6A66] hover:text-[#DC2626] transition-colors px-3 py-1.5"
    >
      Sign out
    </button>
  )
}
