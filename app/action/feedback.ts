"use server";

import { getAuthUser } from "@/lib/auth";
import { error } from "console";

export async function sendFeedbackAction(formData: FormData) {
    try {
        const user = await getAuthUser();
        
        const userName = user?.name || "บุคคลทั่วไป (ไม่ได้ล็อกอิน)";
        const userEmail = user?.email || "ไม่มีข้อมูลอีเมล";

        const message = formData.get("message") as string;
        if (!message) return { error: "กรุณาพิมพ์ข้อความให้ครบถ้วน" };

        const accessToken = process.env.CHANNEL_ACCESS_TOKEN;
        // 🟢 ดึง Group ID ที่เราได้มาจากไฟล์ .env
        const groupId = process.env.LINE_GROUP_ID;

        if (!accessToken || !groupId) return { error: "ระบบหลังบ้านตั้งค่า LINE ไม่ครบถ้วน" };
        
        // 🟢 จัดรูปแบบข้อความ และใส่เป้าหมาย (to) ว่าจะส่งไปที่กลุ่มไหน
        const payload = {
            to: groupId, // 👈 ระบุปลายทางเป็น Group ID ของทีมบัญชี
            messages: [
                {
                    type: "text",
                    text: `🚨 [แจ้งปัญหาการใช้งาน]\n\n👤 ผู้ส่ง: ${userName}\n📧 ติดต่อ: ${userEmail}\n\n📝 ข้อความ:\n"${message}"\n\n⏰ เวลา: ${new Date().toLocaleString('th-TH')}`
                }
            ]
        };

        // 🟢 เปลี่ยน URL จาก broadcast เป็น push!
        const response = await fetch("https://api.line.me/v2/bot/message/push", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error("LINE API Error:", errorData);
            throw new Error("เชื่อมต่อ LINE ไม่สำเร็จ");
        }

        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}