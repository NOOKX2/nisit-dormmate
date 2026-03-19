"use client";

import { useState } from "react";
import { Handshake, Clock, UserCheck, CheckCircle2, Loader2 } from "lucide-react";
import { MatchStatus } from "@prisma/client";
import { UIMatchStatus } from "@/app/action/matching";
// 🟢 อย่าลืม import Server Actions ของท่านประธานมาใช้นะครับ (แก้ path ให้ตรงกับโปรเจกต์)
// import { sendMatchRequest, acceptMatchRequest } from "@/app/action/matching"; 

interface MatchButtonProps {
  currentUserId?: string;
  targetUserId: string;
  initialMatchStatus: UIMatchStatus;
}

export function MatchButton({ currentUserId, targetUserId, initialMatchStatus }: MatchButtonProps) {
  const [status, setStatus] = useState(initialMatchStatus);
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async () => {
    // ดักไว้ก่อน ถ้าเป็น Guest ให้เด้งเตือน (หรือจะเปลี่ยนเป็น router.push('/login') ก็ได้ครับ)
    if (!currentUserId) {
      alert("กรุณาเข้าสู่ระบบก่อนส่งคำชวนครับ!");
      return;
    }

    setIsLoading(true);

    try {
      if (status === 'NONE') {
        // 1. จำลองการเปลี่ยน UI ทันทีให้ผู้ใช้รู้สึกว่าเว็บเร็ว (Optimistic UI)
        setStatus('SENT'); 
        
        // 2. เรียก Server Action ไปบันทึกลง Database
        // await sendMatchRequest(currentUserId, targetUserId);
        
      } else if (status === 'RECEIVED') {
        setStatus('MATCHED');
        // await acceptMatchRequest(currentUserId, targetUserId);
      }
    } catch (error) {
      // ถ้า API พัง ให้ดึงสถานะกลับมาเหมือนเดิม
      setStatus(initialMatchStatus);
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsLoading(false);
    }
  };

  // 🎨 ฟังก์ชันช่วยเลือกสีปุ่มและไอคอนตามสถานะ
  const getButtonConfig = () => {
    switch (status) {
      case 'NONE':
        return {
          text: "ชวนเป็นเมท",
          icon: <Handshake size={18} />,
          className: "bg-[#4CAF50] text-white hover:bg-[#43a047] shadow-sm hover:shadow-md",
          disabled: false
        };
      case 'SENT':
        return {
          text: "รอการยืนยัน...",
          icon: <Clock size={18} />,
          className: "bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-200",
          disabled: true
        };
      case 'RECEIVED':
        return {
          text: "กดยอมรับเป็นเมท",
          icon: <UserCheck size={18} />,
          className: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border border-emerald-300 shadow-sm",
          disabled: false
        };
      case 'MATCHED':
        return {
          text: "รูมเมทของคุณ",
          icon: <CheckCircle2 size={18} />,
          className: "bg-gradient-to-r from-emerald-400 to-green-500 text-white cursor-default shadow-md",
          disabled: true
        };
      default:
        return {
          text: "ชวนเป็นเมท",
          icon: <Handshake size={18} />,
          className: "bg-[#4CAF50] text-white hover:bg-[#43a047]",
          disabled: false
        };
    }
  };

  const config = getButtonConfig();

  return (
    <button 
      onClick={handleAction}
      disabled={config.disabled || isLoading}
      className={`
        flex-1 py-3.5 px-6 rounded-2xl text-[15px] font-bold transition-all duration-200 
        flex items-center justify-center gap-2.5 active:scale-[0.98] w-full
        ${config.className}
        ${isLoading ? 'opacity-70 cursor-wait' : ''}
      `}
    >
      {isLoading ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        config.icon
      )}
      <span>{isLoading ? "กำลังดำเนินการ..." : config.text}</span>
    </button>
  );
}