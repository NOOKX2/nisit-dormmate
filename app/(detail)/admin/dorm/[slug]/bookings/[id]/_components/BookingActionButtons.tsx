"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ShieldCheck, Loader2, XCircle } from "lucide-react";
// 🟢 Import ฟังก์ชันที่คุณเขียนเตรียมไว้ (แก้ path ให้ตรงกับไฟล์ของคุณ)
import { updateBookingStatus } from "@/app/action/booking"; 

export function BookingActionButtons({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  // เก็บสถานะว่าปุ่มไหนกำลังโหลดอยู่
  const [loading, setLoading] = useState<"CONFIRMED" | "CANCELLED" | null>(null);

  const handleUpdate = async (status: "CONFIRMED" | "CANCELLED") => {
    setLoading(status); // เริ่มหมุนติ้วๆ
    
    // 🟢 เรียกใช้ Server Action ที่คุณเขียนไว้
    const res = await updateBookingStatus(bookingId, status);
    
    if (res.success) {
      toast.success(status === "CONFIRMED" ? "ยืนยันการจองเรียบร้อย!" : "ยกเลิกการจองแล้ว");
      // 🪄 เวทมนตร์ Next.js: สั่งรีเฟรชหน้า Server Component แบบเนียนๆ โดยไม่กระตุก
      router.refresh(); 
    } else {
      toast.error(res.error || "เกิดข้อผิดพลาด");
    }
    
    setLoading(null); // หยุดหมุน
  };

  return (
    <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 space-y-3">
      <p className="text-sm font-bold text-emerald-800 flex items-center gap-2">
        <ShieldCheck size={18} /> ตรวจสอบข้อมูลเรียบร้อย?
      </p>

      {/* ปุ่มยืนยัน (CONFIRMED) */}
      <button 
        onClick={() => handleUpdate("CONFIRMED")}
        disabled={loading !== null}
        className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading === "CONFIRMED" ? <Loader2 size={20} className="animate-spin" /> : "ยืนยันการจองนี้"}
      </button>

      {/* ปุ่มปฏิเสธ (CANCELLED) */}
      <button 
        onClick={() => handleUpdate("CANCELLED")}
        disabled={loading !== null}
        className="w-full py-3 text-red-500 font-bold text-sm hover:text-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading === "CANCELLED" ? <Loader2 size={18} className="animate-spin" /> : "ปฏิเสธ / แจ้งให้โอนใหม่"}
      </button>
    </div>
  );
}