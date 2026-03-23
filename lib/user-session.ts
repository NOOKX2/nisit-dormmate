import { SignJWT } from "jose";
import { prisma } from "@/lib/db";
import { getSessionSecretBytes } from "@/lib/session-secret";
import type { Role } from "@prisma/client";

const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 7;

export async function createSessionTokenForUser(user: {
  id: string;
  role: Role;
}): Promise<{ token: string; maxAge: number }> {
  const jti = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SEC * 1000);

  await prisma.userSession.create({
    data: { jti, userId: user.id, expiresAt },
  });

  const secret = getSessionSecretBytes();
  const token = await new SignJWT({ role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setJti(jti)
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(secret);

  return { token, maxAge: SESSION_MAX_AGE_SEC };
}
