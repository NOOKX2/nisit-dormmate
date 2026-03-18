import { 
  Sparkles, 
  Ban, 
  Clock, 
  BookOpen, 
  Users, 
  Wind 
} from 'lucide-react';

export const lifestyleConfigs = [
  { 
    key: 'cleanliness', 
    label: 'ความสะอาด', 
    icon: Sparkles, // ✨ สื่อถึงความสะอาด วิบวับ
    mapping: { neat: 'ระเบียบจัด', messy: 'รกบ้าง' },
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-50'
  },
  { 
    key: 'smoking', 
    label: 'สูบบุหรี่', 
    icon: Ban, // 🚫 สื่อถึงการห้าม หรือสถานะบุหรี่
    isBoolean: true,
    color: 'text-red-500',
    bgColor: 'bg-red-50'
  },
  { 
    key: 'study_time', 
    label: 'เวลาเรียน', 
    icon: Clock, // 🕒 สื่อถึงเวลา
    mapping: { morning: 'สายเช้า', afternoon: 'สายบ่าย', flexible: 'ยืดหยุ่น' },
    color: 'text-blue-500',
    bgColor: 'bg-blue-50'
  },
  { 
    key: 'location', 
    label: 'สถานที่อ่านหนังสือ', 
    icon: BookOpen, // 📖 สื่อถึงการอ่านหนังสือ
    mapping: { room: 'อ่านในห้อง', outside: 'อ่านข้างนอก' },
    color: 'text-amber-500',
    bgColor: 'bg-amber-50'
  },
  { 
    key: 'guest_policy', 
    label: 'การพาเพื่อนมาห้อง', 
    icon: Users, // 👥 สื่อถึงกลุ่มเพื่อน
    mapping: { open: 'พาเพื่อนมาได้ตลอด', limit: 'พามาได้บางครั้ง', private: 'พื้นที่ส่วนตัว' },
    color: 'text-purple-500',
    bgColor: 'bg-purple-50'
  },
  { 
    key: 'air_con', 
    label: 'สไตล์การเปิดแอร์', 
    icon: Wind, // 💨 สื่อถึงลมแอร์
    mapping: { save: 'เน้นประหยัด (26°C+)', cool: 'เน้นฉ่ำ (23-24°C)' },
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-50'
  },
];