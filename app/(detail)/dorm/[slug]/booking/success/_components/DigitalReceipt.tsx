import { Home, Calendar, MapPin, Receipt } from "lucide-react";

export function DigitalReceipt({ booking }: { booking: any }) {
  return (
    <main className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-emerald-200/40 overflow-hidden border border-emerald-100">
      {/* Ticket Top Part */}
      <div className="bg-gray-900 p-6 text-white relative">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Electronic Receipt</p>
            <h2 className="text-xl font-bold truncate max-w-50">{booking.dorm?.name}</h2>
          </div>
          <Receipt size={24} className="opacity-40" />
        </div>
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
          {[
            { label: "เงินประกัน (2 เดือน)", value: booking.deposit },
            { label: "ค่าเช่าเดือนแรก", value: booking.price },
            { label: "ค่าธรรมเนียมการจอง", value: booking.serviceFee },
          ].map((item, idx) => (
            <div key={idx} className="flex justify-between text-xs text-gray-500 font-medium">
              <span>{item.label}</span>
              <span>฿{item.value?.toLocaleString()}</span>
            </div>
          ))}
          <div className="flex justify-between items-center pt-2 border-t border-gray-200 mt-2">
            <span className="font-bold text-gray-900">ยอดรวมทั้งหมด</span>
            <span className="text-2xl font-black text-emerald-600">฿{booking.totalAmount?.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="bg-emerald-600/5 p-4 text-center">
        <p className="text-[9px] text-emerald-700 font-bold uppercase tracking-widest">
          Confirmed by SmartDorm Engine
        </p>
      </div>
    </main>
  );
}