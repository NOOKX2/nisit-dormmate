"use client";

import { useState, useRef, useEffect } from "react";
import { Send, User, ChevronLeft, MessageSquareText } from "lucide-react";
import { UIMatchStatus } from "@/app/action/matching";
// 🟢 1. Import MatchButton ของจริงเข้ามา (ตรวจสอบ Path ให้ตรงกับโปรเจกต์ของท่านประธานนะครับ)
import { MatchButton } from "@/app/(detail)/match/[id]/_components/MatchButton";

interface Contact {
  id: string;
  name: string;
}

interface ChatAreaProps {
  currentUserId: string;
  activeContact: Contact | null;
  messages: any[];
  contactMatchStatus: UIMatchStatus; // 🟢 รับสถานะมาจากหน้าหลัก
  onClearContact: () => void;
  onSendMessage: (text: string) => Promise<void>;
}

export function ChatArea({ 
  currentUserId, 
  activeContact, 
  messages, 
  contactMatchStatus, // 🟢 2. ดึง Prop ออกมาใช้งาน
  onClearContact, 
  onSendMessage 
}: ChatAreaProps) {
  const [text, setText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // ❌ ลบ State matchStatus และ handleMatchRequest แบบเก่าทิ้งไปเลย เพราะ Component ลูกจัดการให้หมดแล้ว

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !activeContact) return;
    const tempText = text;
    setText("");
    await onSendMessage(tempText);
  };

  return (
    <div className={`${!activeContact ? 'hidden md:flex' : 'flex'} flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex-col`}>
      {!activeContact ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 space-y-4">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
            <MessageSquareText size={32} />
          </div>
          <p className="font-medium text-lg text-gray-500">เลือกรายชื่อเพื่อนเพื่อเริ่มพูดคุย</p>
        </div>
      ) : (
        <>
          {/* Header พร้อมปุ่ม Match */}
          <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-white shadow-sm z-10">
            <div className="flex items-center gap-4">
              <button onClick={onClearContact} className="md:hidden text-gray-400"><ChevronLeft size={24} /></button>
              <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center ring-2 ring-white">
                <User size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 leading-none">{activeContact.name}</h3>
                <p className="text-[10px] text-green-500 font-bold mt-1 tracking-wider uppercase">Online</p>
              </div>
            </div>

            {/* 🌟 3. ใช้ MatchButton ของจริง พร้อมตั้งโหมดเป็นหน้าแชท (variant="chat") */}
            <div className="shrink-0 ml-2">
              <MatchButton 
                currentUserId={currentUserId}
                targetUserId={activeContact.id}
                initialMatchStatus={contactMatchStatus}
                variant="chat"
              />
            </div>
          </div>

          {/* Chat Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#F8FAFC]">
            {messages.map((msg) => {
              const isMe = msg.senderId === currentUserId;
              return (
                <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start animate-fade-in"}`}>
                  <div className={`max-w-[75%] px-5 py-3 text-sm shadow-sm leading-relaxed ${
                    isMe ? "bg-emerald-600 text-white rounded-3xl rounded-tr-sm" 
                         : "bg-white border border-gray-100 text-gray-800 rounded-3xl rounded-tl-sm"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Message Input */}
          <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-50 flex gap-3 items-center">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={`พิมพ์ข้อความถึง ${activeContact.name}...`}
              className="flex-1 bg-gray-100 rounded-full px-6 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm transition-all"
            />
            <button type="submit" disabled={!text.trim()} className="p-4 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 disabled:opacity-30 transition-all shadow-md active:scale-95">
              <Send size={20} />
            </button>
          </form>
        </>
      )}
    </div>
  );
}