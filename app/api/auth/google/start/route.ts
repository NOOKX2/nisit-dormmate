import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { getOAuthAppUrl } from "@/lib/oauth-app-url";

const STATE_COOKIE = "google_oauth_state";

export async function GET(request: Request) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json(
      { error: "NEXT_PUBLIC_GOOGLE_CLIENT_ID is not configured" },
      { status: 500 },
    );
  }

  const state = randomBytes(32).toString("base64url");
  const appUrl = getOAuthAppUrl(request);
  const redirectUri = `${appUrl}/api/auth/google/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state,
    prompt: "select_account",
  });

  const googleUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

  const res = NextResponse.redirect(googleUrl);
  res.cookies.set(STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });

  return res;
}
