// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.pathname;
  
  // Skip auth check for public routes
  if (url === '/' || url.startsWith('/login') || url.startsWith('/register')) {
    return NextResponse.next();
  }

  const cookieToken = req.cookies.get("accessToken")?.value;
  
  if (!cookieToken) {
    console.log("No token found, redirecting to home");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/explore/:path*"],
};