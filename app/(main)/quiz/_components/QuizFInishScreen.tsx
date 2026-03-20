"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface QuizFinishedScreenProps {
  onComplete: () => void;
  isLoading: boolean;
}

export function QuizFinishedScreen({ onComplete, isLoading }: QuizFinishedScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-10 rounded-[2.5rem] shadow-2xl text-center max-w-md w-full border border-emerald-100"
      >
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Sparkles className="text-emerald-600" size={40} />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-4">วิเคราะห์ข้อมูลเสร็จสิ้น!</h2>
        <p className="text-gray-500 mb-8">เรากำลังหาตารางเรียนและไลฟ์สไตล์ที่ตรงกับคุณมากที่สุด...</p>
        <button
          onClick={onComplete}
          disabled={isLoading}
          className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'กำลังบันทึก...' : 'ดูรูมเมทที่แนะนำ'}
        </button>
      </motion.div>
    </div>
  );
}