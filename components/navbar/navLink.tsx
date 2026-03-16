"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavLink({ href, children }: { href: string, children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link 
      href={href} 
      className={`relative py-2 transition-all duration-300 ${
        isActive 
          ? "text-emerald-600 font-bold" 
          : "text-gray-600 hover:text-emerald-600"
      }`}
    >
      {children}
      {/* 🟢 เส้นใต้ที่จะปรากฏเฉพาะตอน Active */}
      {isActive && (
        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
      )}
    </Link>
  );
}