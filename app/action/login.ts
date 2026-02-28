"use server";

import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { SignJWT } from 'jose';
import * as argon2 from "argon2";


const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET
);

export async function loginAction(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        return { error: "กรุณากรอกข้อมูลให้ครบถ้วนครับ" };
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !user.password) {
            return { error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" };
        }

        const isMatch = await argon2.verify(user.password, password);

        if (!isMatch) {
            return { error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" };
        }

        const token = await new SignJWT({
            userId: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('7d')
            .sign(JWT_SECRET);

        const cookieStore = await cookies();
        cookieStore.set('auth_token', token, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, 
            path: '/',
        });

        console.log(`User ${user.name} logged in and session created!`);

    } catch (error: any) {
        console.error("Login Error:", error);
        return { error: "ระบบขัดข้อง กรุณาลองใหม่ภายหลัง" };
    }

    redirect('/');
}