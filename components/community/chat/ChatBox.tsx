"use client";

import { useState, useEffect, useRef } from "react";
import { Send, User } from "lucide-react";
import { getMessages, sendMessage } from "@/app/action/chat";

interface ChatBoxProps {
  currentUserId: string;
  contactUserId: string;
  contactName: string;
}

export function ChatBox({ currentUserId, contactUserId, contactName }: ChatBoxProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // 🔄 ฟังก์ชันดึงแชท
  const fetchChat = async () => {
    const data = await getMessages(currentUserId, contactUserId);
    setMessages(data);
  };

  // 🪄 ท่า Hackathon: สั่งดึงแชทใหม่ทุกๆ 2 วินาที
  useEffect(() => {
    fetchChat(); // โหลดครั้งแรกปุ๊บ
    const interval = setInterval(fetchChat, 2000); // วนลูปโหลดทุก 2 วิ
    return () => clearInterval(interval); // ล้างทิ้งตอนปิดแชท
  }, [currentUserId, contactUserId]);

  // เลื่อนลงล่างสุดอัตโนมัติเวลามีข้อความใหม่
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // 🚀 กดส่งข้อความ
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    const tempText = text;
    setText(""); // ล้างช่องพิมพ์ทันทีให้ดูลื่นไหล

    await sendMessage(currentUserId, contactUserId, tempText);
    fetchChat(); // ดึงข้อความใหม่มาโชว์ทันที
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      {/* 🟢 Header แชท */}
      <div className="bg-emerald-600 p-4 text-white flex items-center gap-3">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
          <User size={20} />
        </div>
        <div>
          <h3 className="font-bold">{contactName}</h3>
          <p className="text-xs text-emerald-100 animate-pulse">ออนไลน์</p>
        </div>
      </div>

      {/* 💬 พื้นที่ข้อความ */}
      <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50 h-100">
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUserId;
          return (
            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] px-4 py-2 text-sm shadow-sm ${
                isMe ? "bg-emerald-500 text-white rounded-2xl rounded-tr-sm" 
                     : "bg-white border text-gray-800 rounded-2xl rounded-tl-sm"
              }`}>
                {msg.text}
              </div>
            </div>
          );
        })}
      </div>

      {/* ⌨️ ช่องพิมพ์ */}
      <form onSubmit={handleSend} className="p-4 bg-white border-t flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="พิมพ์ข้อความ..."
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <button type="submit" disabled={!text.trim()} className="p-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 disabled:opacity-50">
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}