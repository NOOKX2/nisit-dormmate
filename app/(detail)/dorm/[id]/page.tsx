import { DormHeroImage } from '@/components/dorm/detail/DormHeroImage';
import { ReviewCard } from '@/components/dorm/ReviewCard';
import { ScoreItem } from '@/components/dorm/ScoreItem';
import { BackButton } from '@/components/ui/BackButton';
import { Button } from '@/components/ui/button';
import { Dorm } from '@/types/dorm';
import { MapPin, Star, Wifi, Shield, Heart } from 'lucide-react';

interface DormDetailProps {
  dorm: Dorm;
}

export default function DormDetailPage({ dorm }: DormDetailProps) {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex justify-center">
      <div className="max-w-3xl w-full">

       <div className="relative">
          
          <div className="absolute top-4 left-4 z-10">
            <BackButton />
          </div>

          <DormHeroImage imageUrl={dorm?.imageUrl} name={dorm?.name} />
        </div>
        {/* Header Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {dorm?.name || 'หอพักกรีนวิว'}
              </h1>
              <p className="text-sm text-gray-500 flex items-center gap-1 mb-2">
                <MapPin size={14} /> 
                {dorm?.locationShort || 'ซอยพหลโยธิน 45 (ใกล้มหาวิทยาลัย 500 ม.)'}
              </p>
              <div className="flex items-center gap-1 text-sm font-medium">
                <Star size={16} className="text-yellow-400" fill="currentColor" /> 
                {dorm?.rating || 4.5} <span className="text-gray-400 font-normal">({dorm?.reviewCount || 0} รีวิว)</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-emerald-600">
                ฿{dorm?.price ? dorm.price.toLocaleString() : '3,500'}
              </div>
              <div className="text-sm text-gray-400">ต่อเดือน</div>
            </div>
          </div>

          {/* Sub Scores (ใช้ ScoreItem Component ทำให้โค้ดคลีนขึ้นมาก) */}
          <div className="grid grid-cols-3 gap-4 border-t border-gray-100 pt-4 mt-4">
            <ScoreItem 
              icon={<Wifi size={20} />} label="ความเร็วเน็ต" score={4.8}
              bgColorClass="bg-blue-50" textColorClass="text-blue-500"
            />
            <ScoreItem 
              icon={<Shield size={20} />} label="ความปลอดภัย" score={4.2}
              bgColorClass="bg-orange-50" textColorClass="text-orange-500"
            />
            <ScoreItem 
              icon={<Heart size={20} />} label="เจ้าของหอ" score={4.7}
              bgColorClass="bg-pink-50" textColorClass="text-pink-500"
            />
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm mb-24">
          <h2 className="text-lg font-bold text-gray-900 mb-4">รีวิวจากผู้อยู่จริง</h2>
          <ReviewCard 
            author="น้องมิว" faculty="วิศวะ" year={3} rating={5} date="15 ม.ค. 2026"
            comment="อยู่มาแล้ว 2 ปี ชอบมากค่ะ เน็ตเร็วมากๆ เจ้าของใจดีมาก ห้องสะอาด มีเครื่องซักผ้าให้ใช้ฟรี"
            helpfulCount={24}
          />
          <ReviewCard 
            author="น้องโอ๊ต" faculty="เกษตร" year={2} rating={4} date="8 ม.ค. 2026"
            comment="ดีค่ะ ใกล้มหาลัยมาก เดินไปเรียนได้ แต่บางครั้งน้ำไหลอ่อน ตอนเช้าๆ"
            helpfulCount={12}
          />
        </div>

        {/* Sticky Bottom Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex justify-center">
          <div className="max-w-3xl w-full">
             <Button className="py-3 w-full text-lg rounded-xl">ติดต่อเจ้าของหอ</Button>
          </div>
        </div>
      </div>
    </div>
  );
}