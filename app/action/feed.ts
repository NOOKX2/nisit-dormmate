"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getPosts() {
  return await prisma.post.findMany({
    orderBy: { createdAt: "desc" }, // ใหม่สุดอยู่บน
  });
}

export async function createPost(content: string, authorId: string, authorName: string, tag: string) {
  await prisma.post.create({
    data: { content, authorId, authorName, tag },
  });
  revalidatePath("/community"); // รีเฟรชหน้าเว็บให้เห็นโพสต์ใหม่ทันที
}