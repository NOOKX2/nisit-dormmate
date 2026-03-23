"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getMessages, sendMessage } from "@/app/action/chat";
// 🟢 1. Import Server Action และ Type ของ Match Status เข้ามา
import { checkMatchStatus, UIMatchStatus } from "@/app/action/matching"; 
import { ChatArea } from "./ChatArea";
import { ContactList } from "./ContactList";

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
  
  // 🌟 2. สร้าง State สำหรับเก็บสถานะ Match ของคนที่กำลังคุยอยู่
  const [contactMatchStatus, setContactMatchStatus] = useState<UIMatchStatus>('NONE');

  // 1. รับค่าจาก URL (เวลาทักมาจากหน้า Profile)
  useEffect(() => {
    const newUserId = searchParams.get("userId");
    const newUserName = searchParams.get("name");

    if (newUserId && newUserName) {
      const newContact = { id: newUserId, name: newUserName };
      setActiveContact(newContact);
      setContacts(prev => {
        // ป้องกันการแอดซ้ำถ้ามีอยู่แล้ว
        const exists = prev.find(c => c.id === newUserId);
        if (exists) return prev;
        return [newContact, ...prev.filter(c => c.id !== newUserId)];
      });
    }
  }, [searchParams]);

  // 2. ดึงข้อความแชท (Polling ทุก 2 วินาที)
  const fetchChat = async () => {
    if (!currentUserId || !activeContact?.id) return;
    const data = await getMessages(currentUserId, activeContact.id);
    setMessages(data);
  };

  // 🌟 3. ดึงสถานะการ Match (ยิง Action เมื่อเปลี่ยนคนคุย)
  const fetchMatchStatus = async () => {
    if (!currentUserId || !activeContact?.id) return;
    try {
      const status = await checkMatchStatus(currentUserId, activeContact.id);
      setContactMatchStatus(status);

    } catch (error) {
      console.error("Failed to fetch match status:", error);
      setContactMatchStatus('NONE'); // ถ้าพังให้ fallback กลับเป็นค่าเริ่มต้น
    }
  };

  useEffect(() => {
    if (activeContact) {
      fetchChat();
      fetchMatchStatus(); // 🟢 เรียกใช้เมื่อกดเปลี่ยนคนคุย

      const interval = setInterval(fetchChat, 2000);
      return () => clearInterval(interval);
    }
  }, [activeContact]);

  const handleSendMessage = async (text: string) => {
    if (!activeContact) return;
    await sendMessage(currentUserId, activeContact.id, text);
    fetchChat();
  };


  return (
    <div className="flex h-[calc(100vh-64px)] max-w-6xl mx-auto w-full p-4 gap-6 bg-[#F9FAFB]">
      <ContactList 
        contacts={contacts} 
        activeContact={activeContact} 
        onSelectContact={setActiveContact} 
        onBack={() => router.back()} 
      />
      
      {/* 🌟 4. โยนสถานะที่เพิ่งดึงมาได้ ลงไปให้ ChatArea */}
      <ChatArea 
        currentUserId={currentUserId} 
        activeContact={activeContact} 
        messages={messages} 
        contactMatchStatus={contactMatchStatus} 
        onClearContact={() => setActiveContact(null)} 
        onSendMessage={handleSendMessage} 
      />
    </div>
  );
}