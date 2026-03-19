"use server";

import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import * as argon2 from "argon2";

export async function registerAction(formData: FormData) {
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // 1. Validation เบื้องต้น
    if (!firstName || !lastName || !email || !password) {
        return { error: "กรุณากรอกข้อมูลให้ครบทุกช่อง" };
    }

    if (!email.toLowerCase().endsWith('@ku.th')) {
        return { error: "ระบบนี้อนุญาตเฉพาะอีเมลนิสิต มก. (@ku.th) เท่านั้น" };
    }

    // 🌟 สร้างตัวแปรเช็คสถานะ
    let isSuccess = false;

    try {
        const hashedPassword = await argon2.hash(password, {
            type: argon2.argon2id,
            memoryCost: 65536,
            timeCost: 3,
            parallelism: 4,
        });

        await prisma.user.create({
            data: {
                firstName,
                lastName,
                nickName: firstName,
                email,
                password: hashedPassword,
            },
        });

        // 🟢 ถ้าถึงตรงนี้แปลว่าสำเร็จ
        isSuccess = true;

    } catch (error: any) {
        // 🔥 คราวนี้ console.error ตรงนี้จะขึ้นใน Vercel Logs แน่นอน!
        console.error("🔴 Register Error Details:", error); 
        
        if (error.code === 'P2002') {
            return { error: "อีเมลนี้ถูกใช้งานไปแล้ว" };
        }
        return { error: `สมัครสมาชิกไม่สำเร็จ: ${error.message}` };
    }

    // 🟢 2. ย้าย redirect มาไว้นอกบล็อก try-catch
    if (isSuccess) {
        redirect('/login');
    }
}