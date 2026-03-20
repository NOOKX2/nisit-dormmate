"use client";

import { useState } from "react";
import { Star, Loader2, Edit3 } from "lucide-react";
import { submitReview } from "@/app/action/review";
import { toast } from "sonner";

interface ReviewFormProps {
  dormId: string;
  currentUserId?: string;
}

export function ReviewForm({ dormId, currentUserId }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUserId) return toast.error("กรุณาล็อกอินก่อนรีวิวนะครับ!");
    if (rating === 0) return toast.error("กรุณาให้คะแนนดาวด้วยครับ!");
    if (!comment.trim()) return toast.error("กรุณาพิมพ์ข้อความรีวิวด้วยครับ!");

    setIsSubmitting(true);
    const result = await submitReview(dormId, currentUserId, rating, comment);
    
    if (result.success) {
      toast.success("ขอบคุณสำหรับรีวิวครับ!");
      // 🟢 เคลียร์ฟอร์มทิ้ง (ข้อมูลใหม่จะเด้งมาเองเพราะ revalidatePath ฝั่ง Server)
      setRating(0);
      setComment("");
      setIsFormOpen(false);
    } else {
      toast.error(result.error);
    }
    setIsSubmitting(false);
  };

  if (!isFormOpen) {
    return (
      <div className="flex justify-center mt-6 mb-8">
        <button 
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-emerald-600 text-emerald-700 rounded-full font-bold hover:bg-emerald-50 transition-colors shadow-sm"
        >
          <Edit3 size={18} />
          เขียนรีวิวของคุณ
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-5 bg-gray-50/50 rounded-2xl border border-gray-100">
      <h3 className="font-semibold text-gray-800 mb-3">แชร์ประสบการณ์ของคุณ</h3>
      
      <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="focus:outline-none transition-transform hover:scale-110"
          >
            <Star 
              size={28} 
              className={star <= (hoverRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} 
            />
          </button>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="หอนี้เป็นยังไงบ้าง? การเดินทาง, ความสะอาด, เจ้าของหอใจดีไหม..."
        className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm mb-4 min-h-25 resize-none"
      />
      
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting || rating === 0 || !comment.trim()}
          className="bg-emerald-600 text-white px-8 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-700 disabled:opacity-50 disabled:hover:bg-emerald-600 transition-all flex items-center gap-2 shadow-sm"
        >
          {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : "ส่งรีวิว"}
        </button>
      </div>
    </form>
  );
}