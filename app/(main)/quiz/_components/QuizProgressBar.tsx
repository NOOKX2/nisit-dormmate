"use client";

import { motion } from "framer-motion";

interface QuizProgressBarProps {
  currentStep: number;
  totalSteps: number;
  category: string;
}

export function QuizProgressBar({ currentStep, totalSteps, category }: QuizProgressBarProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="mb-10">
      <div className="flex justify-between items-end mb-4">
        <div>
          <span className="text-emerald-600 font-bold tracking-widest uppercase text-xs">
            {category}
          </span>
          <h3 className="text-gray-400 text-sm font-medium">
            คำถามที่ {currentStep + 1} จาก {totalSteps}
          </h3>
        </div>
        <span className="text-gray-900 font-black text-xl">{Math.round(progress)}%</span>
      </div>
      <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-emerald-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
}