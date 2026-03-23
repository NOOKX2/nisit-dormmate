import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

function sessionSecretBytes(): Uint8Array {
  const raw = process.env.SESSION_SECRET || process.env.JWT_SECRET;
  return new TextEncoder().encode(raw || "");
}

type JwtPayload = { role?: string };

async function verifySessionToken(
  token: string,
): Promise<JwtPayload | null> {
  const secret = sessionSecretBytes();
  if (!secret.length) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as JwtPayload;
  } catch {
    return null;
  }
}

async function verifyAuthToken(token: string): Promise<JwtPayload | null> {
  if (!JWT_SECRET.length) return null;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as JwtPayload;
  } catch {
    return null;
  }
}

async function getRoleFromCookies(request: NextRequest): Promise<string | null> {
  const sessionTok = request.cookies.get("session_token")?.value;
  if (sessionTok) {
    const p = await verifySessionToken(sessionTok);
    if (p?.role) return p.role;
  }
  const authTok = request.cookies.get("auth_token")?.value;
  if (authTok) {
    const p = await verifyAuthToken(authTok);
    if (p?.role) return p.role;
  }
  return null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const role = await getRoleFromCookies(request);

  if (!role) {
    if (pathname.startsWith("/admin") || pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  if (pathname === "/" && role === "ADMIN") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/admin/:path*", "/dashboard", "/dashboard/:path*"],
};
