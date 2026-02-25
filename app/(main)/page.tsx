import { MenuCard } from '@/components/home/MenuCard';
import { UserCheck, Users, Building, MessageSquare } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-600 text-white rounded-2xl mb-4">
            <Building size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Nisit DormMate</h1>
          <p className="text-emerald-600 font-medium">แพลตฟอร์มหาหอพักและรูมเมทสำหรับนิสิต</p>
          <p className="text-gray-500 text-sm mt-1">ครบจบในที่เดียว ข้อมูลจริง ยืนยันโดยนิสิต</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MenuCard 
            title="Lifestyle Quiz" 
            description="ทำแบบทดสอบเพื่อหารูมเมทที่ลงตัวกับคุณ ระบบจะวิเคราะห์ไลฟ์สไตล์และจับคู่ให้อัตโนมัติ"
            icon={<UserCheck size={24} />}
            linkText="เริ่มทำแบบทดสอบ"
            href="/quiz"
          />
          <MenuCard 
            title="Smart Match Discovery" 
            description="ดูรายการรูมเมทที่แมตช์กับคุณ พร้อม Match Score และข้อมูลที่เข้ากันได้"
            icon={<Users size={24} />}
            linkText="ดูรายการแมตช์"
            href="/match"
          />
          <MenuCard 
            title="Verified Dorm & Reviews" 
            description="ดูรายละเอียดหอพักที่มีการยืนยันตัวตน รีวิวจากผู้อยู่จริง รูปภาพจริง ไม่มีหลอก"
            icon={<Building size={24} />}
            linkText="ดูหอพักที่ยืนยันแล้ว"
            href="/dorm"
          />
          <MenuCard 
            title="Community Feed" 
            description="ชุมชนนิสิต แจ้งเตือนภัย แชร์ข้อมูล หาเพื่อนแชร์รถ แนะนำร้านอาหาร และอื่นๆ"
            icon={<MessageSquare size={24} />}
            linkText="เข้าสู่ชุมชน"
            href="/community"
          />
        </div>
      </div>
    </div>
  );
}