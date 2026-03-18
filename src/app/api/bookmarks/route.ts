import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user || user.user_metadata?.role !== "company") {
    return NextResponse.json({ emails: [], isCompany: false })
  }

  const { data } = await supabase
    .from("bookmarks")
    .select("student_email")
    .eq("company_email", user.email)

  return NextResponse.json({
    emails: data?.map((d: any) => d.student_email) || [],
    isCompany: true
  })
}

export async function POST(req: NextRequest) {
  const { student_email } = await req.json()
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user || user.user_metadata?.role !== "company") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Check if bookmark exists
  const { data: existing } = await supabase
    .from("bookmarks")
    .select("id")
    .eq("company_email", user.email)
    .eq("student_email", student_email)
    .single()

  if (existing) {
    // Remove bookmark
    const { error } = await supabase.from("bookmarks").delete().eq("id", existing.id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ bookmarked: false })
  } else {
    // Add bookmark
    const { error } = await supabase.from("bookmarks").insert({
      company_email: user.email,
      student_email: student_email
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ bookmarked: true })
  }
}
