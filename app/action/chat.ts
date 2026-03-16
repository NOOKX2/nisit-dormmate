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
