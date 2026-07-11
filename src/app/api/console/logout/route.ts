import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME } from "@/lib/console/auth";

// Clears the Vantage session and returns to the login screen. GET so a plain
// <a href> "Sign out" link works.
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const res = NextResponse.redirect(new URL("/console/login", req.url), 303);
  res.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
