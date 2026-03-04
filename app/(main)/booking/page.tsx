import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { Building2, Calendar, ChevronRight, Clock, Inbox, DoorOpen } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

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
        include: {
            dorm: true,
            room: true, // ดึงข้อมูล Room ตาม Schema
        },
        orderBy: {
            createdAt: 'desc',
        }
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
                {bookings.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-gray-100 shadow-sm">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Inbox className="text-gray-300" size={48} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">ยังไม่มีการจอง</h3>
                        <Link href="/" className="inline-flex items-center justify-center bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold mt-6 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">
                            หาหอพักที่ถูกใจ
                        </Link>
                    </div>
                ) : (
                    bookings.map((booking) => (
                        <Link
                            key={booking.id}
                            href={`/dorm/${booking.dorm.slug}/booking/success?id=${booking.id}`}
                            className="group block bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-emerald-200 hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="flex justify-between items-center">
                                <div className="flex gap-5">
                                    <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                                        <Building2 size={32} />
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-bold text-gray-900 text-xl tracking-tight">
                                                {booking.dorm.name}
                                            </h3>
                                            {/* 🟢 แสดง Room Name หรือ Room Type */}
                                            <span className="flex items-center gap-1 bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg text-[11px] font-bold border border-gray-200">
                                                <DoorOpen size={10} />
                                                {booking.room?.name || booking.roomType}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-4 mt-2">
                                            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
                                                <Calendar size={14} className="text-gray-300" />
                                                <span>{new Date(booking.createdAt).toLocaleDateString('th-TH', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}</span>
                                            </div>

                                            {/* แสดงสถานะตามข้อมูลจริงใน DB (PENDING, SUCCESS, CANCELLED) */}
                                            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${booking.status === 'SUCCESS'
                                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                    : booking.status === 'CANCELLED'
                                                        ? 'bg-red-50 text-red-600 border-red-100'
                                                        : 'bg-amber-50 text-amber-600 border-amber-100'
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${booking.status === 'SUCCESS' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></span>
                                                {booking.status}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-gray-50 items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                                    <ChevronRight className="text-gray-400 group-hover:text-white" size={24} />
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}