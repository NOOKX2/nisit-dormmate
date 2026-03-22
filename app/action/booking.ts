"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export async function processBookingAction(data: {
  userId: string;
  roomId: string;
  dormId: string;
  customerName: string;
  customerPhone: string;
}) {
  try {
    return await prisma.$transaction(async (tx) => {
      // 1. เช็คสถานะห้อง (ป้องกัน Race Condition)
      const room = await tx.room.findUnique({
        where: { id: data.roomId },
      });

      if (!room || !room.isAvailable) {
        // throw แบบนี้จะถูก catch ด้านล่าง
        throw new Error("ห้องพักนี้ถูกจองไปแล้วโดยผู้ใช้อื่น");
      }

      // 2. คำนวณยอดเงิน
      const deposit = room.price * 2;
      const serviceFee = 300;
      const totalAmount = room.price + deposit + serviceFee;

      // 3. สร้างใบจอง
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

      // 4. ล็อคห้องทันที
      await tx.room.update({
        where: { id: data.roomId },
        data: { isAvailable: false },
      });

      revalidatePath("/admin");
      revalidatePath(`/dorm/${data.dormId}`);

      return { success: true, bookingId: booking.id };
    });
  } catch (error: any) {
    // 🔴 บันทึก Log ฝั่ง Server (ไว้แก้บั๊กเอง)
    console.error("Booking Error:", error.message);

    // 🟢 ส่งผลลัพธ์ที่ Client (UI) เอาไปแสดง toast.error ได้ง่ายๆ

    return { success: false, error: `ไม่สามารถบันทึกข้อมูลได้ ${error.message}` };

  }
}

export async function getBookingData(id: string) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        user: true, 
        room: {
          include: { dorm: true } 
        },
      },
    });
    return booking;
  } catch (error) {
    console.error("Get Booking Data Error:", error);
    return null;
  }
}

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function getUserBookings() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) return { error: "กรุณาเข้าสู่ระบบ" };

        const { payload } = await jwtVerify(token, SECRET);
        const userId = payload.userId as string;

        const bookings = await prisma.booking.findMany({
            where: { userId: userId },
            include: {
                dorm: true, // ดึงข้อมูลหอพักมาแสดงด้วย
            },
            orderBy: {
                createdAt: 'desc', // เอาที่จองล่าสุดขึ้นก่อน
            }
        });

        return { success: true, bookings };
    } catch (error) {
        return { error: "ไม่สามารถดึงข้อมูลได้" };
    }
}

export async function updateBookingStatus(bookingId: string, status: "PENDING" | "CONFIRMED" | "CANCELLED") {
  try {
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
    });
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    return { error: "ไม่สามารถอัปเดตสถานะได้" };
  }
}