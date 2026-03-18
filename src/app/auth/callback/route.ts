import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/dashboard"

  if (code) {
    const supabase = await createClient()
    const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && session?.user) {
      const user = session.user
      
      // Sync GitHub users to the students table automatically
      if (user.app_metadata?.provider === "github") {
        const githubUsername = user.user_metadata?.user_name
        const name = user.user_metadata?.full_name || user.user_metadata?.name || githubUsername
        const email = user.email

        if (githubUsername && email) {
          const { data: existing } = await supabase
            .from("students")
            .select("email")
            .eq("email", email)
            .single()

          if (!existing) {
            await supabase.from("students").insert({
              email: email,
              name: name,
              github_url: `https://github.com/${githubUsername}`
            })
          }
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // If something went wrong, redirect to sign-in
  return NextResponse.redirect(`${origin}/signin`)
}
