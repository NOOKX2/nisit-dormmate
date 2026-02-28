import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// ต้องเป็น Secret ตัวเดียวกับใน loginAction นะครับ
const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    
    // 1. ดึง token จาก cookie ที่คุณตั้งชื่อว่า 'auth_token'
    const token = request.cookies.get('auth_token')?.value;
    console.log(`token ${token}`);

    if (!token) {
        // ถ้าไม่มี token และพยายามเข้าหน้า admin ให้ดีดกลับหน้าแรก
        if (pathname.startsWith('/admin')) {
            return NextResponse.redirect(new URL('/', request.url));
        }
        return NextResponse.next();
    }

    try {
        // 2. ถอดรหัส JWT
        const { payload } = await jwtVerify(token, SECRET);
        console.log(`payload ${payload.role}`);
        
        // 3. เช็ก Role (คุณต้องอย่าลืมใส่ role ลงใน Payload ตอน Login ด้วยนะครับ!)
        const role = payload.role as string;

        if (pathname === '/' && role === 'ADMIN') {
            return NextResponse.redirect(new URL('/admin', request.url));
        }

        if (pathname.startsWith('/admin') && role !== 'ADMIN') {
            return NextResponse.redirect(new URL('/', request.url));
        }

    } catch (error) {
        // ถ้า token ปลอมหรือหมดอายุ
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/admin/:path*'],
};