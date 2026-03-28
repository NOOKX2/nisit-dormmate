"use server"

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getRoomDetails(roomId: string, currentUserId?: string) {
  try {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        dorm: true, // ดึงข้อมูลหอพักที่ห้องนี้สังกัดอยู่มาด้วย
      },
    });

    if (!room) {
      return null;
    }

    const occupied = await prisma.booking.count({
      where: { roomId: room.id, status: "SUCCESS" },
    });

    if (occupied >= room.capacity) {
      return null;
    }

    if (currentUserId) {
      const already = await prisma.booking.findFirst({
        where: {
          roomId: room.id,
          userId: currentUserId,
          status: "SUCCESS",
        },
      });
      if (already) {
        return null;
      }
    }

    return {
      dormId: room.dorm.id,
      roomId: room.id,
      dormName: room.dorm.name,
      location: room.dorm.locationShort,
      roomType: room.name, // เช่น "ห้องแอร์ เตียงคู่"
      price: room.price,
      capacity: room.capacity,
      occupiedSlots: occupied,
      serviceFee: 300, // ค่าธรรมเนียมระบบ (Hardcode หรือดึงจาก DB ก็ได้)
      dorm: room.dorm,
    };
  } catch (error: any) {
    console.error("Fetch error:", error);
    return null;
  }
}

export async function addRoomType(dormId: string, data: {
  name: string;
  price: number;
  capacity: number;
  isAvailable: boolean;
}) {
  try {
    await prisma.room.create({
      data: {
        dormId: dormId,
        name: data.name,
        price: data.price,
        capacity: data.capacity,
        isAvailable: data.isAvailable,
      },
    });

    revalidatePath("/admin"); // รีเฟรชแคช
    return { success: true };
  } catch (error: any) {
    console.error("Add Room Error:", error);
    return { error: "ไม่สามารถเพิ่มห้องได้ โปรดลองอีกครั้ง" };
  }
}

// 🔴 2. ฟังก์ชันลบประเภทห้อง
export async function deleteRoomType(roomId: string) {
  try {
    await prisma.room.delete({
      where: { id: roomId },
    });
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Delete Room Error:", error);
    return { error: "ลบข้อมูลไม่สำเร็จ อาจมีคนจองห้องนี้อยู่" };
  }
}