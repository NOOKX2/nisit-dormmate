import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/db";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-safe-for-hackathon"
);

export async function getAuthUser() {
  try {
    const cookieStore = await cookies();
    // 🟢 ตรวจสอบชื่อ Cookie ให้ตรงกัน (ใช้ 'auth_token' หรือ 'session' เลือกอย่างใดอย่างหนึ่งครับ)
    const token = cookieStore.get("auth_token")?.value;

    if (!token) return null;

    // 1. ตรวจสอบความถูกต้องของ Token (Verify)
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    if (!payload || !payload.userId) return null;

    // 2. ดึงข้อมูล User จริงๆ จาก Database 
    // (ขั้นตอนนี้สำคัญเพราะเราจะได้ข้อมูลล่าสุด เช่น role หรือ profile ล่าสุด)
    const user = await prisma.user.findUnique({
      where: { id: payload.userId as string },
    });

    return user;
  } catch (error) {
    // กรณี Token หมดอายุ หรือ Secret Key ไม่ตรงกัน
    console.error("Auth Error:", error);
    return null;
  }
}