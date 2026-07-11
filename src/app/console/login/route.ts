import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, verifySession } from "@/lib/console/auth";

// Login screen for the Vantage console. Self-contained dark page (does not use
// the site layout) with an email + password form that POSTs to
// /api/console/login. Already-authenticated visitors skip straight to /console.
export const dynamic = "force-dynamic";

function loginPage(showError: boolean): string {
  const err = showError
    ? `<p class="err">That email and password did not match. Try again.</p>`
    : "";
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex, nofollow" />
<title>Sign in · Vantage</title>
<link rel="icon" href="/favicon.ico" />
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  html, body { margin: 0; height: 100%; }
  body {
    background: radial-gradient(1200px 600px at 50% -10%, #10202b 0%, #0a0e13 55%), #0a0e13;
    color: #eaf1f5; min-height: 100%;
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    display: flex; align-items: center; justify-content: center; padding: 24px;
    -webkit-font-smoothing: antialiased;
  }
  .card {
    width: 100%; max-width: 380px;
    background: #111820; border: 1px solid rgba(255,255,255,0.09);
    border-radius: 16px; padding: 30px 28px 26px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.45);
  }
  .brand {
    font-family: ui-monospace, "JetBrains Mono", "SF Mono", Menlo, Consolas, monospace;
    font-weight: 700; letter-spacing: 0.16em; font-size: 15px; color: #eaf1f5;
  }
  .brand b { color: #22d3ee; }
  .sub { color: #5f6b76; font-size: 12.5px; margin: 6px 0 22px; }
  label { display: block; font-size: 12px; color: #93a1ad; margin: 0 0 6px; }
  input {
    width: 100%; font: inherit; font-size: 14px; color: #eaf1f5;
    background: #0d141b; border: 1px solid rgba(255,255,255,0.12);
    border-radius: 9px; padding: 11px 12px; margin-bottom: 16px;
  }
  input:focus { outline: 2px solid #22d3ee; outline-offset: 1px; border-color: #22d3ee; }
  button {
    width: 100%; font: inherit; font-size: 14px; font-weight: 650; cursor: pointer;
    color: #04191f; background: #22d3ee; border: none; border-radius: 9px; padding: 12px;
  }
  button:hover { background: #4ce0f5; }
  .err { color: #ff8a8a; font-size: 12.5px; margin: 0 0 16px; }
  .foot { color: #5f6b76; font-size: 11px; margin-top: 18px; line-height: 1.6; }
  .foot b { color: #93a1ad; font-weight: 600; }
</style>
</head>
<body>
  <form class="card" method="post" action="/api/console/login" autocomplete="on">
    <div class="brand">VAN<b>TAGE</b></div>
    <div class="sub">VR.org traffic and AI-visibility console</div>
    ${err}
    <label for="email">Email</label>
    <input id="email" name="email" type="email" required autocomplete="username" autofocus placeholder="you@vr.org" />
    <label for="password">Password</label>
    <input id="password" name="password" type="password" required autocomplete="current-password" placeholder="Your access code" />
    <button type="submit">Sign in</button>
    <div class="foot"><b>Team access only.</b> Sessions last 7 days, then you sign in again. Contact Evan if you need an account.</div>
  </form>
</body>
</html>`;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  if (verifySession(req.cookies.get(COOKIE_NAME)?.value)) {
    return NextResponse.redirect(new URL("/console", req.url), 302);
  }
  const showError = req.nextUrl.searchParams.get("e") === "1";
  return new NextResponse(loginPage(showError), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Robots-Tag": "noindex, nofollow",
      "Cache-Control": "no-store, private",
    },
  });
}
