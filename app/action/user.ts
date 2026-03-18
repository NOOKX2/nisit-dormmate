"use server";

import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function fetchCurrentUser() {
  return await getAuthUser(); // ✅ ทำงานบน Server แล้วส่งแค่ "ผลลัพธ์" กลับไปให้ Client
}

export async function getUserById(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { 
        id: id 
      },
      // 💡 Option เสริม: ถ้าท่านประธานอยากดึงรีวิวที่คนนี้เคยได้รับมาด้วย 
      // ก็สามารถเปิดคอมเมนต์บรรทัดล่างนี้ได้เลยครับ (ถ้ามีตารางรีวิวผูกไว้แล้ว)
      // include: {
      //   receivedReviews: true 
      // }
    });

    return user;
  } catch (error) {
    // ดักจับ Error เผื่อ Database มีปัญหา เว็บเราจะได้ไม่พัง (Graceful Degradation)
    console.error("❌ Database Error (getUserById):", error);
    return null;
  }
}