import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, User, MapPin } from "lucide-react";
import { StatusBadge } from "@/components/admin/dorm/booking/StatusBadge";
import { DigitalReceipt } from "@/components/booking/success/DigitalReceipt";

// 🟢 1. Import ฟังก์ชันดึงข้อมูล และ ปุ่ม Action
import { getBookingData } from "@/app/action/booking";
import { BookingActionButtons } from "@/components/admin/dorm/booking/BookingActionButtons";

interface PageProps {
  params: Promise<{ slug: string; id: string }>;
}

export default async function BookingDetailPage({ params }: PageProps) {
  const { slug, id } = await params;
  
  // 🟢 2. เรียกใช้ฟังก์ชันดึงข้อมูล (ที่พ่วง user และ room มาแล้ว)
  const booking = await getBookingData(id);

  // ถ้าหาไม่เจอให้เด้งไปหน้า 404
  if (!booking) notFound();

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
      
      {/* 🔙 Navigation */}
      <div className="flex items-center justify-between mb-6">
        <Link href={`/admin/dorm/${slug}/bookings`} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors">
          <ChevronLeft size={20} />
          <span className="font-medium">กลับไปหน้ารายการจอง</span>
        </Link>
        <StatusBadge status={booking.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 📋 ฝั่งซ้าย: ข้อมูลผู้จองและรายละเอียดหอ */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* ข้อมูลนิสิต */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <User size={20} className="text-emerald-600" /> ข้อมูลผู้เช่า
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <p className="text-xs text-gray-400 uppercase font-bold">ชื่อ-นามสกุล</p>
                <p className="font-semibold text-gray-800">{booking.customerName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-400 uppercase font-bold">เบอร์โทรศัพท์</p>
                <p className="font-semibold text-gray-800">{booking.customerPhone || "ไม่ระบุ"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-400 uppercase font-bold">อีเมล</p>
                {/* 🟢 ดึงอีเมลจาก user relation ได้แล้ว */}
                <p className="font-semibold text-gray-800">{booking.user?.email || "ไม่ระบุอีเมล"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-400 uppercase font-bold">วันที่กดจอง</p>
                <p className="font-semibold text-gray-800">{new Date(booking.createdAt).toLocaleString('th-TH')}</p>
              </div>
            </div>
          </div>

          {/* ข้อมูลห้องพัก */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <MapPin size={20} className="text-blue-600" /> รายละเอียดห้องพัก
            </h2>
            <div className="flex justify-between items-center p-4 bg-blue-50 rounded-2xl">
              <div>
                <p className="font-bold text-blue-900 text-xl">ห้อง {booking.room?.name}</p>
                <p className="text-sm text-blue-700">{booking.room?.dorm?.name}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-blue-600 uppercase font-bold">ราคาจอง/ประกัน</p>
                <p className="text-2xl font-black text-blue-900">฿{booking.room?.price?.toLocaleString() || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 📸 ฝั่งขวา: หลักฐานการโอน (สลิป) และปุ่มกด */}
        <div className="space-y-6">
          
          {/* ใบเสร็จดิจิทัล */}
          <DigitalReceipt booking={booking} />

          {/* ⚡ Quick Actions (แสดงเฉพาะสถานะ PENDING) */}
          {/* 🟢 เรียกใช้ Client Component ของเราตรงนี้ */}
          {booking.status === "PENDING" && (
            <BookingActionButtons bookingId={booking.id} />
          )}

        </div>
      </div>
    </div>
  );
}