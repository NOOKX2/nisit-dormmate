"use client";

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { calculateMatchScore } from '@/lib/matching';
import { ProfileHeader } from './ProfileHeader';
import { LifestyleSection } from './LifeStyleSection';
import { MateKarmaSection } from './MateKarmaSection';
import { RoommateReview, User } from '@prisma/client';
import { FormattedReview } from '@/types/formatted-review';


const translateLifestyle = (key: string, value: any) => {
  if (!value) return 'ไม่ระบุ';
  const mappings: any = {
    cleanliness: { neat: 'สะอาดมาก', messy: 'รกบ้าง' },
    study_time: { morning: 'ตื่นเช้า', afternoon: 'สายบ่าย', flexible: 'ยืดหยุ่น' },
    guest_policy: { open: 'พาเพื่อนมาได้', limit: 'มาได้บางครั้ง', private: 'ชอบความส่วนตัว' },
  };
  if (key === 'smoking') return value ? 'สูบบุหรี่' : 'ไม่สูบบุหรี่';
  return mappings[key]?.[value] || value;
};

export default function RoommateProfileClient({ profileUser, currentUser, initialReviews }: { profileUser: User, currentUser: User | null, initialReviews: FormattedReview[] }) {
  const score = currentUser ? calculateMatchScore(currentUser, profileUser) : 95;
  


  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-10">
      <div className="max-w-3xl mx-auto p-4 md:p-6">
        <div className="mb-6">
          <Link href="/match" className="flex items-center gap-2 text-gray-700 hover:text-emerald-700 font-bold text-xl">
            <ChevronLeft size={24} className="stroke-[2.5]" /> โปรไฟล์
          </Link>
        </div>

        <div className="flex flex-col gap-6">
          <ProfileHeader user={profileUser} score={score} />
          <LifestyleSection user={profileUser} translate={translateLifestyle} />
          <MateKarmaSection reviews={initialReviews} user={currentUser} targetUser={profileUser}/>
        </div>
      </div>
    </div>
  );
}