"use server";

import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import * as argon2 from "argon2";

export async function registerAction(formData: FormData) {
    const firstName = formData.get('firstName') as string;

    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!firstName || !lastName || !email || !password) {
        return { error: "กรุณากรอกข้อมูลให้ครบทุกช่อง" };
    }

    if (!email.toLowerCase().endsWith('@ku.th')) {
        return { error: "ระบบนี้อนุญาตเฉพาะอีเมลนิสิต มก. (@ku.th) เท่านั้น" };
    }

    try {
        const hashedPassword = await argon2.hash(password, {
            type: argon2.argon2id,
            memoryCost: 65536, // 64MB
            timeCost: 3,
            parallelism: 4,
        });

        await prisma.user.create({
            data: {
                // ใช้ schema ใหม่ที่แยก firstName / lastName และมี nickName
                firstName,
                lastName,
                // ชั่วคราวใช้ชื่อจริงเป็น nickName ถ้ายังไม่มีช่องกรอกแยก
                nickName: firstName,
                email,
                password: hashedPassword,
            },
        });

    } catch (error: any) {
        console.error(error);
        if (error.code === 'P2002') {
            return { error: "อีเมลนี้ถูกใช้งานไปแล้ว" };
        }
        return { error: `สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง` };
    }

    redirect('/login');
}