// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // Check for token in cookies (primary)
  const cookieToken = req.cookies.get("accessToken")?.value;
  
  // Check for token in Authorization header (fallback)
  const authHeader = req.headers.get("authorization");
  const headerToken = authHeader?.startsWith("Bearer ") 
    ? authHeader.substring(7) 
    : null;

  // If no token found, redirect to login
  if (!cookieToken && !headerToken) {
    console.log("No token found, redirecting to login");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If we have a header token but no cookie token, set the cookie
  if (headerToken && !cookieToken) {
    const response = NextResponse.next();
    response.cookies.set("accessToken", headerToken, {
      path: "/",
      maxAge: 2592000, // 30 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    return response;
  }

  // Otherwise, continue to the requested page
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/explore/:path*"],
};