import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { redirect } from 'next/navigation';

// 🟢 Import ของเล่นใหม่ของเราเข้ามา
import { BookingCard, type BookingWithDorm } from './_components/BookingCard';
import { EmptyBookingState } from './_components/EmptyState';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "");

export default async function MyBookingsPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) redirect('/login');

    let userId = "";
    try {
        const { payload } = await jwtVerify(token, SECRET);
        userId = payload.userId as string;
    } catch (error) {
        redirect('/login');
    }

    const bookings = await prisma.booking.findMany({
        where: { userId: userId },
        include: { dorm: true, room: true },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-10">
            <div className="bg-white px-6 py-12 border-b border-gray-100">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">การจองของฉัน</h1>
                    <p className="text-gray-500 text-sm mt-2">ประวัติการจองและสถานะการเช่าหอพักของคุณ</p>
                </div>
            </div>

            <div className="p-6 space-y-4 max-w-2xl mx-auto mt-4">
                {/* 🌟 ความคลีนบังเกิดตรงนี้แหละครับ! */}
                {bookings.length === 0 ? (
                    <EmptyBookingState />
                ) : (
                    bookings.map((booking: BookingWithDorm) => (
                        <BookingCard key={booking.id} booking={booking} />
                    ))
                )}
            </div>
        </div>
    );
}