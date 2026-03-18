"use client";

import { calculateMatchScore } from '@/lib/matching';
import { MessageSquare, UserSearch, UserCircle } from 'lucide-react'; // เปลี่ยนไอคอนเป็น UserSearch
import Link from 'next/link';
import Image from 'next/image';
import { lifestyleConfigs } from '@/config/lifestyle';


export default function MatchListClient({ initialMatches, currentUser }: { initialMatches: any[], currentUser: any }) {
  if (!currentUser) return <div className="text-center p-10 bg-gray-50 rounded-3xl">กรุณาเข้าสู่ระบบก่อนดูรายการ</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">

      <div className="flex flex-col gap-4">
        {initialMatches.map((user) => {
          const score = calculateMatchScore(currentUser, user);
          const fullName = `${user.firstName}`; 
          
          const matchTags = lifestyleConfigs
            .filter(config => user[config.key] === currentUser[config.key] && user[config.key])
            .map(config => {
              const rawValue = user[config.key];
              if (config.isBoolean) return rawValue ? "สูบบุหรี่" : "ไม่สูบบุหรี่";
              return config.mapping?.[rawValue as keyof typeof config.mapping] || rawValue;
            })
            .slice(0, 3); 

          return (
            <div key={user.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col gap-4 transition-all hover:border-emerald-200">
              
              <div className="flex justify-between items-start w-full">
                <div className="flex items-start gap-4">
                  <div className="relative pt-1 pl-1">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 border-2 border-white shadow-sm shrink-0">
                      {user.avatarUrl ? (
                        <Image src={user.avatarUrl} alt={fullName} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-emerald-200 bg-emerald-50">
                          <UserCircle size={40} />
                        </div>
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-2 bg-[#4CAF50] text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-[1.5px] border-white shadow-sm">
                      {score}%
                    </div>
                  </div>

                  <div className="mt-1">
                    <h2 className="text-lg font-bold text-gray-900 leading-none mb-1">
                      {fullName}
                    </h2>
                    <p className="text-[13px] text-gray-500 font-medium mb-2">
                      {user.faculty || 'คณะไม่ระบุ'} - ปี {user.year || '1'}
                    </p>
                    
                    <div className="flex flex-wrap gap-1.5">
                      {matchTags.map((tag, index) => (
                        <span key={index} className="bg-emerald-50 text-[#4CAF50] text-[11px] font-bold px-2.5 py-1 rounded-full border border-emerald-100/50">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0 mt-1">
                  <div className="text-2xl font-black text-[#4CAF50] leading-none mb-1">{score}%</div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Match Score</div>
                </div>
              </div>

              {/* 🟢 อัปเดตปุ่ม Action ใหม่ตามโมเดลที่ 1 */}
              <div className="flex gap-3 mt-1">
                {/* ปุ่มดูโปรไฟล์ (Outline) */}
                <Link 
                  href={`/match/${user.id}`}
                  className="flex-1 border-[1.5px] border-[#4CAF50] text-[#4CAF50] hover:bg-emerald-50 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <UserSearch size={16} className="stroke-[2.5]" />
                  ดูโปรไฟล์
                </Link>
                
                {/* ปุ่มทักแชท (Solid หลัก) */}
                <Link 
                  href={`/chat?userId=${user.id}&name=${fullName}`}
                  className="flex-1 bg-[#4CAF50] hover:bg-[#43a047] text-white py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <MessageSquare size={16} className="stroke-[2.5]" />
                  ทักแชท
                </Link>
              </div>

            </div>
          )
        })}
      </div>
    </div>
  )
}