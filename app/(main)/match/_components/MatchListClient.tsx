"use client";

import { calculateMatchScore } from '@/lib/matching';
// 🟢 1. Import ไอคอน Lock เพิ่มเข้ามา
import { MessageSquare, UserSearch, UserCircle, Lock } from 'lucide-react'; 
import Link from 'next/link';
import Image from 'next/image';
import { lifestyleConfigs } from '@/config/lifestyle';
import { User } from '@prisma/client';
import { MatchButton } from '@/app/(detail)/match/[id]/_components/MatchButton';
import { UIMatchStatus } from '@/app/action/matching';

export default function MatchListClient({ initialMatches, currentUser, matchStatus }: { initialMatches: User[], currentUser: User | null, matchStatus: Record<string, UIMatchStatus>}) {
  if (!currentUser) return <div className="text-center p-10 bg-gray-50 rounded-3xl">กรุณาเข้าสู่ระบบก่อนดูรายการ</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">

      <div className="flex flex-col gap-4">
        {initialMatches.map((targetUser) => {
          const score = calculateMatchScore(currentUser, targetUser);
          const fullName = `${targetUser.firstName}`;
          const initialMatchStatus = matchStatus[targetUser.id];

          const matchTags = lifestyleConfigs
            .filter(config => targetUser[config.key as keyof User] === currentUser[config.key as keyof User] && targetUser[config.key as keyof User])
            .map(config => {
              const rawValue = targetUser[config.key as keyof User];
              if (config.isBoolean) return rawValue ? "สูบบุหรี่" : "ไม่สูบบุหรี่";
              return String(config.mapping?.[rawValue as keyof typeof config.mapping] || rawValue);
            })
            .slice(0, 3);

          return (
            <div key={targetUser.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col gap-4 transition-all hover:border-emerald-200">

              <div className="flex justify-between items-start w-full">
                <div className="flex items-start gap-4">
                  <div className="relative pt-1 pl-1">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 border-2 border-white shadow-sm shrink-0">
                      {targetUser.image ? (
                        <Image src={targetUser.image} alt={fullName} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-emerald-200 bg-emerald-50">
                          <UserCircle size={40} />
                        </div>
                      )}
                    </div>
                    {/* 🟢 2. ปรับ Badge เล็กๆ ไม่ให้โชว์คะแนน ถ้ายังไม่ทำควิซให้โชว์ "?" สีเทา */}
                    <div className={`absolute -bottom-1 -right-2 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-[1.5px] border-white shadow-sm flex items-center justify-center ${currentUser.hasCompletedQuiz ? 'bg-[#4CAF50]' : 'bg-gray-400'}`}>
                      {currentUser.hasCompletedQuiz ? `${score}%` : '?'}
                    </div>
                  </div>

                  <div className="mt-1">
                    <h2 className="text-lg font-bold text-gray-900 leading-none mb-1">
                      {fullName}
                    </h2>
                    <p className="text-[13px] text-gray-500 font-medium mb-2">
                      {targetUser.faculty || 'คณะไม่ระบุ'} - ปี {targetUser.year || '1'}
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

                {/* 🟢 3. อัปเกรด UI สถานะการทำควิซให้ดูล้ำขึ้น */}
                <div className="text-right shrink-0 mt-1">
                  {currentUser.hasCompletedQuiz ? (
                    <div className="flex flex-col items-end">
                      <div className="text-2xl font-black text-[#4CAF50] leading-none mb-1">{score}%</div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Match Score</div>
                    </div>
                  ): (
                    <div className="flex flex-col items-end justify-center">
                      <div className="text-xl font-black text-gray-300 leading-none mb-1.5 flex items-center gap-1.5">
                        <Lock size={15} className="text-gray-300" />
                        <span>? %</span>
                      </div>
                      {/* เปลี่ยนตัวหนังสือธรรมดาเป็นปุ่มสีส้มอ่อนๆ ดึงดูดสายตา */}
                      <Link 
                        href="/quiz" 
                        className="text-[10px] text-orange-600 font-bold bg-orange-50 hover:bg-orange-100 border border-orange-100 px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                      >
                        ทำควิซเพื่อปลดล็อก
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-1">
                {/* ปุ่มดูโปรไฟล์ (Outline) */}
                <Link
                  href={`/match/${targetUser.id}`}
                  className="flex-1 border-[1.5px] border-[#4CAF50] text-[#4CAF50] hover:bg-emerald-100 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <UserSearch size={16} className="stroke-[2.5]" />
                  ดูโปรไฟล์
                </Link>

                <MatchButton currentUserId={currentUser.id} targetUserId={targetUser.id} initialMatchStatus={initialMatchStatus}/>
                {/* ปุ่มทักแชท (Solid หลัก) */}
                <Link
                  href={`/chat?userId=${targetUser.id}&name=${fullName}`}
                  className="flex-1 border-[1.5px]  hover:bg-emerald-100 text-green-500 border-green-600 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 active:scale-[0.98]"
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