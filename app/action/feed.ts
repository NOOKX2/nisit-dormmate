"use server";

import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getPosts(currentUserId?: string) {
  return await prisma.post.findMany({
    include: {
      replies: {
        // 🟢 1. สั่งให้ดึงมาเฉพาะ "คอมเมนต์ชั้นแรก (แม่)" เท่านั้น
        where: { 
          parentId: null 
        }, 
        // 🟢 2. สั่งให้ดึง "คอมเมนต์ซ้อน (ลูก)" ที่ผูกกับแม่คนนี้ติดมาด้วย!
        include: {
          replies: {
            orderBy: { createdAt: "asc" }
          }
        },
        orderBy: { createdAt: "asc" },
      },
      _count: {
        select: { likes: true, replies: true },
      },
      likes: currentUserId
        ? {
            where: { userId: currentUserId },
            select: { id: true },
          }
        : false,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createPost(content: string, authorId: string, authorName: string, tag: string) {
  await prisma.post.create({
    data: { content, authorId, authorName, tag },
  });
  revalidatePath("/community"); // รีเฟรชหน้าเว็บให้เห็นโพสต์ใหม่ทันที
}

export async function togglePostLike(postId: string) {
  const user = await getAuthUser();
  if (!user) {
    return { success: false, error: "กรุณาเข้าสู่ระบบก่อน" };
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { id: true },
  });
  if (!post) {
    return { success: false, error: "ไม่พบโพสต์" };
  }

  const existing = await prisma.postLike.findUnique({
    where: {
      postId_userId: {
        postId,
        userId: user.id,
      },
    },
    select: { id: true },
  });

  if (existing) {
    await prisma.postLike.delete({
      where: {
        postId_userId: { postId, userId: user.id },
      },
    });
    revalidatePath("/community");
    return { success: true, liked: false };
  }

  await prisma.postLike.create({
    data: { postId, userId: user.id },
  });
  revalidatePath("/community");
  return { success: true, liked: true };
}

export async function createPostReply(
  postId: string, 
  content: string, 
  parentId?: string // 🟢 1. เพิ่ม parameter รับ ID ของคอมเมนต์ที่ต้องการตอบกลับ (ใส่ ? แปลว่าจะมีหรือไม่มีก็ได้)
) {
  const user = await getAuthUser();
  if (!user) {
    return { success: false, error: "กรุณาเข้าสู่ระบบก่อน" };
  }

  const message = content.trim();
  if (!message) {
    return { success: false, error: "กรุณาพิมพ์ข้อความก่อนตอบกลับ" };
  }
  if (message.length > 500) {
    return { success: false, error: "ข้อความยาวเกินไป (สูงสุด 500 ตัวอักษร)" };
  }

  // เช็กว่าโพสต์หลักมีอยู่จริงไหม
  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { id: true },
  });
  if (!post) {
    return { success: false, error: "ไม่พบโพสต์" };
  }

  // 🟢 2. เช็กความปลอดภัย (Validation): ถ้าส่ง parentId มา คอมเมนต์นั้นต้องมีอยู่จริง
  if (parentId) {
    const parentReply = await prisma.postReply.findUnique({
      where: { id: parentId },
      select: { id: true },
    });
    if (!parentReply) {
      return { success: false, error: "ไม่พบคอมเมนต์ต้นทาง อาจถูกลบไปแล้ว" };
    }
  }

  // 🟢 3. เซฟลงฐานข้อมูลพร้อมโยงสายสัมพันธ์
  await prisma.postReply.create({
    data: {
      postId,
      authorId: user.id,
      authorName: `${user.firstName} ${user.lastName}`.trim(),
      content: message,
      parentId: parentId || null, // 👈 ถ้าไม่มี parentId มันจะเป็น null (แปลว่าเป็นคอมเมนต์ชั้นแรก)
    },
  });

  revalidatePath("/community");
  return { success: true };
}