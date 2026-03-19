"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getMessages, sendMessage } from "@/app/action/chat";
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

  // 1. รับค่าจาก URL (เวลาทักมาจากหน้า Profile)
  useEffect(() => {
    const newUserId = searchParams.get("userId");
    const newUserName = searchParams.get("name");

    if (newUserId && newUserName) {
      const newContact = { id: newUserId, name: newUserName };
      setActiveContact(newContact);
      setContacts(prev => [newContact, ...prev.filter(c => c.id !== newUserId)]);
    }
  }, [searchParams]);

  // 2. ดึงข้อความแชท (Polling ทุก 2 วินาที)
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