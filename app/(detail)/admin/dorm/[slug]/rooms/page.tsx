import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { RoomManager } from "@/app/(detail)/admin/dorm/[slug]/rooms/_components/RoomManager";
import { getDormBySlug } from "@/app/action/dorm";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function AdminRoomsManagePage({ params }: PageProps) {
    const resolvedParams = await params;
    const slug = decodeURIComponent(resolvedParams.slug);

    const dorm = await getDormBySlug(slug);

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