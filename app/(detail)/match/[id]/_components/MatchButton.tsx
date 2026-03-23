"use client";

import { useEffect, useState } from "react";
import { Handshake, Clock, UserCheck, CheckCircle2, Loader2 } from "lucide-react";
import { sendMatchRequest, UIMatchStatus } from "@/app/action/matching";

interface MatchButtonProps {
  currentUserId?: string;
  targetUserId: string;
  initialMatchStatus: UIMatchStatus;
  variant?: 'default' | 'chat'; // 🌟 1. เพิ่ม Prop ให้เลือกได้ว่าเป็นปุ่มใหญ่หรือปุ่มเล็กในแชท
}

export function MatchButton({ 
  currentUserId, 
  targetUserId, 
  initialMatchStatus,
  variant = 'default' // ค่าเริ่มต้นคือปุ่มใหญ่ปกติ
}: MatchButtonProps) {
  const [status, setStatus] = useState(initialMatchStatus);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setStatus(initialMatchStatus);
  }, [initialMatchStatus]);

  const handleAction = async () => {
    if (!currentUserId) {
      alert("กรุณาเข้าสู่ระบบก่อนครับ!");
      return;
    }

    setIsLoading(true);

    try {
      if (status === 'NONE' || status === 'RECEIVED') {
        // Optimistic UI: เปลี่ยนสีปุ่มไปล่วงหน้า
        const nextStatus = status === 'NONE' ? 'SENT' : 'MATCHED';
        setStatus(nextStatus); 
        
        // เรียก Server Action
        const result = await sendMatchRequest(currentUserId, targetUserId);
        
        if (result.success) {
          setStatus(result.status as UIMatchStatus); 
        } else {
          setStatus(initialMatchStatus);
          alert(result.error);
        }
      }
    } catch (error) {
      setStatus(initialMatchStatus);
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง");
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
          icon: <Handshake />,
          className: "bg-emerald-400 text-white hover:bg-emerald-500 shadow-sm hover:shadow-md",
          disabled: false
        };
      case 'SENT':
        return {
          text: "รอการยืนยัน...",
          icon: <Clock />,
          className: "bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-200",
          disabled: true
        };
      case 'RECEIVED':
        return {
          text: "กดยอมรับเป็นเมท",
          icon: <UserCheck />,
          className: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border border-emerald-300 shadow-sm",
          disabled: false
        };
      case 'MATCHED':
        return {
          text: "รูมเมทของคุณ",
          icon: <CheckCircle2 />,
          className: "bg-gradient-to-r from-emerald-400 to-green-500 text-white cursor-default shadow-md",
          disabled: true
        };
      default:
        return {
          text: "ชวนเป็นเมท",
          icon: <Handshake />,
          // 🟢 2. เปลี่ยนสี Default จาก #4CAF50 เป็น emerald ให้ตรงธีมทั้งโปรเจกต์
          className: "bg-emerald-400 text-white hover:bg-emerald-500",
          disabled: false
        };
    }
  };

  const config = getButtonConfig();

  // 🌟 3. กำหนดสไตล์แยกตาม variant
  const sizeClasses = variant === 'chat' 
    ? "px-4 py-2 rounded-full text-xs gap-1.5" // ไซส์มินิสำหรับ Header หน้า Chat
    : "flex-1 py-3.5 px-6 rounded-2xl text-[15px] gap-2.5 w-full"; // ไซส์ใหญ่สำหรับหน้า Profile/MatchList

  // ปรับขนาดไอคอนให้เข้ากับขนาดปุ่ม
  const iconSize = variant === 'chat' ? 14 : 18; 

  return (
    <button 
      onClick={handleAction}
      disabled={config.disabled || isLoading}
      className={`
        font-bold transition-all duration-200 flex items-center justify-center active:scale-[0.98]
        ${sizeClasses}
        ${config.className}
        ${isLoading ? 'opacity-70 cursor-wait' : ''}
      `}
    >
      {isLoading ? (
        <Loader2 size={iconSize} className="animate-spin" />
      ) : (
        // ดึง Icon มาวาดใหม่พร้อมยัดขนาด (iconSize) ลงไปแบบไดนามิก
        <config.icon.type {...config.icon.props} size={iconSize} /> 
      )}
      {/* ถ้าอยู่หน้า Chat และกำลังโหลด ให้ขึ้นข้อความสั้นๆ จะได้ไม่ล้นจอ */}
      <span>{isLoading ? (variant === 'chat' ? "รอ..." : "กำลังดำเนินการ...") : config.text}</span>
    </button>
  );
}