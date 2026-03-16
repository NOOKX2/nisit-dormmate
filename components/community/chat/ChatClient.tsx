"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Send, User, ChevronLeft, MessageSquareText } from "lucide-react";
import { getMessages, sendMessage } from "@/app/action/chat";

interface Contact {
  id: string;
  name: string;
}

export function ChatClient({ currentUserId, initialContacts }: { currentUserId: string, initialContacts: Contact[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // 🟢 1. เช็คว่ามีคนส่ง ID มาจากหน้า Community ไหม?
  useEffect(() => {
    const newUserId = searchParams.get("userId");
    const newUserName = searchParams.get("name");

    if (newUserId && newUserName) {
      const newContact = { id: newUserId, name: newUserName };
      setActiveContact(newContact);
      
      // ถ้าคนนี้ยังไม่มีในลิสต์ซ้ายมือ ให้เติมเข้าไปชั่วคราว
      if (!contacts.find(c => c.id === newUserId)) {
        setContacts([newContact, ...contacts]);
      }
    }
  }, [searchParams]);

  // 🟢 2. ระบบดึงแชท (Polling)
  const fetchChat = async () => {
    if (!currentUserId || !activeContact?.id) return;
    const data = await getMessages(currentUserId, activeContact.id);
    setMessages(data);
  };

  useEffect(() => {
    if (activeContact) {
      fetchChat();
      const interval = setInterval(fetchChat, 2000);
      return () => clearInterval(interval);
    }
  }, [activeContact]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  // 🟢 3. กดส่งข้อความ
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !activeContact) return;

    const tempText = text;
    setText(""); 
    await sendMessage(currentUserId, activeContact.id, tempText);
    fetchChat();
  };

  return (
    <div className="flex h-[calc(100vh-64px)] max-w-6xl mx-auto w-full p-4 gap-6">
      
      {/* ⬅️ ฝั่งซ้าย: รายชื่อคนคุย (Contact List) */}
      <div className={`${activeContact ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-80 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden shrink-0`}>
        <div className="p-6 border-b border-gray-50 flex items-center gap-2">
          <button onClick={() => router.back()} className="md:hidden text-gray-400 hover:text-gray-900"><ChevronLeft size={24} /></button>
          <h2 className="text-xl font-bold text-gray-900">แชทส่วนตัว</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {contacts.length === 0 ? (
            <p className="text-center text-gray-400 text-sm mt-10">ยังไม่มีประวัติการแชท</p>
          ) : (
            contacts.map(contact => (
              <button
                key={contact.id}
                onClick={() => setActiveContact(contact)}
                className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all text-left ${
                  activeContact?.id === contact.id ? 'bg-emerald-50 border border-emerald-100' : 'hover:bg-gray-50 border border-transparent'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${activeContact?.id === contact.id ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  <User size={20} />
                </div>
                <span className="font-bold text-gray-800 truncate">{contact.name}</span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* ➡️ ฝั่งขวา: พื้นที่แชท (Chat Area) */}
      <div className={`${!activeContact ? 'hidden md:flex' : 'flex'} flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex-col`}>
        {!activeContact ? (
          // หน้าจอว่างเปล่าตอนยังไม่เลือกคนคุย
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 space-y-4">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center"><MessageSquareText size={32} /></div>
            <p className="font-medium text-lg">เลือกรายชื่อเพื่อนเพื่อเริ่มพูดคุย</p>
          </div>
        ) : (
          // หน้าจอแชท
          <>
            {/* Header ของห้องแชท */}
            <div className="p-4 border-b border-gray-50 flex items-center gap-4 bg-white">
              <button onClick={() => setActiveContact(null)} className="md:hidden text-gray-400"><ChevronLeft size={24} /></button>
              <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                <User size={20} />
              </div>
              <h3 className="font-bold text-lg text-gray-900">{activeContact.name}</h3>
            </div>

            {/* พื้นที่ข้อความ */}
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

            {/* ช่องพิมพ์ข้อความ */}
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

    </div>
  );
}