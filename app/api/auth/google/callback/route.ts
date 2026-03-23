import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getOAuthAppUrl } from "@/lib/oauth-app-url";
import {
  exchangeGoogleCode,
  fetchGoogleUserInfo,
} from "@/lib/google-oauth-server";
import { createSessionTokenForUser } from "@/lib/user-session";

const STATE_COOKIE = "google_oauth_state";
const SESSION_COOKIE = "session_token";

function failRedirect(request: Request, message: string) {
  const base = getOAuthAppUrl(request);
  const url = new URL("/login", base);
  url.searchParams.set("error", message.slice(0, 300));
  return NextResponse.redirect(url);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const oauthError = searchParams.get("error");

  if (oauthError) {
    return failRedirect(
      request,
      searchParams.get("error_description") || oauthError,
    );
  }

  if (!code || !state) {
    return failRedirect(request, "Missing OAuth code or state");
  }

  const cookieStore = await cookies();
  const stateCookie = cookieStore.get(STATE_COOKIE)?.value;
  if (!stateCookie || stateCookie !== state) {
    return failRedirect(request, "Invalid or expired OAuth state");
  }

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  if (!clientId) {
    return failRedirect(
      request,
      "ไม่พบ NEXT_PUBLIC_GOOGLE_CLIENT_ID — ตั้งค่าใน .env.local แล้วรีสตาร์ท dev server",
    );
  }
  if (!clientSecret) {
    return failRedirect(
      request,
      "ไม่พบ GOOGLE_CLIENT_SECRET — ใส่ Client secret จาก Google Cloud Console (Credentials > OAuth 2.0 Client) ใน .env.local แล้วรีสตาร์ทเซิร์ฟเวอร์",
    );
  }

  const appUrl = getOAuthAppUrl(request);
  const redirectUri = `${appUrl}/api/auth/google/callback`;

  let accessToken: string;
  try {
    accessToken = await exchangeGoogleCode({
      code,
      redirectUri,
      clientId,
      clientSecret,
    });
  } catch (e) {
    console.error("Google token exchange:", e);
    return failRedirect(request, "Could not complete Google sign-in");
  }

  let googleUser: Awaited<ReturnType<typeof fetchGoogleUserInfo>>;
  try {
    googleUser = await fetchGoogleUserInfo(accessToken);
  } catch (e) {
    console.error("Google userinfo:", e);
    return failRedirect(request, "Could not read Google profile");
  }

  if (!googleUser.email) {
    return failRedirect(request, "Google did not return an email");
  }

  const firstName = (
    googleUser.given_name ||
    googleUser.name?.split(/\s+/)[0] ||
    "User"
  ).slice(0, 80);
  const lastName = (
    googleUser.family_name ||
    googleUser.name?.split(/\s+/).slice(1).join(" ") ||
    "Google"
  ).slice(0, 80);
  const nickName = (
    googleUser.given_name ||
    googleUser.email.split("@")[0]
  ).slice(0, 80);

  const user = await prisma.user.upsert({
    where: { email: googleUser.email },
    create: {
      email: googleUser.email,
      firstName,
      lastName,
      nickName,
      password: null,
      image: googleUser.picture ?? null,
      imageUrl: googleUser.picture ?? null,
    },
    update: {
      firstName,
      lastName,
      nickName,
      image: googleUser.picture ?? undefined,
      imageUrl: googleUser.picture ?? undefined,
    },
  });

  const { token, maxAge } = await createSessionTokenForUser({
    id: user.id,
    role: user.role,
  });

  const res = NextResponse.redirect(new URL("/", appUrl));
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
  res.cookies.set(STATE_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return res;
}
