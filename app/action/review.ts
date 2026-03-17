"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

// 1. ดึงรีวิวทั้งหมดของหอนี้
export async function getDormReviews(dormId: string) {
  try {
    const reviews = await prisma.review.findMany({
      where: { dormId },
      include: {
        // ดึงชื่อคนรีวิวมาแสดงด้วย
        user: { select: { firstName: true, lastName: true } } 
      },
      orderBy: { createdAt: "desc" },
    });
    return reviews;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
}

// 2. ส่งรีวิวใหม่
export async function submitReview(dormId: string, userId: string, rating: number, comment: string) {
  try {
    // 🟢 สร้างรีวิว (ตาม Schema ของท่านประธานเป๊ะๆ)
    await prisma.review.create({
      data: { 
        dormId, 
        userId, 
        rating, 
        comment, // Schema บังคับให้ต้องมีข้อความ
        // helpfulCount ไม่ต้องใส่เพราะตั้ง @default(0) ไว้แล้ว
      },
    });
    
    revalidatePath(`/dorm`); // สั่งล้างแคชเพื่อให้หน้าเว็บอัปเดตรีวิวใหม่ทันที
    return { success: true };
  } catch (error) {
    console.error("Error submitting review:", error);
    return { error: "ไม่สามารถส่งรีวิวได้ กรุณาลองใหม่อีกครั้ง" };
  }
}

export async function toggleLikeReview(reviewId: string, isLiking: boolean) {
  try {
    await prisma.review.update({
      where: { id: reviewId },
      data: {
        helpfulCount: { // ใน Database เรายังใช้ชื่อคอลัมน์ helpfulCount ตาม Schema เดิมนะครับ
          [isLiking ? 'increment' : 'decrement']: 1 
        }
      }
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating like count:", error);
    return { success: false };
  }
}