/**
 * Base URL สำหรับ OAuth redirect — ต้องตรงกับที่ลงทะเบียนใน Google Cloud Console
 */
export function getOAuthAppUrl(request: Request): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/+$/, "");
  if (fromEnv) return fromEnv;
  return new URL(request.url).origin;
}
