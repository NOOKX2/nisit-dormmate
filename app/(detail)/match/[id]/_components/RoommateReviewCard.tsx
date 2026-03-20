import { Star, CheckCircle2, Flag, ThumbsUp, UserCircle } from 'lucide-react';

export function RoommateReviewCard({ review }: { review: any }) {
  return (
    <div className="border border-gray-100 rounded-2xl p-5 shadow-sm bg-white">
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-3 items-center">
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden relative text-gray-400">
            <UserCircle size={40} strokeWidth={1.5}/>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm text-gray-900">{review.reviewerName}</h4>
              <span className="flex items-center gap-1 text-[10px] text-[#4CAF50] bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                <CheckCircle2 size={10} /> Verified Roommate
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">{review.date}</p>
          </div>
        </div>
        <button className="text-gray-300 hover:text-gray-500"><Flag size={16} /></button>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4 bg-gray-50/50 rounded-xl p-3 text-center">
        <RatingItem label="🤝 เกรงใจ" score={review.subRatings.consideration} />
        <RatingItem label="✨ สะอาด" score={review.subRatings.cleanliness} border />
        <RatingItem label="💰 การเงิน" score={review.subRatings.finance} />
      </div>

      <p className="text-sm text-gray-700 leading-relaxed mb-4">{review.comment}</p>
      <button className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-emerald-600 transition-colors">
        <ThumbsUp size={14} /> มีประโยชน์ ({review.helpfulCount})
      </button>
    </div>
  );
}

// Helper Component ย่อยที่ใช้แค่ในไฟล์นี้
function RatingItem({ label, score, border }: { label: string, score: number, border?: boolean }) {
  return (
    <div className={border ? "border-l border-r border-gray-200" : ""}>
      <p className="text-[10px] text-gray-500 font-bold mb-1">{label}</p>
      <p className="text-sm font-bold text-gray-900 flex items-center justify-center gap-1">
        <Star size={12} className="text-yellow-400" fill="currentColor" /> {score}
      </p>
    </div>
  );
}