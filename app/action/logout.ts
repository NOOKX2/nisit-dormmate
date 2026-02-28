"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logoutAction() {
  const cookieStore = await cookies();

  // 1. ลบ Cookie ที่ใช้เก็บ Token ออก
  // ชื่อ 'auth_token' ต้องตรงกับตอนที่คุณสั่ง set ในตอน Login นะครับ
  cookieStore.delete("auth_token");

  // 2. ส่งผู้ใช้กลับไปที่หน้า Login หรือหน้าแรก
  // การใช้ redirect ใน Server Action ต้องเรียกนอก try-catch หรือเรียกเป็นคำสั่งสุดท้ายครับ
  redirect("/login");
}