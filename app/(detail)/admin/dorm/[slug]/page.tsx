import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Building, BedDouble, CalendarCheck, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge"; // ถ้าไม่มี ใช้ <span> ปรับ style เอาได้ครับ
import { getDormBySlug } from "@/app/action/dorm";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function AdminDormManagePage({ params }: PageProps) {
  // 1. ดึง ID จาก params และ Query ข้อมูลหอพัก
  const resolvedParams = await params;
  const slug = decodeURIComponent(resolvedParams.slug);
  const dorm = await getDormBySlug(slug);

  if (!dorm) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
      
      {/* 🔙 Header & Back Button */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft size={24} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">จัดการหอพัก: {dorm.name}</h1>
          <p className="text-sm text-gray-500">ID: {dorm.id}</p>
        </div>
        <Badge className="ml-auto bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none">
          Verified
        </Badge>
      </div>

      {/* 📊 เมนูจัดการหลัก (Grid Menu) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* เมนู: แก้ไขข้อมูลหอพัก */}
        <Link href={`/admin/dorm/${dorm.slug}/edit`} 
          className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-emerald-200 hover:shadow-md transition-all group">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Building size={24} />
          </div>
          <h3 className="font-bold text-gray-900 mb-1">แก้ไขข้อมูลทั่วไป</h3>
          <p className="text-sm text-gray-500">ชื่อหอพัก, พิกัด, ค่าน้ำ, ค่าไฟ, ส่วนกลาง</p>
        </Link>

        {/* เมนู: จัดการประเภทห้อง */}
        <Link href={`/admin/dorm/${dorm.slug}/rooms`} 
          className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-emerald-200 hover:shadow-md transition-all group">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <BedDouble size={24} />
          </div>
          <h3 className="font-bold text-gray-900 mb-1">จัดการประเภทห้องพัก</h3>
          <p className="text-sm text-gray-500">มีห้องทั้งหมด {dorm.rooms?.length || 0} ประเภท</p>
        </Link>

        {/* เมนู: ดูรายการจอง */}
        <Link href={`/admin/dorm/${dorm.slug}/bookings`} 
          className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-emerald-200 hover:shadow-md transition-all group">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <CalendarCheck size={24} />
          </div>
          <h3 className="font-bold text-gray-900 mb-1">รายการจองของหอนี้</h3>
          <p className="text-sm text-gray-500">ตรวจสอบนิสิตที่ชำระเงินจองแล้ว</p>
        </Link>

      </div>

      {/* ⚙️ Danger Zone (ลบหอพัก) */}
      <div className="mt-12 p-6 rounded-2xl border border-red-100 bg-red-50/50">
        <h3 className="font-bold text-red-800 mb-2 flex items-center gap-2">
          <Trash2 size={18} /> Danger Zone
        </h3>
        <p className="text-sm text-red-600/80 mb-4">
          การลบหอพักจะทำให้ข้อมูลห้องพักและการจองที่เกี่ยวข้องถูกลบทั้งหมด (ระวังในการใช้งาน)
        </p>
        <button className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors">
          ลบหอพักนี้
        </button>
      </div>

    </div>
  );
}