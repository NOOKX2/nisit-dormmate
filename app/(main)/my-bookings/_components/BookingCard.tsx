import Link from 'next/link';
import { Building2, Calendar, ChevronRight, DoorOpen } from 'lucide-react';
import { Booking, Dorm, Room } from '@prisma/client';

// 🟢 1. ย้าย Type มาไว้ที่นี่ด้วยเลยครับ จะได้ใช้เป็น Props ได้
export type BookingWithDorm = Booking & {
    dorm: Dorm;
    room: Room | null;
};

export function BookingCard({ booking }: { booking: BookingWithDorm }) {
    // 🟢 2. ดึงลอจิกการเช็กสถานะออกมาเป็นตัวแปร เพื่อให้ JSX คลีนขึ้น
    const isSuccess = booking.status === 'SUCCESS';
    const isCancelled = booking.status === 'CANCELLED';
    
    const statusColor = isSuccess 
        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
        : isCancelled 
            ? 'bg-red-50 text-red-600 border-red-100' 
            : 'bg-amber-50 text-amber-600 border-amber-100';

    const dotColor = isSuccess ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse';

    return (
        <Link
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
                            <span className="flex items-center gap-1 bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg text-[11px] font-bold border border-gray-200">
                                <DoorOpen size={10} />
                                {booking.room?.name || booking.roomType}
                            </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 mt-2">
                            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
                                <Calendar size={14} className="text-gray-300" />
                                <span>{new Date(booking.createdAt).toLocaleDateString('th-TH', {
                                    day: 'numeric', month: 'long', year: 'numeric'
                                })}</span>
                            </div>

                            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusColor}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
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
    );
}