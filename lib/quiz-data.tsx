import { Sun, BookOpen, Users, Lock, Sparkles, Trash2, Thermometer, AlarmSmokeIcon, Clock } from 'lucide-react'

export interface QuizOption {
  label: string;
  value: string;
  icon: React.ReactNode;
}

export interface QuizQuestion {
  id: string;
  category: string;
  question: string;
  options: QuizOption[];
}

export const questions: QuizQuestion[] = [
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
];