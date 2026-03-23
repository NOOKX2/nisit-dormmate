"use client";

import { BellRing, Inbox } from "lucide-react";
import { ReceivedCard } from "../../my-roommate/_components/ReceiveCard";

interface NotificationClientProps {
  receivedRequests: any[];
}

export function NotificationClient({ receivedRequests }: NotificationClientProps) {
  return (
    <div className="max-w-3xl mx-auto w-full p-4 md:p-6 pb-24">
      
      {/* 🌟 Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="relative">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0 shadow-sm border-2 border-emerald-50">
            <BellRing size={28} />
          </div>
          
          {/* 🔴 อัปเกรดตรงนี้: เปลี่ยนจากจุดแดง เป็นป้ายตัวเลข (Badge Count) */}
          {receivedRequests.length > 0 && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 min-w-6 h-6 rounded-full border-2 border-white flex items-center justify-center shadow-md animate-in zoom-in">
              {receivedRequests.length > 99 ? '99+' : receivedRequests.length}
            </div>
          )}
          
        </div>
        <div>
          <h1 className="text-3xl font-black text-gray-900 leading-none mb-1.5">การแจ้งเตือน</h1>
          <p className="text-sm text-gray-500 font-medium">คำชวนเป็นรูมเมทที่รอให้คุณตัดสินใจ</p>
        </div>
      </div>

      {/* 🌟 ส่วนแสดงเนื้อหา */}
      <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {receivedRequests.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Inbox size={40} className="text-gray-300" />
            </div>
            <h3 className="text-lg text-gray-700 font-bold mb-1">ไม่มีการแจ้งเตือนใหม่</h3>
            <p className="text-sm text-gray-500">ถ้ามีคนอยากเป็นเมทกับคุณ จะมาแสดงที่นี่นะ</p>
          </div>
        ) : (
          receivedRequests.map((req) => (
            <ReceivedCard 
              key={req.id} 
              requestId={req.id} 
              senderName={req.sender.firstName} 
              senderImage={req.sender.image} 
            />
          ))
        )}
        
      </div>
    </div>
  );
}