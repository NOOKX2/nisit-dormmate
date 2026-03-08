// components/profile/LifestyleCard.tsx
import { CheckCircle2, CircleDashed } from 'lucide-react'

// ใช้ Config ชุดเดียวกับหน้า Match
const lifestyleConfigs = [
  { key: 'cleanliness', label: 'ความสะอาด', mapping: { neat: 'ระเบียบจัด', messy: 'รกบ้าง' } },
  { key: 'smoking', label: 'สูบบุหรี่', isBoolean: true },
  { key: 'study_time', label: 'เวลาเรียน', mapping: { morning: 'สายเช้า', afternoon: 'สายบ่าย', flexible: 'ยืดหยุ่น' } },
  { key: 'location', label: 'สถานที่อ่านหนังสือ', mapping: { room: 'อ่านในห้อง', outside: 'อ่านข้างนอก' } },
  { key: 'guest_policy', label: 'การพาเพื่อนมาห้อง', mapping: { open: 'พาเพื่อนมาได้ตลอด', limit: 'พามาได้บางครั้ง', private: 'พื้นที่ส่วนตัว' } },
  { key: 'air_con', label: 'สไตล์การเปิดแอร์', mapping: { save: 'เน้นประหยัด (26°C+)', cool: 'เน้นฉ่ำ (23-24°C)' } },
];

export default function LifestyleCard({ user }: { user: any }) {
  return (
    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 space-y-6">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-xl font-black text-gray-900">ไลฟ์สไตล์ของฉัน</h3>
        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">
          {user.hasCompletedQuiz ? 'ทำแบบทดสอบแล้ว' : 'ยังไม่ได้ทำแบบทดสอบ'}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {lifestyleConfigs.map((config) => {
          const rawValue = user[config.key];
          const displayValue = config.isBoolean 
            ? (rawValue ? "สูบบุหรี่" : "ไม่สูบบุหรี่")
            : (config.mapping?.[rawValue as keyof typeof config.mapping] || rawValue);

          return (
            <div 
              key={config.key} 
              className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100"
            >
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                  {config.label}
                </span>
                <span className="text-sm font-bold text-gray-700">
                  {displayValue || 'ยังไม่ระบุ'}
                </span>
              </div>
              
              {/* Icon แสดงสถานะข้อมูล */}
              {displayValue ? (
                <CheckCircle2 size={18} className="text-emerald-500" />
              ) : (
                <CircleDashed size={18} className="text-gray-300 animate-pulse" />
              )}
            </div>
          );
        })}
      </div>
      
      {!user.hasCompletedQuiz && (
        <p className="text-center text-xs text-amber-600 font-medium bg-amber-50 p-3 rounded-xl">
          กรุณาทำแบบทดสอบเพื่อผลลัพธ์การ Match ที่แม่นยำ
        </p>
      )}
    </div>
  );
}