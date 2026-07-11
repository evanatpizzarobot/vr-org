import { NextResponse } from "next/server";
import { COOKIE_NAME } from "@/lib/console/auth";

// Clears the Vantage session and returns to the login screen. GET so a plain
// <a href> "Sign out" link works.
export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  // Relative Location so the browser resolves it against vr.org.
  const res = new NextResponse(null, { status: 303, headers: { Location: "/console/login" } });
  res.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
