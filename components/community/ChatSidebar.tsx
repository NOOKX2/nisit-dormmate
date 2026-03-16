"use client";

import { MessageSquare } from "lucide-react";
import { ChatBox } from "@/components/community/chat/ChatBox";

interface ChatSidebarProps {
  activeChatUser: { id: string; name: string } | null;
  currentUserId: string;
}

export function ChatSidebar({ activeChatUser, currentUserId }: ChatSidebarProps) {
  return (
    <div className="hidden lg:block w-87.5">
      <div className="sticky top-8">
        {activeChatUser ? (
          <ChatBox 
            currentUserId={currentUserId} 
            contactUserId={activeChatUser.id} 
            contactName={activeChatUser.name} 
          />
        ) : (
          <div className="h-125 bg-gray-100/50 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 p-6 text-center">
            <MessageSquare size={48} className="mb-4 opacity-50" />
            <p className="font-bold">คลิก "ทักแชทส่วนตัว" ที่โพสต์</p>
            <p className="text-sm mt-2">เพื่อเริ่มพูดคุยกับเพื่อนนิสิต หรือสอบถามข้อมูลห้องพักได้ทันที</p>
          </div>
        )}
      </div>
    </div>
  );
}