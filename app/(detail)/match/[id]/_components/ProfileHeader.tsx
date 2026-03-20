import { User } from '@prisma/client';
import { CheckCircle2, ShieldCheck, UserCircle } from 'lucide-react';

export function ProfileHeader({ user, score }: { user: User, score: number }) {
  const fullName = `${user.firstName}  ${user.lastName}`;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex justify-between items-start">
      <div className="flex items-center gap-5">
        <div className="relative">
          {/* เปลี่ยนมาใช้ UserCircle ตรงนี้ครับ จัดกึ่งกลางด้วย flex */}
          <div className="w-20 h-20 rounded-full bg-gray-50 border-2 border-white shadow-sm shrink-0 flex items-center justify-center text-gray-400">
            <UserCircle size={56} strokeWidth={1.5} />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-[#4CAF50] rounded-full p-0.5 border-2 border-white">
            <CheckCircle2 size={16} className="text-white" fill="currentColor" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">{user.firstName}</h1>
          <p className="text-sm text-gray-500 font-medium mb-1">{fullName}</p>
          <p className="text-sm text-gray-600 font-medium mb-2">{user.faculty} • ปี {user.year}</p>
          <div className="inline-flex items-center gap-1 bg-emerald-50 text-[#4CAF50] text-xs font-bold px-3 py-1 rounded-full border border-emerald-100">
            <ShieldCheck size={14} /> Verified Student
          </div>
        </div>
      </div>
      <div className="text-right shrink-0">
        <div className="text-3xl font-black text-[#4CAF50] leading-none mb-1">{score}%</div>
        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Match Score</div>
      </div>
    </div>
  );
}