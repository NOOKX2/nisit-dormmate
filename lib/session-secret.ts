/** ใช้ลงนาม / ตรวจ session_token (Google OAuth) — ห้ามส่งไป client */
export function getSessionSecretBytes(): Uint8Array {
  const raw = process.env.SESSION_SECRET || process.env.JWT_SECRET;
  if (!raw) {
    throw new Error("SESSION_SECRET or JWT_SECRET must be set for sessions");
  }
  return new TextEncoder().encode(raw);
}
