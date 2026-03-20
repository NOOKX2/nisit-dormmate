"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { QuizQuestion } from "@/lib/quiz-data";

interface QuestionCardProps {
  question: QuizQuestion;
  currentStep: number;
  onAnswer: (value: string) => void;
}

export function QuestionCard({ question, currentStep, onAnswer }: QuestionCardProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentStep}
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -20, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-gray-100"
      >
        <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-8 leading-tight">
          {question.question}
        </h2>

        <div className="space-y-4">
          {question.options.map((option) => (
            <button
              key={option.value}
              onClick={() => onAnswer(option.value)}
              className="w-full group flex items-center justify-between p-6 bg-gray-50 rounded-2xl border-2 border-transparent hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  {option.icon}
                </div>
                <span className="font-bold text-gray-700 text-left">{option.label}</span>
              </div>
              <ChevronRight className="text-gray-300 group-hover:text-emerald-500 transition-colors" size={20} />
            </button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}