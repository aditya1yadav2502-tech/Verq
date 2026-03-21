import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect entire app — redirect to /signin if not logged in
  const isPublicRoute = 
    request.nextUrl.pathname.startsWith("/signin") ||
    request.nextUrl.pathname.startsWith("/signup") ||
    request.nextUrl.pathname.startsWith("/auth") ||
    request.nextUrl.pathname.startsWith("/api");

  // Temporarily disable sign-in requirement for "Public Access" mode
  /* 
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone()
    url.pathname = "/signin"
    return NextResponse.redirect(url)
  }
  */

  // Role-based redirection logic
  const role = user?.user_metadata?.role;

  // 1. Handle landing/auth pages for logged-in users
  if (
    user &&
    (request.nextUrl.pathname === "/" ||
      request.nextUrl.pathname === "/signin" ||
      request.nextUrl.pathname === "/signup")
  ) {
    const url = request.nextUrl.clone()
    url.pathname = role === "company" ? "/company/dashboard" : "/dashboard"
    return NextResponse.redirect(url)
  }

  // 2. Protect Student Dashboard from Companies
  if (user && role === "company" && request.nextUrl.pathname.startsWith("/dashboard")) {
    const url = request.nextUrl.clone()
    url.pathname = "/company/dashboard"
    return NextResponse.redirect(url)
  }

  // 3. Protect Company Dashboard from Students
  if (user && role !== "company" && request.nextUrl.pathname.startsWith("/company/dashboard")) {
    const url = request.nextUrl.clone()
    url.pathname = "/dashboard"
    return NextResponse.redirect(url)
  }

  // 4. Domain Redirection (Rebranding: verq-two -> verqify)
  const host = request.headers.get("host")
  if (host === "verq-two.vercel.app") {
    const url = request.nextUrl.clone()
    url.host = "verqify.vercel.app"
    url.protocol = "https"
    return NextResponse.redirect(url, { status: 301 })
  }

  return supabaseResponse
}


export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
