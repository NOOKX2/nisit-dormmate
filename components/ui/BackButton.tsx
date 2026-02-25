"use client";

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export function BackButton() {
  const router = useRouter();

  return (
    <button 
      onClick={() => router.back()}
      className="flex items-center justify-center p-2.5 bg-white text-gray-700 rounded-full shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"
      aria-label="ย้อนกลับ"
    >
      <ArrowLeft size={20} />
    </button>
  );
}