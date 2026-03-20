'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { completeQuiz } from '@/app/action/profile'
import { questions } from '@/lib/quiz-data'

import { QuizProgressBar } from '@/app/(main)/quiz/_components/QuizProgressBar'
import { QuestionCard } from '@/app/(main)/quiz/_components/QuestionCard'
import { QuizFinishedScreen } from './QuizFInishScreen'

export function QuizClient({ user }: { user: any }) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isFinished, setIsFinished] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleAnswer = (value: string) => {
    // 1. เก็บคำตอบ
    const newAnswers = { ...answers, [questions[currentStep].id]: value }
    setAnswers(newAnswers)

    // 2. เช็คว่าไปข้อต่อไป หรือ จบแล้ว
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsFinished(true)
    }
  }

  const handleCompleteQuiz = async () => {
    if (!user?.id) return

    setIsLoading(true)
    try {
      await completeQuiz(user.id, answers)
      router.refresh()
      router.push('/match')
    } catch (error) {
      console.error('Error completing quiz:', error)
      setIsLoading(false)
    }
  }

  // 🟢 ถ้าทำเสร็จแล้ว โชว์หน้า Finished
  if (isFinished) {
    return <QuizFinishedScreen onComplete={handleCompleteQuiz} isLoading={isLoading} />
  }

  // 🟢 หน้าทำแบบทดสอบ (โคตรคลีน!)
  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-6">
      <div className="max-w-xl mx-auto">

        <QuizProgressBar
          currentStep={currentStep}
          totalSteps={questions.length}
          category={questions[currentStep].category}
        />

        <QuestionCard
          question={questions[currentStep]}
          currentStep={currentStep}
          onAnswer={handleAnswer}
        />

        <p className="text-center text-gray-400 text-xs mt-8">
          ข้อมูลของคุณจะถูกนำไปใช้เพื่อหาคู่รูมเมทที่เหมาะสมที่สุดเท่านั้น
        </p>

      </div>
    </div>
  )
}