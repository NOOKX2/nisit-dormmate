"use client";

import { useState } from "react";

interface SentCardProps {
  requestId: string;
  receiverName: string;
  receiverImage: string | null;
}

export function SentCard({ requestId, receiverName, receiverImage }: SentCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  // 🚀 เตรียมไว้ใส่ฟังก์ชัน กดยกเลิก
  const handleCancel = async () => {
    setIsLoading(true);
    console.log("Cancel request:", requestId);
    setIsLoading(false);
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 flex justify-between items-center opacity-70">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-gray-200 rounded-full shrink-0">
          <img src={receiverImage || "/default-avatar.png"} alt="avatar" className="rounded-full w-full h-full object-cover" />
        </div>
        <div>
          <h3 className="font-bold text-gray-700">{receiverName}</h3>
          <p className="text-xs text-gray-500">รอการยืนยัน...</p>
        </div>
      </div>
      <button 
        onClick={handleCancel}
        disabled={isLoading}
        className="text-xs text-gray-400 underline hover:text-red-500 disabled:opacity-50"
      >
        {isLoading ? "กำลังยกเลิก..." : "ยกเลิกคำชวน"}
      </button>
    </div>
  );
}