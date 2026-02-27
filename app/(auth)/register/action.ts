"use server";

import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import * as argon2 from "argon2";

export async function registerAction(formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!name || !email || !password) {
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
                name,
                email,
                password: hashedPassword,
            },
        });

    } catch (error: any) {
        console.error(error);
        if (error.code === 'P2002') {
            return { error: "อีเมลนี้ถูกใช้งานไปแล้ว" };
        }
        return { error: `สมัครสมาชิกไม่สำเร็จ หรณาลองใหม่อีกครั้ง ${error}` };
    }

    redirect('/login');
}