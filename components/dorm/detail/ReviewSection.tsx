import { getDormReviews } from "@/app/action/review";
import { ReviewCard } from "./ReviewCard";
import { ReviewForm } from "./ReviewForm";

interface ReviewSectionProps {
  dormId: string;
  currentUserId?: string;
}

// 🟢 เป็น Server Component 100% (สังเกตคำว่า async)
export async function ReviewSection({ dormId, currentUserId }: ReviewSectionProps) {

  // 🟢 ดึงข้อมูลสดๆ จาก Server ตอน Render หน้านี้เลย
  const reviews = await getDormReviews(dormId);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm mb-24">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        รีวิวจากผู้อยู่จริง ({reviews.length})
      </h2>

      {/* 🟢 เสียบ Client Component เข้าไปตรงนี้ */}


      {/* รายการรีวิว */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-500 font-medium">ยังไม่มีรีวิวสำหรับหอนี้</p>
            <p className="text-sm text-gray-400 mt-1">เป็นคนแรกที่รีวิวเพื่อเป็นประโยชน์กับเพื่อนๆ สิ!</p>
          </div>
        ) : (
          reviews.map((rev) => (
            <ReviewCard
              id={rev.id}
              key={rev.id}
              author={`${rev.user?.firstName} ${rev.user?.lastName}`}
              rating={rev.rating}
              date={new Date(rev.createdAt).toLocaleDateString("th-TH", { year: 'numeric', month: 'short', day: 'numeric' })}
              comment={rev.comment}
              helpfulCount={rev.helpfulCount}
            />
          ))
        )}
      </div>
      {currentUserId ? (
        <ReviewForm dormId={dormId} currentUserId={currentUserId} />
      ) : (
        <div className="mt-8 text-center p-6 bg-gray-50 rounded-2xl border border-gray-100">
          <p className="text-gray-500 font-medium">กรุณาล็อกอินเพื่อเขียนรีวิวและกดถูกใจ 🔒</p>
        </div>
      )}
    </div>
  );
}