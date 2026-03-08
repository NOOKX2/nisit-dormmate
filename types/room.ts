import { Room, Booking, User } from "@prisma/client";

// 1. กำหนดโครงสร้าง User ที่ได้จากการ Include (ใช้สำหรับคำนวณ Match)

// 2. กำหนดโครงสร้าง Booking ที่พ่วง User มาด้วย
export interface BookingWithUser extends Booking {
  user: User | null;
}

// 3. Interface หลักสำหรับ Room ที่ใช้แสดงผลในหน้า UI
export interface RoomWithBookingRoommate extends Room {
  // ข้อมูลจาก Prisma (Optional เพราะบางห้องอาจว่าง)
  bookings?: BookingWithUser[];

  // ข้อมูลที่ปั้นเพิ่มสำหรับ Card
  existingRoommate: {
    name: string;
    major: string;
    matchPercent: number;
  } | null;
}
