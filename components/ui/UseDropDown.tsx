"use client";

import { useState } from 'react';
import { User, LogOut, ChevronDown, Settings } from 'lucide-react';

// นิยาม Type สำหรับ Props
interface UserDropdownProps {
  name: string;
  // รับ logoutAction เป็น function ที่รองรับการทำงานแบบ Server Action
  onClick: () => Promise<void> | void; 
}

export default function UserDropdown({ name, onClick }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* ปุ่มกดเปิด Dropdown */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-full border border-gray-100 transition-all"
      >
        <div className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center">
          <User size={18} />
        </div>
        <span className="text-sm font-semibold text-gray-700">{name}</span>
        <ChevronDown size={14} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* เมนู Dropdown */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
          
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-20 animate-in fade-in zoom-in duration-200">
            <div className="px-4 py-2 border-b border-gray-50 mb-1">
              <p className="text-xs text-gray-400">จัดการบัญชี</p>
            </div>
            
            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              <Settings size={16} />
              ตั้งค่าโปรไฟล์
            </button>

            {/* ใช้ logoutAction ที่รับมาจาก props */}
            <form action={onClick}>
              <button 
                type="submit"
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={16} />
                ออกจากระบบ
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}