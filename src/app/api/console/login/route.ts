import { NextRequest, NextResponse } from "next/server";
import {
  COOKIE_NAME,
  SESSION_MAX_AGE_SEC,
  createSession,
  verifyCredentials,
} from "@/lib/console/auth";

// Verifies a Vantage login. On success sets the signed session cookie and
// redirects to /console; on failure redirects back to the login form with an
// error flag. Uses 303 so the browser follows with a GET after the POST.
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest): Promise<NextResponse> {
  let email = "";
  let password = "";
  try {
    const form = await req.formData();
    email = String(form.get("email") || "");
    password = String(form.get("password") || "");
  } catch {
    return NextResponse.redirect(new URL("/console/login?e=1", req.url), 303);
  }

  if (!verifyCredentials(email, password)) {
    return NextResponse.redirect(new URL("/console/login?e=1", req.url), 303);
  }

  const res = NextResponse.redirect(new URL("/console", req.url), 303);
  res.cookies.set(COOKIE_NAME, createSession(email), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SEC,
  });
  return res;
}
