import { DormHeroImage } from '@/components/dorm/detail/DormHeroImage';
import { AmenitiesSection } from '@/components/dorm/detail/AmenitiesSection';
import { BookingFooter } from '@/components/dorm/detail/BookingFooter';
import { DormTitleInfo } from '@/components/dorm/detail/DormTitleInfo';
import { UtilityInfo } from '@/components/dorm/detail/UtilityInfo';
import { ReviewCard } from '@/components/dorm/ReviewCard';
import { ScoreItem } from '@/components/dorm/ScoreItem';
import { BackButton } from '@/components/ui/BackButton';
import { Wifi, Shield, Heart } from 'lucide-react';
import { checkUserBookingStatus, getDormBySlug } from '@/app/action/dorm';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ slug: string }>; // Next.js 15+ params เป็น Promise
}

export default async function DormDetailPage({ params }: PageProps) {

  // 🟢 1. ดึงข้อมูลจริงจาก Database ผ่าน Server Action
  const resolvedParams = await params;
  const slug = decodeURIComponent(resolvedParams.slug);
  const dorm =  await getDormBySlug(slug);

  // 2. ถ้าไม่พบข้อมูล ให้แสดงหน้า 404
  if (!dorm) {
    notFound();
  }

 const hasBooked = await checkUserBookingStatus(dorm.id);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex justify-center pb-28 md:pb-8">
      <div className="max-w-3xl w-full">

        <div className="relative">
          <div className="absolute top-4 left-4 z-10">
            <BackButton />
          </div>
          {/* 🟢 ใช้ข้อมูลจริงจาก DB */}
          <DormHeroImage imageUrl={dorm.imageUrl || "/mock/dorm2.jpg"} name={dorm.name} />
        </div>

        {/* Header Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm mb-6">
          <DormTitleInfo dorm={dorm} />
          <UtilityInfo electricRate="8" waterRate="18" />

          {/* Sub Scores (ดึงค่าจาก DB fields ที่เรามี) */}
          <div className="grid grid-cols-3 gap-4 border-t border-gray-100 pt-4 mt-4">
            <ScoreItem 
              icon={<Wifi size={20} />} label="ความเร็วเน็ต" 
              score={dorm.wifiScore || 0}
              bgColorClass="bg-blue-50" textColorClass="text-blue-500"
            />
            <ScoreItem 
              icon={<Shield size={20} />} label="ความปลอดภัย" 
              score={dorm.securityScore || 0}
              bgColorClass="bg-orange-50" textColorClass="text-orange-500"
            />
            <ScoreItem 
              icon={<Heart size={20} />} label="เจ้าของหอ" 
              score={dorm.ownerScore || 0}
              bgColorClass="bg-pink-50" textColorClass="text-pink-500"
            />
          </div>
        </div>

        <AmenitiesSection />

        {/* Reviews Section (ส่วนนี้ยัง Mock ไว้ก่อนได้ครับจนกว่าจะมีตาราง Review) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm mb-24">
          <h2 className="text-lg font-bold text-gray-900 mb-4">รีวิวจากผู้อยู่จริง</h2>
          <ReviewCard 
            author="น้องออม" faculty="วิศวะ" year={1} rating={5} date="15 ม.ค. 2026"
            comment="หอนี้เดินทางสะดวกมากครับ อยู่ใกล้คณะวิศวะเลย"
            helpfulCount={24}
          />
        </div>

        {/* Sticky Bottom Button */}
        <BookingFooter hasBooked={hasBooked} dormSlug={dorm.slug} />
      </div>
    </div>
  );
}