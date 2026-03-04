import { Suspense } from "react";
import Link from "next/link";
import { CheckCircle2, Home, Calendar, MapPin, Receipt, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
// ✅ Import Action ที่เราแยกไว้
import { getBookingData } from "@/app/action/booking";

export default async function BookingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;

  // ป้องกันกรณีไม่มี ID ส่งมา
  if (!id) redirect("/");

  // ✅ เรียกใช้ Server Action
  const booking = await getBookingData(id);

  if (!booking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <p className="text-gray-500 mb-4">ไม่พบข้อมูลการจอง หรือคำสั่งซื้อหมดอายุ</p>
        <Button asChild variant="outline" className="rounded-xl">
          <Link href="/">กลับหน้าหลัก</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50/30 flex flex-col items-center p-6 pb-20 font-sans antialiased">
      {/* 🎊 Success Header */}
      <div className="mt-12 mb-8 flex flex-col items-center text-center space-y-4">
        <div className="bg-emerald-100 p-4 rounded-full animate-bounce">
          <CheckCircle2 size={64} className="text-emerald-600" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">จองหอพักสำเร็จ!</h1>
        <p className="text-gray-500 max-w-70">
          ระบบล็อคห้อง {booking.room?.name} ให้คุณเรียบร้อยแล้ว
        </p>
      </div>

      {/* 🎫 Digital Receipt Card */}
      <main className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-emerald-200/40 overflow-hidden border border-emerald-100">
        <div className="bg-gray-900 p-6 text-white relative">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Electronic Receipt</p>
              <h2 className="text-xl font-bold truncate max-w-50">{booking.dorm.name}</h2>
            </div>
            <Receipt size={24} className="opacity-40" />
          </div>
          {/* Ticket Notches */}
          <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-emerald-50/30 rounded-full" />
          <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-emerald-50/30 rounded-full" />
        </div>

        <div className="p-8 space-y-6">
          <div className="flex gap-4 items-center">
            <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
              <Home className="text-emerald-600" size={24} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase">Room Information</p>
              <p className="font-bold text-gray-800">{booking.room?.name || "ห้องมาตรฐาน"}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-2">
            <div className="space-y-1">
              <p className="text-[10px] text-gray-400 font-bold uppercase flex items-center gap-1">
                <Calendar size={12} /> Check-in Date
              </p>
              <p className="font-bold text-sm text-gray-700">ระบุภายหลัง</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-gray-400 font-bold uppercase flex items-center gap-1">
                <MapPin size={12} /> Booking ID
              </p>
              <p className="font-bold text-sm text-gray-700 uppercase">#{booking.id.slice(-8)}</p>
            </div>
          </div>

          <div className="border-t border-dashed border-gray-200 my-2" />

          {/* Pricing Details */}
          <div className="space-y-3 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
            <div className="flex justify-between text-xs text-gray-500 font-medium">
              <span>เงินประกัน (2 เดือน)</span>
              <span>฿{booking.deposit.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500 font-medium">
              <span>ค่าเช่าเดือนแรก</span>
              <span>฿{booking.price.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500 font-medium">
              <span>ค่าธรรมเนียมการจอง</span>
              <span>฿{booking.serviceFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-200 mt-2">
              <span className="font-bold text-gray-900">ยอดรวมทั้งหมด</span>
              <span className="text-2xl font-black text-emerald-600">฿{booking.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="bg-emerald-600/5 p-4 text-center">
          <p className="text-[9px] text-emerald-700 font-bold uppercase tracking-widest">
            Confirmed by SmartDorm Engine
          </p>
        </div>
      </main>

      {/* 🎮 Footer Actions */}
      <div className="w-full max-w-md mt-10 space-y-4">
        <Button asChild className="w-full py-8 text-lg font-black rounded-3xl bg-gray-900 hover:bg-black shadow-2xl transition-all active:scale-95">
          <Link href="/booking" className="flex items-center gap-2">
            ดูหอที่จองไว้ทั้งหมด <ArrowRight size={20} />
          </Link>
        </Button>
        <Button asChild variant="ghost" className="w-full py-6 text-gray-400 font-bold hover:text-gray-600">
          <Link href="/">กลับไปหน้าค้นหา</Link>
        </Button>
      </div>
    </div>
  );
}