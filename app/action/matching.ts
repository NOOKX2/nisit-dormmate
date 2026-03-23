"use server";

import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export interface Lifestyle {
  study_time: string;
  location: string;
  guest_policy: string;
  cleanliness: number; 
  sleepHabit: string;
  smoking: boolean;
}


export async function getPotentialMatches() {
  const currentUser = await getAuthUser();
  if (!currentUser) return [];

  const users = await prisma.user.findMany({
    where: {
      hasCompletedQuiz: true,
      id: { not: currentUser.id }, // ไม่ดึงตัวเองมาโชว์
    },
  });

  return users;
}

export async function sendMatchRequest(senderId: string, targetUserId: string) {
  try {
    if (senderId === targetUserId) return { success: false, error: "ชวนตัวเองไม่ได้ครับ!" };

    // 🌟 ความฉลาดที่ 1: เช็คว่า "เขาเคยกดชวนเรามาก่อนหรือเปล่า?" (Mutual Match)
    const reverseRequest = await prisma.matchRequest.findFirst({
      where: { senderId: targetUserId, receiverId: senderId, status: 'PENDING' }
    });

    if (reverseRequest) {
      // ถ้าเขาเคยชวนเราแล้ว แล้วเรามากดชวนเขา -> ให้สถานะกลายเป็น ACCEPTED ทันที! 🎉
      await prisma.matchRequest.update({
        where: { id: reverseRequest.id },
        data: { status: 'ACCEPTED' }
      });
      revalidatePath('/match');
      return { success: true, status: 'MATCHED', message: 'ใจตรงกัน! พวกคุณเป็นเมทกันแล้ว' };
    }

    // เช็คว่าเราเคยส่งไปหาเขาหรือยัง
    const existingRequest = await prisma.matchRequest.findFirst({
      where: { senderId: senderId, receiverId: targetUserId }
    });

    if (existingRequest) {
      return { success: false, error: "คุณเคยส่งคำขอไปแล้ว หรือเป็นเมทกันแล้ว" };
    }

    // สร้างคำขอใหม่
    await prisma.matchRequest.create({
      data: { senderId, receiverId: targetUserId, status: 'PENDING' }
    });

    revalidatePath('/match');
    return { success: true, status: 'SENT', message: 'ส่งคำขอสำเร็จ รออีกฝ่ายยืนยัน' };

  } catch (error) {
    return { success: false, error: "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์" };
  }
}


export async function respondToMatchRequest(requestId: string, action: 'ACCEPT' | 'REJECT') {
  try {
    const newStatus = action === 'ACCEPT' ? 'ACCEPTED' : 'REJECTED';
    
    await prisma.matchRequest.update({
      where: { id: requestId },
      data: { status: newStatus }
    });

    revalidatePath('/match');
    return { success: true };
  } catch (error) {
    return { success: false, error: "ไม่สามารถทำรายการได้" };
  }
}



// 🟢 1. สร้าง Type ง่ายๆ แค่นี้พอครับ
export type UIMatchStatus = 'NONE' | 'SENT' | 'RECEIVED' | 'MATCHED';

// 🟢 2. ให้ฟังก์ชัน return Type นี้ตรงๆ เลย
export async function checkMatchStatus(currentUserId: string, targetUserId: string): Promise<UIMatchStatus> {
  try {
    const match = await prisma.matchRequest.findFirst({
      where: {
        OR: [
          { senderId: currentUserId, receiverId: targetUserId },
          { senderId: targetUserId, receiverId: currentUserId }
        ]
      }
    });

    if (!match) return 'NONE'; 
    
    if (match.status === 'ACCEPTED') return 'MATCHED'; 
    
    if (match.status === 'PENDING') {
      if (match.senderId === currentUserId) return 'SENT'; 
      if (match.receiverId === currentUserId) return 'RECEIVED'; // 👈 ไม่ต้องแนบ requestId แล้ว
    }

    return 'NONE';
  } catch (error) {
    return 'NONE';
  }
}


export async function getRoommateDashboardData(userId: string) {
    try {
        // 1. ดึงข้อมูลทั้งหมดจาก Database
        const allRequests = await prisma.matchRequest.findMany({
            where: {
                OR: [
                    { senderId: userId },
                    { receiverId: userId }
                ]
            },
            include: {
                sender: true,
                receiver: true,
            },
            orderBy: { updatedAt: 'desc' }
        });

        // 2. จัดกลุ่มให้เสร็จสรรพจากหลังบ้าน
        const matched = allRequests.filter(req => req.status === "ACCEPTED");
        const receivedRequests = allRequests.filter(req => req.status === "PENDING" && req.receiverId === userId);
        const sentRequests = allRequests.filter(req => req.status === "PENDING" && req.senderId === userId);

        // 3. ส่งกลับไปเป็น Object สวยๆ
        return { success: true, matched, receivedRequests, sentRequests };

    } catch (error) {
        console.error("Error fetching roommate data:", error);
        // ถ้า DB พัง ก็ส่ง Array ว่างๆ กลับไป เว็บจะได้ไม่แครช
        return { success: false, matched: [], receivedRequests: [], sentRequests: [] }; 
    }
}

export async function cancelMatchRequest(requestId: string) {
  try {
    // สั่งลบข้อมูลการ Match จาก Database ด้วย ID
    await prisma.matchRequest.delete({
      where: {
        id: requestId,
      },
    });

    // 🌟 สั่งให้ Next.js เคลียร์แคชหน้าเว็บ เพื่อให้ UI อัปเดตทันที
    revalidatePath("/my-roommate"); 
    
    return { success: true };
  } catch (error) {
    console.error("Error canceling match:", error);
    return { success: false, error: "เกิดข้อผิดพลาด ไม่สามารถยกเลิกคำขอได้" };
  }
}