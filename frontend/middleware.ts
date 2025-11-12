// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;

  // If user is not logged in, redirect to login page
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Otherwise, continue to the requested page
  return NextResponse.next();
}

// Apply middleware only to certain routes
export const config = {
  matcher: ["/dashboard/:path*" , "/explore/:path*"], // Protect dashboard and its subroutes
};
