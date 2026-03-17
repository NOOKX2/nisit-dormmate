"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getMessages, sendMessage } from "@/app/action/chat";

// Import Component ย่อย (เปลี่ยน Path ตามที่ท่านประธานเก็บไฟล์ไว้ครับ)
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

  // 1. รับค่าจาก URL
  useEffect(() => {
    const newUserId = searchParams.get("userId");
    const newUserName = searchParams.get("name");

    if (newUserId && newUserName) {
      const newContact = { id: newUserId, name: newUserName };
      setActiveContact(newContact);
      
      setContacts(prev => {
        const filtered = prev.filter(c => c.id !== newUserId);
        return [newContact, ...filtered];
      });
    }
  }, [searchParams]);

  // 2. ดึงแชท
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

  // 3. ฟังก์ชันส่งข้อความ (+ ดันชื่อขึ้นบนสุด)
  const handleSendMessage = async (text: string) => {
    if (!activeContact) return;

    setContacts(prev => {
      const filtered = prev.filter(c => c.id !== activeContact.id);
      return [activeContact, ...filtered];
    });

    await sendMessage(currentUserId, activeContact.id, text);
    fetchChat();
  };

  return (
    <div className="flex h-[calc(100vh-64px)] max-w-6xl mx-auto w-full p-4 gap-6">
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
        onClearContact={() => setActiveContact(null)} 
        onSendMessage={handleSendMessage} 
      />
    </div>
  );
}