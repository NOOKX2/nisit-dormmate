import { MessageSquare } from "lucide-react";
import { RefObject } from "react";

interface ChatMessageListProps {
  messages: any[];
  currentUserId: string;
  contactName: string;
  scrollRef: RefObject<HTMLDivElement | null>;
}

export function ChatMessageList({ messages, currentUserId, contactName, scrollRef }: ChatMessageListProps) {
  return (
    <div 
      ref={scrollRef} 
      className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/50 scroll-smooth"
    >
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-2">
          <div className="p-4 bg-emerald-50 rounded-full">
            <MessageSquare className="text-emerald-300" size={32} />
          </div>
          <p className="text-sm">ทักทาย {contactName} ดูสิ!</p>
        </div>
      ) : (
        messages.map((msg) => {
          const isMe = msg.senderId === currentUserId;
          return (
            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div 
                className={`max-w-[80%] px-4 py-2 text-sm shadow-sm ${
                  isMe 
                    ? "bg-emerald-500 text-white rounded-2xl rounded-tr-sm" 
                    : "bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tl-sm"
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}