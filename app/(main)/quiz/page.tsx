'use client'

import { useState } from 'react'

import { motion, AnimatePresence } from "framer-motion" 

import { 
  Sun, Moon, BookOpen, Users, Lock, Sparkles, 
  Trash2, Thermometer, AlarmSmokeIcon, Wine, ChevronRight, Clock 
} from 'lucide-react'

// ข้อมูลคำถาม
const questions = [
  {
    id: 'study_time',
    category: 'จังหวะชีวิตและการเรียน',
    question: 'ตารางเรียนในแต่ละวันของคุณเป็นอย่างไร?',
    options: [
      { label: 'นิสิตสายเช้า (8-9 โมงเกือบทุกวัน)', value: 'morning', icon: <Sun className="text-amber-500" /> },
      { label: 'นิสิตสายบ่าย (ตื่นสายได้บ่อย)', value: 'afternoon', icon: <Clock className="text-blue-500" /> },
      { label: 'ตารางไม่แน่นอน (สลับไปมา)', value: 'flexible', icon: <Sun className="text-green-500" /> }
    ]
  },
  {
    id: 'location',
    category: 'พื้นที่ทำงาน',
    question: 'พื้นที่หลักในการอ่านหนังสือของคุณคือที่ไหน?',
    options: [
      { label: 'ในห้องนอน (ต้องการความเงียบ)', value: 'room', icon: <Lock className="text-purple-500" /> },
      { label: 'นอกห้อง (ห้องสมุด/คาเฟ่)', value: 'outside', icon: <BookOpen className="text-emerald-500" /> }
    ]
  },
  {
    id: 'guest_policy',
    category: 'ความเป็นส่วนตัว',
    question: 'คุณโอเคไหมหากรูมเมทจะพาเพื่อนมาที่ห้อง?',
    options: [
      { label: 'ได้ตลอดเวลา (สายสังคม)', value: 'open', icon: <Users className="text-pink-500" /> },
      { label: 'ได้บางครั้ง (ต้องบอกล่วงหน้า)', value: 'limit', icon: <Clock className="text-orange-500" /> },
      { label: 'ไม่สะดวกใจ (เน้นความเป็นส่วนตัว)', value: 'private', icon: <Lock className="text-red-500" /> }
    ]
  },
  {
    id: 'cleanliness',
    category: 'ความสะอาด',
    question: 'ระดับความเนี้ยบในการจัดของบนโต๊ะและเตียง?',
    options: [
      { label: 'ระเบียบจัด (ห้ามรก)', value: 'neat', icon: <Sparkles className="text-blue-400" /> },
      { label: 'รกบ้าง (สะดวกแบบนี้)', value: 'messy', icon: <Trash2 className="text-gray-400" /> }
    ]
  },
  {
    id: 'air_con',
    category: 'สภาพแวดล้อม',
    question: 'สไตล์การเปิดแอร์และค่าไฟที่คุณต้องการ?',
    options: [
      { label: 'สายขี้หนาว/ประหยัด (26°C+)', value: 'save', icon: <Thermometer className="text-green-500" /> },
      { label: 'สายขี้ร้อน/เน้นฉ่ำ (23-24°C)', value: 'cool', icon: <Thermometer className="text-blue-600" /> }
    ]
  },
  {
    id: 'smoking',
    category: 'Deal Breaker',
    question: 'คุณสูบบุหรี่ (หรือบุหรี่ไฟฟ้า) หรือไม่?',
    options: [
      { label: 'สูบ', value: 'yes', icon: <AlarmSmokeIcon className="text-red-500" /> },
      { label: 'ไม่สูบ', value: 'no', icon: <Sparkles className="text-emerald-500" /> }
    ]
  }
]

export default function QuizPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isFinished, setIsFinished] = useState(false)

  const progress = ((currentStep + 1) / questions.length) * 100

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [questions[currentStep].id]: value }
    setAnswers(newAnswers)

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsFinished(true)
      console.log('Final Answers:', newAnswers)
      // TODO: ส่งไปเก็บใน Database หรือคำนวณ Match
    }
  }

  if (isFinished) {
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
            onClick={() => window.location.href = '/profile'}
            className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all"
          >
            ดูรูมเมทที่แนะนำ
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-6">
      <div className="max-w-xl mx-auto">
        {/* Header & Progress Bar */}
        <div className="mb-10">
          <div className="flex justify-between items-end mb-4">
            <div>
              <span className="text-emerald-600 font-bold tracking-widest uppercase text-xs">
                {questions[currentStep].category}
              </span>
              <h3 className="text-gray-400 text-sm font-medium">คำถามที่ {currentStep + 1} จาก {questions.length}</h3>
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

        {/* Question Area */}
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
              {questions[currentStep].question}
            </h2>

            <div className="space-y-4">
              {questions[currentStep].options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
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

        {/* Footer info */}
        <p className="text-center text-gray-400 text-xs mt-8">
          ข้อมูลของคุณจะถูกนำไปใช้เพื่อหาคู่รูมเมทที่เหมาะสมที่สุดเท่านั้น
        </p>
      </div>
    </div>
  )
}