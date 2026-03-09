"use client";

import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { FeedbackModal } from "./FeedBackModal";

// รับข้อมูล user มาจาก Footer (ที่เป็น Server Component)
export function FeedbackWidget({ user }: { user: any }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-1.5 text-emerald-600 font-bold hover:text-emerald-700 hover:underline transition-all"
      >
        <MessageSquare size={16} />
        แจ้งปัญหาการใช้งาน
      </button>

      {/* ส่ง user ต่อให้ Modal */}
      <FeedbackModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        user={user} 
      />
    </>
  );
}