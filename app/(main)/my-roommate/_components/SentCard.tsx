"use client";

import { cancelMatchRequest } from "@/app/action/matching";
import { useRouter } from "next/navigation";
import { useState } from "react";
// 🟢 1. Import UserCircle เพิ่มเข้ามา
import { Loader2, UserCircle } from "lucide-react";

interface SentCardProps {
  requestId: string;
  receiverName: string;
  receiverImage: string | null;
}

export function SentCard({ requestId, receiverName, receiverImage }: SentCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCancel = async () => {
    const isConfirm = window.confirm(`คุณต้องการยกเลิกคำชวนถึง ${receiverName} ใช่หรือไม่?`);
    if (!isConfirm) return;

    setIsLoading(true);

    try {
      const result = await cancelMatchRequest(requestId);
      if (result.success) {
        router.refresh(); 
      } else {
        alert(result.error);
      }
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center transition-all ${isLoading ? 'opacity-50' : 'hover:border-gray-200'}`}>
      
      <div className="flex items-center gap-4">
        
        {/* 🟢 2. ปรับ Logic รูปภาพเหมือนกันกับ ReceivedCard */}
        <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-gray-100 flex items-center justify-center bg-emerald-50 text-emerald-200">
          {receiverImage ? (
            <img 
              src={receiverImage} 
              alt="avatar" 
              className="w-full h-full object-cover" 
            />
          ) : (
            <UserCircle size={32} strokeWidth={1.5} />
          )}
        </div>

        <div>
          <h3 className="font-bold text-gray-800">{receiverName}</h3>
          <p className="text-sm text-amber-600 font-medium">รอการยืนยัน...</p>
        </div>
      </div>
      
      <button 
        onClick={handleCancel}
        disabled={isLoading}
        className="shrink-0 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors disabled:opacity-50 active:scale-95"
      >
        {isLoading ? <Loader2 size={16} className="animate-spin" /> : "ยกเลิกคำชวน"}
      </button>
      
    </div>
  );
}