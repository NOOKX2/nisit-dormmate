"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
// 🟢 1. Import UserCircle เพิ่มเข้ามา
import { Loader2, UserCircle } from "lucide-react"; 
import { respondToMatchRequest } from "@/app/action/matching";

interface ReceivedCardProps {
  requestId: string;
  senderName: string;
  senderImage: string | null;
}

export function ReceivedCard({ requestId, senderName, senderImage }: ReceivedCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAction = async (action: "ACCEPT" | "REJECT") => {
    setIsLoading(true);
    try {
      const result = await respondToMatchRequest(requestId, action);
      if (!result.success) {
        toast.error(result.error || "ทำรายการไม่สำเร็จ");
        return;
      }

      toast.success(action === "ACCEPT" ? "กดยอมรับเป็นเมทแล้ว" : "ปฏิเสธคำขอแล้ว");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center">
      <div className="flex items-center gap-4">
        
        {/* 🟢 2. ปรับ Logic รูปภาพ ถ้าไม่มีรูปให้โชว์ UserCircle พร้อมสีพื้นหลัง Emerald-50 */}
        <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-gray-100 flex items-center justify-center bg-emerald-50 text-emerald-200">
          {senderImage ? (
            <img src={senderImage} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <UserCircle size={32} strokeWidth={1.5} />
          )}
        </div>

        <div>
          <h3 className="font-bold text-gray-800">{senderName}</h3>
          <p className="text-sm text-gray-500">อยากเป็นรูมเมทกับคุณ</p>
        </div>
      </div>
      <div className="flex gap-2 shrink-0">
        <button 
          onClick={() => handleAction('ACCEPT')}
          disabled={isLoading}
          className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-bold hover:bg-emerald-600 disabled:opacity-50"
        >
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : "ยอมรับ"}
        </button>
        <button 
          onClick={() => handleAction('REJECT')}
          disabled={isLoading}
          className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 disabled:opacity-50"
        >
          ปฏิเสธ
        </button>
      </div>
    </div>
  );
}