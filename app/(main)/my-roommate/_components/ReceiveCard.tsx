"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

interface ReceivedCardProps {
  requestId: string;
  senderName: string;
  senderImage: string | null;
}

export function ReceivedCard({ requestId, senderName, senderImage }: ReceivedCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  // 🚀 เตรียมไว้ใส่ฟังก์ชัน กดยอมรับ/ปฏิเสธ
  const handleAction = async (action: 'ACCEPT' | 'REJECT') => {
    setIsLoading(true);
    console.log(`${action} request:`, requestId);
    // await respondToMatchRequest(requestId, action);
    setIsLoading(false);
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden shrink-0">
          <img src={senderImage || "/default-avatar.png"} alt="avatar" className="w-full h-full object-cover" />
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