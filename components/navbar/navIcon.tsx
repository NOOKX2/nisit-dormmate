"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavIconProps {
  href: string;
  children: React.ReactNode;
  notificationCount?: number; // 🟢 เปลี่ยนมารับตัวเลขแทน
}

export default function NavIcon({ href, children, notificationCount = 0 }: NavIconProps) {
  const pathname = usePathname();
  const isActive = pathname.startsWith(href);

  return (
    <Link 
      href={href} 
      className={`relative p-2.5 rounded-full transition-all active:scale-95 flex items-center justify-center ${
        isActive 
          ? "text-emerald-600 bg-emerald-50 shadow-inner" 
          : "text-gray-500 hover:text-emerald-600 hover:bg-emerald-50/50" 
      }`}
    >
      {children}
      
      {/* 🔴 ถ้ามีตัวเลขมากกว่า 0 ให้โชว์ป้าย Badge สีแดง */}
      {notificationCount > 0 && (
        <span className="absolute top-0 right-0 translate-x-[20%] -translate-y-[10%] bg-red-500 text-white text-[10px] font-bold px-1.5 min-w-4.5 h-4.5 rounded-full border-[1.5px] border-white flex items-center justify-center z-10 shadow-sm animate-in zoom-in">
          {notificationCount > 99 ? '99+' : notificationCount}
        </span>
      )}
    </Link>
  );
}