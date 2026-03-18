'use server'; 

import { prisma } from '@/lib/db';

// สร้างตัวเชื่อมต่อกับ Database (ถ้าในโปรเจกต์มีไฟล์ db.ts ให้ import มาจากไฟล์นั้นแทนได้ครับ)

// 1. กำหนดหน้าตาของข้อมูล (Type) ที่จะรับมาจากหน้าเว็บ
export interface CreateRoommateReviewInput {
  reviewerId: string;
  targetUserId: string;
  considerationScore: number;
  cleanlinessScore: number;
  financeScore: number;
  comment: string;
}

// 2. ฟังก์ชันหลักสำหรับบันทึกข้อมูล
export async function createRoommateReview(data: CreateRoommateReviewInput) {
  try {
    // --- [ด่านที่ 1: ตรวจสอบความถูกต้องพื้นฐาน (Validation)] ---
    
    // ห้ามรีวิวตัวเองเด็ดขาด!
    if (data.reviewerId === data.targetUserId) {
      return { success: false, error: "คุณไม่สามารถเขียนรีวิวให้ตัวเองได้ครับ!" };
    }

    // คะแนนต้องอยู่ระหว่าง 1 ถึง 5 เท่านั้น (กันคนแฮกแก้โค้ดหน้าเว็บส่งคะแนน 100 มา)
    const scores = [data.considerationScore, data.cleanlinessScore, data.financeScore];
    if (scores.some(score => score < 1 || score > 5)) {
      return { success: false, error: "คะแนนต้องอยู่ระหว่าง 1 ถึง 5 ดาวเท่านั้น" };
    }

    if (!data.comment || data.comment.trim().length === 0) {
      return { success: false, error: "กรุณาพิมพ์ข้อความรีวิวด้วยครับ" };
    }

    // --- [ด่านที่ 2: บันทึกลง Database] ---
    
    const newReview = await prisma.roommateReview.create({
      data: {
        reviewerId: data.reviewerId,
        targetUserId: data.targetUserId,
        considerationScore: data.considerationScore,
        cleanlinessScore: data.cleanlinessScore,
        financeScore: data.financeScore,
        comment: data.comment.trim(),
        // isVerified เริ่มต้นเป็น false ไปก่อน (ตาม Schema ที่เราตั้งไว้)
      }
    });

    // --- [ด่านที่ 3: ส่งสัญญาณความสำเร็จกลับไปที่หน้าเว็บ] ---
    return { 
      success: true, 
      message: "บันทึกรีวิว Mate Karma สำเร็จ!", 
      review: newReview 
    };

  } catch (error: any) {
    console.error("❌ Error creating roommate review:", error);

    // 🛡️ เช็ค Error Code ของ Prisma: P2002 คือการละเมิดกฎ @@unique ที่เราเพิ่งสร้าง!
    // แปลว่า User คนนี้พยายาม "สแปมรีวิว" รูมเมทคนเดิมซ้ำสอง
    if (error.code === 'P2002') {
      return { 
        success: false, 
        error: "คุณเคยรีวิวรูมเมทคนนี้ไปแล้ว ไม่สามารถรีวิวซ้ำได้ครับ (1 คน 1 สิทธิ์)" 
      };
    }

    // Error อื่นๆ ที่ไม่คาดคิด
    return { 
      success: false, 
      error: "เกิดข้อผิดพลาดที่ระบบหลังบ้าน กรุณาลองใหม่อีกครั้ง" 
    };
  }
}



export async function getRoommateReviews(targetUserId: string) {
  try {
    // 1. ดึงข้อมูลจาก Database
    const rawReviews = await prisma.roommateReview.findMany({
      where: { 
        targetUserId: targetUserId 
      },
      // 🌟 ทริค Prisma: ขอข้อมูลของ "คนเขียนรีวิว (reviewer)" ติดมาด้วย เพื่อเอาชื่อมาโชว์
      include: {
        reviewer: {
          select: {
            firstName: true,
            nickName: true,
          }
        }
      },
      // เรียงจากรีวิวใหม่ล่าสุดไปเก่าสุด
      orderBy: {
        createdAt: 'desc'
      }
    });

    // 2. แปลงร่างข้อมูล (Format Data) ให้ตรงกับหน้าตาที่ Frontend ต้องการเป๊ะๆ
    const formattedReviews = rawReviews.map((r) => ({
      id: r.id,
      // ถ้ามีชื่อเล่นเอาชื่อเล่น ถ้าไม่มีเอาชื่อจริง
      reviewerName: r.reviewer?.nickName || r.reviewer?.firstName || "ไม่ระบุชื่อ",
      // แปลงวันที่ให้เป็นภาษาไทยแบบที่ท่านประธานออกแบบไว้ (เช่น "15 ม.ค. 2026")
      date: r.createdAt.toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' }),
      subRatings: { 
        consideration: r.considerationScore, 
        cleanliness: r.cleanlinessScore, 
        finance: r.financeScore 
      },
      comment: r.comment,
      helpfulCount: r.helpfulCount,
      isVerified: r.isVerified
    }));

    return { success: true, reviews: formattedReviews };

  } catch (error) {
    console.error("❌ Error fetching reviews:", error);
    return { success: false, error: "ไม่สามารถดึงข้อมูลรีวิวได้" };
  }
}