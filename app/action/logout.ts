"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/db";
import { getSessionSecretBytes } from "@/lib/session-secret";

export async function logoutAction() {
  const cookieStore = await cookies();

  const sessionTok = cookieStore.get("session_token")?.value;
  if (sessionTok) {
    try {
      const secret = getSessionSecretBytes();
      const { payload } = await jwtVerify(sessionTok, secret);
      const jti = payload.jti as string | undefined;
      if (jti) {
        await prisma.userSession.deleteMany({ where: { jti } });
      }
    } catch {
      /* token หมดอายุ / secret ไม่ตรง / ไม่มี SESSION_SECRET — ลบ cookie อย่างเดียว */
    }
  }

  cookieStore.delete("session_token");
  cookieStore.delete("auth_token");

  redirect("/login");
}
