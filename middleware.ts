import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const secret = process.env.NEXTAUTH_SECRET; // Make sure this is set in the

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret });

  // Skip the middleware for the root path
  if (request.nextUrl.pathname === "/") {
    return NextResponse.next();
  }

  // Redirect to root if no token is found
  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Allow the request if token exists
  return NextResponse.next();
}

export const config = {
  matcher: "/((?!/|api/auth/*|api/callback|_next|favicon.ico|static).*)", // Exclude paths like /api, /_next, and static files
};
