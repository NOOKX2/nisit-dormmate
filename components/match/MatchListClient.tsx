'use client'

import { calculateMatchScore } from '@/lib/matching';
import { CheckCircle2, XCircle } from 'lucide-react'

// 1. รวมชื่อแสดงผลและ Key ที่ใช้ใน DB ไว้ที่เดียว
const lifestyleConfigs = [
  { key: 'cleanliness', label: 'ความสะอาด', mapping: { neat: 'ระเบียบจัด', messy: 'รกบ้าง' } },
  { key: 'smoking', label: 'สูบบุหรี่', isBoolean: true },
  { key: 'study_time', label: 'เวลาเรียน', mapping: { morning: 'สายเช้า', afternoon: 'สายบ่าย', flexible: 'ยืดหยุ่น' } },
  { key: 'location', label: 'สถานที่อ่านหนังสือ', mapping: { room: 'อ่านในห้อง', outside: 'อ่านข้างนอก' } },
  { key: 'guest_policy', label: 'การพาเพื่อนมาห้อง', mapping: { open: 'พาเพื่อนมาได้ตลอด', limit: 'พามาได้บางครั้ง', private: 'พื้นที่ส่วนตัว' } },
  { key: 'air_con', label: 'สไตล์การเปิดแอร์', mapping: { save: 'เน้นประหยัด (26°C+)', cool: 'เน้นฉ่ำ (23-24°C)' } },
];

export default function MatchListClient({ initialMatches, currentUser }: { initialMatches: any[], currentUser: any }) {
  if (!currentUser) return <div className="text-center p-10 bg-gray-50 rounded-3xl">กรุณาเข้าสู่ระบบก่อนดูรายการ</div>;

  return (
    <div className="grid gap-6">
      {initialMatches.map((user) => {
        const score = calculateMatchScore(currentUser, user);
        
        return (
          <div key={user.id} className="bg-white rounded-[2.5rem] p-7 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 hover:shadow-md transition-all duration-300">
            {/* คะแนน Match */}
            <div className="flex flex-col items-center justify-center bg-linear-to-br from-emerald-50 to-teal-50 rounded-[2rem] p-6 min-w-37.5 border border-emerald-100 shadow-inner">
              <span className="text-emerald-600 font-bold text-[10px] mb-1 uppercase tracking-[0.2em]">Match Score</span>
              <span className="text-5xl font-black text-emerald-700">{score}%</span>
            </div>

            {/* ข้อมูล */}
            <div className="flex-1">
              <div className="mb-6">
                <h2 className="text-2xl font-black text-gray-900">{user.name}</h2>
                <p className="text-emerald-600 text-sm font-bold flex items-center gap-2">
                   <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                   {user.faculty || 'นิสิตมหาวิทยาลัย'}
                </p>
              </div>

              {/* 🟢 Lifestyle Grid - วนลูปจาก Config */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {lifestyleConfigs.map((config) => {
                  const rawValue = user[config.key];
                  const userValue = config.isBoolean 
                    ? (rawValue ? "สูบ" : "ไม่สูบ")
                    : (config.mapping?.[rawValue as keyof typeof config.mapping] || rawValue);
                  
                  // เช็คว่าตรงกับ currentUser ไหม
                  const isMatch = user[config.key] === currentUser[config.key];

                  return (
                    <LifestyleItem 
                      key={config.key}
                      label={config.label} 
                      value={userValue} 
                      isMatch={isMatch} 
                    />
                  );
                })}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function LifestyleItem({ label, value, isMatch }: { label: string, value: any, isMatch: boolean }) {
  return (
    <div className={`p-4 rounded-2xl border transition-all duration-300 ${isMatch ? 'border-emerald-200 bg-emerald-50/40 shadow-sm' : 'border-gray-100 bg-gray-50/50'}`}>
      <div className="flex items-center gap-2 mb-1.5">
        {isMatch ? (
          <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
        ) : (
          <XCircle size={14} className="text-gray-300 shrink-0" />
        )}
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
      </div>
      <p className={`text-sm font-bold ${isMatch ? 'text-emerald-700' : 'text-gray-600'}`}>
        {value || 'ยังไม่ระบุ'}
      </p>
    </div>
  )
}