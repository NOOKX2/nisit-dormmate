"use server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function processBookingAction(data: {
  userId: string;
  roomId: string;
  dormId: string;
  customerName: string;
  customerPhone: string;
}) {
  return await prisma.$transaction(async (tx) => {
    // 1. เช็คสถานะห้องก่อน (ป้องกัน Race Condition แบบ Rust-style safety)
    const room = await tx.room.findUnique({
      where: { id: data.roomId }
    });

    if (!room || !room.isAvailable) {
      throw new Error("ขออภัย ห้องพักนี้ถูกจองไปแล้ว");
    }

    // 2. คำนวณยอดเงิน (ดึงราคาจริงจาก DB ปลอดภัยกว่าส่งมาจาก Client)
    const deposit = room.price * 2;
    const serviceFee = 300;
    const totalAmount = room.price + deposit + serviceFee;

    // 3. สร้างใบจอง (บันทึกข้อมูลครบถ้วน)
    const booking = await tx.booking.create({
      data: {
        userId: data.userId,
        roomId: data.roomId,
        dormId: data.dormId,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        price: room.price,
        deposit: deposit,
        serviceFee: serviceFee,
        totalAmount: totalAmount,
        status: "SUCCESS",
      },
    });

    // 4. ล็อคห้องทันที (ตัดสต็อก)
    await tx.room.update({
      where: { id: data.roomId },
      data: { isAvailable: false }
    });

    revalidatePath("/admin");
    revalidatePath(`/dorm/${data.dormId}`);

    return { success: true, bookingId: booking.id };
  });
}

export async function getRoomDetails(roomId: string) {
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

    return {
      dormId: room.dorm.id,
      roomId: room.id,
      dormName: room.dorm.name,
      location: room.dorm.locationShort,
      roomType: room.name, // เช่น "ห้องแอร์ เตียงคู่"
      price: room.price,
      serviceFee: 300, // ค่าธรรมเนียมระบบ (Hardcode หรือดึงจาก DB ก็ได้)
    };
  } catch (error: any) {
    console.error("Fetch error:", error);
    return null;
  }
}