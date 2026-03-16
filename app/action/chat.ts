// app/action/chat.ts
"use server";

import { prisma } from "@/lib/db";

export async function getMessages(userId1: string, userId2: string) {
  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId1, receiverId: userId2 },
          { senderId: userId2, receiverId: userId1 },
        ],
      },
      orderBy: { createdAt: "asc" }, // เรียงจากเก่าไปใหม่
    });
    return messages;
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
}

export async function sendMessage(senderId: string, receiverId: string, text: string) {
  try {
    const newMessage = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        text,
      },
    });
    return newMessage;
  } catch (error) {
    console.error("Error sending message:", error);
    throw new Error("Failed to send message");
  }
}

// app/action/chat.ts (เพิ่มต่อจากของเดิม)

export async function getChatContacts(userId: string) {
  try {
    // 1. หาข้อความทั้งหมดที่เราเคยส่งหรือรับ
    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      orderBy: { createdAt: "desc" },
    });

    // 2. ดึงเฉพาะ ID ของอีกฝั่งออกมา (ไม่ซ้ำกัน)
    const contactIds = new Set<string>();
    messages.forEach((msg) => {
      if (msg.senderId !== userId) contactIds.add(msg.senderId);
      if (msg.receiverId !== userId) contactIds.add(msg.receiverId);
    });

    // 3. ไปดึงชื่อและข้อมูลของคนเหล่านั้นจากตาราง User
    if (contactIds.size === 0) return [];

    const contacts = await prisma.user.findMany({
      where: { id: { in: Array.from(contactIds) } },
      select: { id: true, firstName: true, lastName: true },
    });

    return contacts.map(c => ({
      id: c.id,
      name: `${c.firstName} ${c.lastName}`
    }));
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return [];
  }
}
