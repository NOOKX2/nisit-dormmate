import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { RoomManager } from "@/components/admin/dorm/rooms/RoomManager";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function AdminRoomsManagePage({ params }: PageProps) {
    const resolvedParams = await params;
    const slug = decodeURIComponent(resolvedParams.slug);

    // ดึงข้อมูลหอพัก พร้อมกับ "ห้องพักทั้งหมด" ของหอพักนี้
    const dorm = await prisma.dorm.findUnique({
        where: { slug: slug },
        include: {
            rooms: {
                include: {
                    bookings: {
                        where: { status: "SUCCESS" } // สมมติว่าดึงเฉพาะคนที่กำลังเช่าอยู่
                    }
                },
                orderBy: { price: 'asc' } 
            },
        },
    });

    if (!dorm) {
        notFound();
    }

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">

            {/* 🔙 Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href={`/admin/dorm/${dorm.slug}`} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ChevronLeft size={24} className="text-gray-600" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">จัดการประเภทห้องพัก</h1>
                    <p className="text-sm text-gray-500">{dorm.name}</p>
                </div>
            </div>

            {/* 🚀 เรียกใช้งาน Client Component */}
            <RoomManager dormId={dorm.id} rooms={dorm.rooms} />

        </div>
    );
}