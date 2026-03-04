"use client";

import { useState } from 'react';
import { User, LogOut, ChevronDown, Settings, Home, ShieldCheck } from 'lucide-react';
import { DropdownItem } from './DropDownItem';


interface UserDropdownProps {
  name: string;
  onClick: () => Promise<void> | void;
}

export default function UserDropdown({ name, onClick }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const closeDropdown = () => setIsOpen(false);

  return (
    <div className="relative">
      {/* ปุ่ม Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3.5 py-2 bg-white hover:bg-gray-50 rounded-full border border-gray-100 shadow-sm transition-all active:scale-95"
      >
        <div className="w-7 h-7 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-inner">
          <User size={16} strokeWidth={2.5} />
        </div>
        <span className="text-sm font-bold text-gray-700">{name}</span>
        <ChevronDown size={14} className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* เมนู Dropdown */}
      {isOpen && (
        <>
          {/* Overlay สำหรับคลิกข้างนอกเพื่อปิด */}
          <div className="fixed inset-0 z-10" onClick={closeDropdown}></div>

          <div className="absolute right-0 mt-3 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 py-1.5 z-20 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
            <div className="px-4 py-2 mb-1 border-b border-gray-50">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">จัดการบัญชี</p>
            </div>

            {/* ใช้ Component ย่อยที่สร้างไว้ */}
            <DropdownItem 
              href="/profile" 
              icon={Settings} 
              label="โปรไฟล์ของฉัน" 
              onClick={closeDropdown} 
            />

            <DropdownItem 
              href="/booking" 
              icon={Home} 
              label="หอพักที่จองไว้" 
              onClick={closeDropdown} 
            />

            <div className="my-1 border-t border-gray-50" />

            {/* ส่วน Logout (Server Action) */}
            <form action={onClick}>
              <button
                type="submit"
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-all font-bold"
              >
                <LogOut size={16} strokeWidth={2.5} />
                ออกจากระบบ
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}