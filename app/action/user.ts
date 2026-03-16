"use server";

import { getAuthUser } from "@/lib/auth";

export async function fetchCurrentUser() {
  return await getAuthUser(); // ✅ ทำงานบน Server แล้วส่งแค่ "ผลลัพธ์" กลับไปให้ Client
}