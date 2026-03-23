import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/db";
import { getSessionSecretBytes } from "@/lib/session-secret";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-safe-for-hackathon",
);

/**
 * อ่านผู้ใช้จาก cookie: session_token (Google OAuth + UserSession) หรือ auth_token (JWT login เดิม)
 */
export async function getAuthUser() {
  try {
    const cookieStore = await cookies();

    const sessionTok = cookieStore.get("session_token")?.value;
    if (sessionTok) {
      try {
        const secret = getSessionSecretBytes();
        const { payload } = await jwtVerify(sessionTok, secret);
        const jti = payload.jti as string | undefined;
        const sub = payload.sub as string | undefined;
        if (jti && sub) {
          const row = await prisma.userSession.findUnique({
            where: { jti },
            include: { user: true },
          });
          if (
            row &&
            row.expiresAt >= new Date() &&
            row.userId === sub
          ) {
            return row.user;
          }
        }
      } catch {
        /* JWT session ไม่ถูกต้อง — ลอง auth_token ด้านล่าง */
      }
    }

    const token = cookieStore.get("auth_token")?.value;
    if (!token) return null;

    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (!payload?.userId) return null;

    return prisma.user.findUnique({
      where: { id: payload.userId as string },
    });
  } catch (error) {
    console.error("Auth Error:", error);
    return null;
  }
}
