// components/booking/confirm/ContactInfo.tsx
import { User, Phone, Calendar } from "lucide-react";

interface ContactInfoProps {
  name?: string;
  phone?: string;
  moveInDate?: string;
}

export function ContactInfo({ name, phone, moveInDate }: ContactInfoProps) {
  return (
    <section className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
      {/* ส่วนหัวของ Section */}
      <div className="flex items-center gap-2 mb-2">
        <div className="p-2 bg-emerald-50 rounded-full text-emerald-600">
          <User size={18} />
        </div>
        <h3 className="font-bold text-gray-900">ข้อมูลผู้ติดต่อ</h3>
      </div>

      {/* รายละเอียดข้อมูล */}
      <div className="grid grid-cols-1 gap-4 text-sm">
        <InfoRow label="ชื่อ-นามสกุล" value={name || "-"} />
        <InfoRow label="เบอร์โทรศัพท์" value={phone || "-"} />
        <div className="flex items-center justify-between py-1 px-1">
          <span className="text-gray-500">วันที่คาดว่าจะเข้าอยู่</span>
          <div className="flex items-center gap-1.5 font-bold text-emerald-600">
            <Calendar size={14} />
            <span>{moveInDate || "-"}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// Helper component ภายในไฟล์เพื่อความคลีน
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1 border-b border-gray-50 px-1">
      <span className="text-gray-500">{label}</span>
      <span className="font-bold text-gray-900">{value}</span>
    </div>
  );
}