import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  const session = await auth();

  
  console.log("=== Middleware Session ===");
  console.log("Path:", req.nextUrl.pathname);
  console.log("Session:", JSON.stringify(session, null, 2));
  console.log("==========================");

  // Continue with the request
  return NextResponse.next();
}

// Optionally configure which paths the middleware runs on
export const config = {
  matcher: [
    // Match all paths except static files and api routes
    "/((?!_next/static|_next/image|favicon.ico|api).*)",
  ],
};