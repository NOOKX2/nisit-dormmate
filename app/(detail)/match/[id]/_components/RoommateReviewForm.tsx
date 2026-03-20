'use client';

import React, { useState } from 'react';
import { Star, X } from 'lucide-react';
import { createRoommateReview } from '@/app/action/roommate-review';
import { User } from '@prisma/client';
import { FormError } from '@/components/ui/FormError';

export function RoommateReviewForm({ onClose, user, targetUser }: { onClose: () => void, user: User | null, targetUser: User }) {
  const [consideration, setConsideration] = useState(0);
  const [cleanliness, setCleanliness] = useState(0);
  const [finance, setFinance] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!user?.id) {
    setError("กรุณาเข้าสู่ระบบก่อนให้คะแนนรูมเมทครับ");
    return;
  }
  
  // เรียกใช้ Server Action ที่เราเพิ่งเขียน!
  const result = await createRoommateReview({
    reviewerId: user.id, 
    targetUserId: targetUser.id,
    considerationScore: consideration,
    cleanlinessScore: cleanliness,
    financeScore: finance,
    comment: comment,
  });

  if (result?.success) {
    onClose();             

  } else if (result?.error){
    setError(result.error);  
  }
};

  return (
    <form onSubmit={handleSubmit} className="mb-6 bg-gray-50 border border-gray-200 rounded-2xl p-5 relative animation-fade-in">
      <button 
        type="button" 
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
      >
        <X size={20} />
      </button>
      
      <h3 className="font-bold text-gray-900 mb-4">ให้คะแนนรูมเมทของคุณ</h3>

      <div className="space-y-3 mb-5">
        <InteractiveRating label="🤝 ความเกรงใจ" value={consideration} onChange={setConsideration} />
        <InteractiveRating label="✨ ความสะอาด" value={cleanliness} onChange={setCleanliness} />
        <InteractiveRating label="💰 การเงิน (จ่ายตรงเวลา)" value={finance} onChange={setFinance} />
      </div>

      <div className="mb-4">
        {error && (
       <FormError message={error}/>
      )}
        <label className="block text-sm font-bold text-gray-700 mb-2">ข้อความรีวิว</label>
        <textarea 
          required
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="รูมเมทคนนี้เป็นยังไงบ้าง? มีข้อดีหรือสิ่งที่อยากให้ปรับปรุงไหม..."
          className="w-full p-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
        />
      </div>

      <button 
        type="submit"
        disabled={!consideration || !cleanliness || !finance || !comment}
        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-bold text-sm transition-colors"
      >
        ส่งรีวิว
      </button>
    </form>
  );
}

// Helper Component สำหรับให้ดาวที่ใช้แค่ในฟอร์มนี้
function InteractiveRating({ label, value, onChange }: { label: string, value: number, onChange: (val: number) => void }) {
  return (
    <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button 
            key={star} 
            type="button" 
            onClick={() => onChange(star)}
            className="focus:outline-none transition-transform hover:scale-110"
          >
            <Star 
              size={22} 
              className={star <= value ? "text-yellow-400" : "text-gray-200"} 
              fill="currentColor" 
            />
          </button>
        ))}
      </div>
    </div>
  );
}