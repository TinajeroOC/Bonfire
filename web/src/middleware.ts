import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

function isAuthPath(path: string) {
  return ["/signin", "/signup"].some((authPath) => path.startsWith(authPath))
}

function isSettingsPath(path: string) {
  return path.startsWith("/settings")
}

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const isRefreshTokenExpired = token && Date.now() >= token.user.tokens.refreshExp * 1000

  if (isRefreshTokenExpired) {
    const response = NextResponse.redirect(`${request.nextUrl.basePath}/api/auth/signin`)
    response.cookies.set("next-auth.session-token", "", { maxAge: 0 })
    response.cookies.set("next-auth.csrf-token", "", { maxAge: 0 })
    return response
  }

  const { pathname } = request.nextUrl

  if (pathname === "/") {
    return NextResponse.rewrite(new URL("/feed", request.url))
  }

  if (token && isAuthPath(pathname)) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  if (!token && isSettingsPath(pathname)) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
}
