import { Sparkles, Users, Lock } from "lucide-react";

// 1. กำหนดโครงสร้างข้อมูลรูมเมทที่ระบบต้องการใช้แสดงผล
export interface RoommateInfo {
  name: string;
  major: string;
  matchPercent: number;
}

// 2. กำหนด Props สำหรับ Component
interface RoommateStatusProps {
  roommate?: RoommateInfo | null; // เป็น optional เพราะห้องอาจจะว่าง (null)
  hasCompletedQuiz: boolean;
  occupiedSlots?: number;
  capacity?: number;
}

export function RoommateStatus({ roommate, hasCompletedQuiz, occupiedSlots = 0, capacity = 2 }: RoommateStatusProps) {
  const cap = capacity > 0 ? capacity : 1;
  const occ = Math.min(occupiedSlots, cap);

  const capLabel = (
    <span className="text-[10px] font-bold text-gray-500">
      {occ}/{cap} คน
    </span>
  );

  // 1. กรณีห้องว่าง (0/2)
  if (!roommate) {
    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 opacity-50">
            <Users size={14} className="text-gray-400" />
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tight">
              ยังไม่มีคนจอง
            </span>
          </div>
          {capLabel}
        </div>
      </div>
    );
  }

  // 2. กรณีมีคนจองแล้ว แต่ User ยังไม่ทำ Quiz (Locked State)
  if (!hasCompletedQuiz) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-end">{capLabel}</div>
        <div className="group/lock flex items-center justify-between bg-gray-50 p-2 rounded-2xl border border-dashed border-gray-200 transition-colors hover:bg-white hover:border-emerald-200">
        <div className="flex flex-col text-left">
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Roommate Info</span>
          <span className="text-[10px] font-bold text-emerald-600">ทำควิซเพื่อดูเมท</span>
        </div>
        <Lock size={14} className="text-gray-300 group-hover/lock:text-emerald-500 transition-colors" />
      </div>
      </div>
    );
  }

  // 3. กรณีมีคนจองแล้ว และ User ทำ Quiz แล้ว (Full Info)
  return (
    <div className="flex flex-col gap-2 text-left">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
          <Sparkles size={12} className="text-emerald-600" />
        </div>
        <span className="text-[11px] font-black text-emerald-600 uppercase tracking-tighter">
          {roommate.matchPercent}% Match
        </span>
        </div>
        {capLabel}
      </div>
      <p className="text-[11px] text-gray-500 font-medium line-clamp-1">
        👤 {roommate.name} ({roommate.major})
      </p>
      {occ < cap && (
        <p className="text-[10px] font-semibold text-amber-600">เหลือที่ว่าง {cap - occ} คน</p>
      )}
    </div>
  );
}