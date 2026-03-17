import { useState, useRef, useEffect } from "react";
import { Send, User, ChevronLeft, MessageSquareText } from "lucide-react";

interface Contact {
  id: string;
  name: string;
}

interface ChatAreaProps {
  currentUserId: string;
  activeContact: Contact | null;
  messages: any[];
  onClearContact: () => void;
  onSendMessage: (text: string) => Promise<void>;
}

export function ChatArea({ currentUserId, activeContact, messages, onClearContact, onSendMessage }: ChatAreaProps) {
  const [text, setText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // เลื่อนลงล่างสุดอัตโนมัติ
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !activeContact) return;

    const tempText = text;
    setText(""); // เคลียร์ช่องพิมพ์ทันทีให้ User รู้สึกไว
    await onSendMessage(tempText);
  };

  return (
    <div className={`${!activeContact ? 'hidden md:flex' : 'flex'} flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex-col`}>
      {!activeContact ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 space-y-4">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center"><MessageSquareText size={32} /></div>
          <p className="font-medium text-lg">เลือกรายชื่อเพื่อนเพื่อเริ่มพูดคุย</p>
        </div>
      ) : (
        <>
          <div className="p-4 border-b border-gray-50 flex items-center gap-4 bg-white">
            <button onClick={onClearContact} className="md:hidden text-gray-400"><ChevronLeft size={24} /></button>
            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
              <User size={20} />
            </div>
            <h3 className="font-bold text-lg text-gray-900">{activeContact.name}</h3>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#F8FAFC]">
            {messages.map((msg) => {
              const isMe = msg.senderId === currentUserId;
              return (
                <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[70%] px-5 py-3 text-sm shadow-sm ${
                    isMe ? "bg-emerald-600 text-white rounded-3xl rounded-tr-sm" 
                         : "bg-white border border-gray-100 text-gray-800 rounded-3xl rounded-tl-sm"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              );
            })}
          </div>

          <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-50 flex gap-3 items-center">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={`ส่งข้อความถึง ${activeContact.name}...`}
              className="flex-1 bg-gray-100 rounded-full px-6 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm"
            />
            <button type="submit" disabled={!text.trim()} className="p-4 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-md hover:shadow-lg">
              <Send size={20} className={text.trim() ? "translate-x-0.5 -translate-y-0.5" : ""} />
            </button>
          </form>
        </>
      )}
    </div>
  );
}