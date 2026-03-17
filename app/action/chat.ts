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
    // 1. ดึงข้อมูลแบบรีดไขมัน (เอาแค่ ID ไม่เอา Text ข้อความ)
    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      orderBy: { createdAt: "desc" },
      select: { senderId: true, receiverId: true }, // 🟢 ดึงแค่นี้พอ ประหยัดแรมเซิร์ฟเวอร์
    });

    // 2. สกัด ID คนคุย (Set ใน JavaScript จะจดจำ 'ลำดับการใส่ครั้งแรก' ไว้ด้วย)
    const contactIds = new Set<string>();
    messages.forEach((msg) => {
      if (msg.senderId !== userId) contactIds.add(msg.senderId);
      if (msg.receiverId !== userId) contactIds.add(msg.receiverId);
    });

    if (contactIds.size === 0) return [];
    
    // แปลง Set เป็น Array เพื่อรักษาสถานะลำดับความใหม่เก่า
    const orderedIds = Array.from(contactIds);

    // 3. ดึงชื่อจาก User Table
    const users = await prisma.user.findMany({
      where: { id: { in: orderedIds } },
      select: { id: true, firstName: true, lastName: true },
    });

    // 🟢 4. แมปข้อมูลให้ตรงกับ 'ลำดับแชทล่าสุด' (orderedIds) ไม่ใช่เรียงตาม Database
    const contacts = orderedIds.map(id => {
      const user = users.find(u => u.id === id);
      return {
        id: id,
        name: user ? `${user.firstName} ${user.lastName}` : "Unknown User"
      };
    }).filter(c => c.name !== "Unknown User"); // กรองคนที่อาจจะถูกลบไอดีทิ้งไปแล้วออก

    return contacts;
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return [];
  }
}
