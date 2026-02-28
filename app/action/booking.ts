"use server";
import { prisma } from "@/lib/db";

export async function handleBooking(userId: string, roomId: string, dormId: string) {
    return await prisma.$transaction(async (tx) => {
        const room = await tx.room.findUnique({ where: { id: roomId } });
        if (!room?.isAvailable) {
            throw new Error("ห้องนี้ถูกจองไปแล้ว");
        }

        const booking = await tx.booking.create({
            data: { userId, roomId, status: "PENDING", dormId }
        });

        await tx.room.update({
      where: { id: roomId },
      data: { isAvailable: false }
    });

    return booking;
    })
}