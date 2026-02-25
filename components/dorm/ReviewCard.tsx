import { Star, CheckCircle } from 'lucide-react';

interface ReviewCardProps {
  author: string;
  faculty: string;
  year: number;
  rating: number;
  date: string;
  comment: string;
  helpfulCount: number;
}

export function ReviewCard({ author, faculty, year, rating, date, comment, helpfulCount }: ReviewCardProps) {
  return (
    <div className="border-b border-gray-100 py-4 last:border-0">
      <div className="flex items-center gap-2 mb-1">
        <span className="font-bold text-gray-800">{author}</span>
        <span className="text-sm text-gray-500">- {faculty}ปี {year}</span>
        <span className="bg-emerald-50 text-emerald-600 text-xs px-2 py-0.5 rounded flex items-center gap-1">
          <CheckCircle size={12} /> ยืนยันแล้ว
        </span>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <div className="flex text-yellow-400">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={14} fill={i < Math.floor(rating) ? "currentColor" : "none"} />
          ))}
        </div>
        <span className="text-xs text-gray-400">{date}</span>
      </div>
      <p className="text-sm text-gray-700 mb-3">{comment}</p>
      <button className="text-xs text-gray-400 flex items-center gap-1 hover:text-emerald-600">
        <span className="text-lg">👍</span> มีประโยชน์ ({helpfulCount})
      </button>
    </div>
  );
}