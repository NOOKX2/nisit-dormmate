// 🟢 เอา "use client" ออกไปเลยครับ ให้เป็น Server Component แบบคลีนๆ
import { Star, CheckCircle } from 'lucide-react';
import { ReviewLikeButton } from './RevireLikeButton';

interface ReviewCardProps {
  id: string;
  author: string;
  faculty?: string;
  year?: number;
  rating: number;
  date: string;
  comment: string;
  helpfulCount: number;
}

export function ReviewCard({ id, author, faculty, year, rating, date, comment, helpfulCount }: ReviewCardProps) {

  return (
    <div className="border-b border-gray-100 py-6 last:border-0">

      {/* ส่วนหัวการ์ด */}
      <div className="flex items-center gap-2 mb-2">
        <span className="font-bold text-gray-800">{author}</span>
        {faculty && year && (
          <span className="text-sm text-gray-500">- {faculty} ปี {year}</span>
        )}
        <span className="bg-emerald-50 text-emerald-600 text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 font-medium border border-emerald-100">
          <CheckCircle size={12} /> ยืนยันผู้เข้าพัก
        </span>
      </div>

      {/* ส่วนดาวและวันที่ */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              className={i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}
            />
          ))}
        </div>
        <span className="text-xs text-gray-400 font-medium">{date}</span>
      </div>

      {/* ข้อความรีวิว */}
      <p className="text-sm text-gray-700 mb-4 leading-relaxed">{comment}</p>

      {/* 🟢 เสียบ Client Component เข้าไปตรงนี้ (ส่ง id และ คะแนนเริ่มต้นไปให้ปุ่ม) */}
      <ReviewLikeButton reviewId={id} initialLikes={helpfulCount} />

    </div>
  );
}