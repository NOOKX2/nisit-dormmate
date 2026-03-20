'use client';

import { useState } from 'react';
import { Star, ShieldCheck, Edit3 } from 'lucide-react';
import { RoommateReviewForm } from './RoommateReviewForm';
import { RoommateReviewCard } from './RoommateReviewCard';
import { RoommateReview, User } from '@prisma/client';
import { FormattedReview } from '@/types/formatted-review';


export function MateKarmaSection({ reviews, user, targetUser }: { reviews: FormattedReview[], user: User| null, targetUser: User }) {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-900">Mate Karma</h2>
        <div className="flex items-center gap-1.5">
          <Star size={20} className="text-yellow-400" fill="currentColor" />
          <span className="text-lg font-bold text-gray-900">4.8</span>
          <span className="text-sm text-gray-400 font-medium">({reviews.length} รีวิว)</span>
        </div>
      </div>
      
      {/* Trust Badge */}
      <div className="bg-[#F2FCF5] border border-emerald-100 rounded-2xl p-4 mb-5 flex gap-3">
        <ShieldCheck size={20} className="text-[#4CAF50] shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-emerald-800 mb-0.5">รีวิวจากรูมเมทที่ยืนยันแล้ว</p>
          <p className="text-xs text-emerald-600/80 font-medium">ทุกรีวิวมาจากคนที่เคยอยู่ร่วมห้องจริง</p>
        </div>
      </div>

      {/* ควบคุมการแสดงผลฟอร์ม */}
      {!isFormOpen ? (
        <button 
          onClick={() => setIsFormOpen(true)}
          className="w-full mb-6 py-3 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors"
        >
          <Edit3 size={18} /> ร่วมประเมินรูมเมทของคุณ
        </button>
      ) : (
        <RoommateReviewForm onClose={() => setIsFormOpen(false)} user={user} targetUser={targetUser}/>
      )}

      {/* แสดงรายการรีวิว (Map ข้อมูลลงการ์ด) */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <RoommateReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}