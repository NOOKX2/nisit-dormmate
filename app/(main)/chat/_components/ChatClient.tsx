"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getMessages, sendMessage } from "@/app/action/chat";
import { checkMatchStatus, UIMatchStatus } from "@/app/action/matching"; 
import { ChatArea } from "./ChatArea";
import { ContactList } from "./ContactList";

// 🌟 1. Import ตัวดักฟังของ Pusher เข้ามา
import { pusherClient } from "@/lib/pusher"; 

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
  const [contactMatchStatus, setContactMatchStatus] = useState<UIMatchStatus>('NONE');

  // รับค่าจาก URL
  useEffect(() => {
    const newUserId = searchParams.get("userId");
    const newUserName = searchParams.get("name");

    if (newUserId && newUserName) {
      const newContact = { id: newUserId, name: newUserName };
      setActiveContact(newContact);
      setContacts(prev => {
        const exists = prev.find(c => c.id === newUserId);
        if (exists) return prev;
        return [newContact, ...prev.filter(c => c.id !== newUserId)];
      });
    }
  }, [searchParams]);

  // ดึงข้อความแชท (โหลดแค่ครั้งเดียวตอนเปิดห้องแชท)
  const fetchChat = async () => {
    if (!currentUserId || !activeContact?.id) return;
    const data = await getMessages(currentUserId, activeContact.id);
    setMessages(data);
  };

  // ดึงสถานะการ Match
  const fetchMatchStatus = async () => {
    if (!currentUserId || !activeContact?.id) return;
    try {
      const status = await checkMatchStatus(currentUserId, activeContact.id);
      setContactMatchStatus(status);
    } catch (error) {
      console.error("Failed to fetch match status:", error);
      setContactMatchStatus('NONE');
    }
  };

  // 🌟 2. อัปเกรด useEffect ให้ใช้ Pusher แทน setInterval
  useEffect(() => {
    if (activeContact) {
      fetchChat();
      fetchMatchStatus(); 

      // --- เริ่มการทำงานของ Pusher ---
      // 1. สร้างชื่อห้อง (ให้ตรงกับฝั่ง Server)
      const roomId = [currentUserId, activeContact.id].sort().join('-');
      
      // 2. หมุนคลื่นไปรอฟังที่ห้องนั้น
      pusherClient.subscribe(roomId);

      // 3. ฟังก์ชันจัดการข้อความใหม่ที่เด้งเข้ามา
      const messageHandler = (newMessage: any) => {
        setMessages((prevMessages) => {
          // เช็กว่าข้อความซ้ำไหม (ป้องกันเวลาเราส่งเองแล้วมันเบิ้ล)
          const isDuplicate = prevMessages.some((msg) => msg.id === newMessage.id);
          if (isDuplicate) return prevMessages;
          
          return [...prevMessages, newMessage];
        });
      };

      // 4. ผูกหูฟังเข้ากับเหตุการณ์
      pusherClient.bind('incoming-message', messageHandler);

      // 5. ถอดหูฟังออกเวลาเปลี่ยนคนคุย (Cleanup)
      return () => {
        pusherClient.unsubscribe(roomId);
        pusherClient.unbind('incoming-message', messageHandler);
      };
      // --- จบการทำงานของ Pusher ---
    }
  }, [activeContact, currentUserId]); 

  const handleSendMessage = async (text: string) => {
    if (!activeContact) return;
    // 🌟 3. ยิงข้อความขึ้น Server (เดี๋ยว Server จะตะโกนบอก Pusher เอง)
    await sendMessage(currentUserId, activeContact.id, text);
    
  };


  return (
    <div className="flex h-[calc(100vh-64px)] max-w-6xl mx-auto w-full p-4 gap-6 bg-[#F9FAFB]">
      <ContactList 
        contacts={contacts} 
        activeContact={activeContact} 
        onSelectContact={setActiveContact} 
        onBack={() => router.back()} 
      />
      
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