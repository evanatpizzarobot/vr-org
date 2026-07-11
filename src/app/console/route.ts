import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, verifySession } from "@/lib/console/auth";

// Vantage: gated internal traffic + AI-visibility console. This route serves a
// standalone HTML shell (not the site layout) that boots /vantage.js, which
// reads the already-public /api/stats and /api/ai-stats endpoints and renders
// the dashboard. Access is gated by a signed session cookie; unauthenticated
// requests are bounced to /console/login.
export const dynamic = "force-dynamic";

const SHELL = `<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex, nofollow" />
<title>Vantage · VR.org</title>
<link rel="icon" href="/favicon.ico" />
</head>
<body>
<script src="/vantage.js" defer></script>
</body>
</html>`;

export async function GET(req: NextRequest): Promise<NextResponse> {
  const email = verifySession(req.cookies.get(COOKIE_NAME)?.value);
  if (!email) {
    // Relative Location so the browser resolves it against vr.org. An absolute
    // URL built from req.url would carry the internal Docker host behind nginx.
    return new NextResponse(null, {
      status: 302,
      headers: { Location: "/console/login", "Cache-Control": "no-store" },
    });
  }
  return new NextResponse(SHELL, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Robots-Tag": "noindex, nofollow",
      "Cache-Control": "no-store, private",
    },
  });
}
