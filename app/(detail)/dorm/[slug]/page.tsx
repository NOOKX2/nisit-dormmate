import { DormHeroImage } from '@/components/dorm/detail/DormHeroImage';
import { ReviewCard } from '@/components/dorm/ReviewCard';
import { ScoreItem } from '@/components/dorm/ScoreItem';
import { BackButton } from '@/components/ui/BackButton';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Wifi, Shield, Heart } from 'lucide-react';
import Link from 'next/link';
import { getDormBySlug } from '@/app/action/dorm';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ slug: string }>; // Next.js 15+ params เป็น Promise
}

export default async function DormDetailPage({ params }: PageProps) {

  // 🟢 1. ดึงข้อมูลจริงจาก Database ผ่าน Server Action
  const resolvedParams = await params;
  const slug = decodeURIComponent(resolvedParams.slug);
  const dorm =  await getDormBySlug(slug);
  console.log("Slug:", slug);

  // 2. ถ้าไม่พบข้อมูล ให้แสดงหน้า 404
  if (!dorm) {
    notFound();
  }

  // 3. เตรียมฟอร์แมตราคา (ดึงจาก Relation priceRange)
  const formattedMinPrice = dorm.priceRange 
    ? dorm.priceRange.minPrice.toLocaleString() 
    : '0';

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex justify-center">
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
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {dorm.name}
              </h1>
              <p className="text-sm text-gray-500 flex items-center gap-1 mb-2">
                <MapPin size={14} /> 
                {dorm.locationShort}
              </p>
              <div className="flex items-center gap-1 text-sm font-medium">
                <Star size={16} className="text-yellow-400" fill="currentColor" /> 
                {dorm.rating.toFixed(1)} 
                <span className="text-gray-400 font-normal">({dorm.reviewCount} รีวิว)</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-emerald-600">
                ฿{formattedMinPrice}
              </div>
              <div className="text-sm text-gray-400">เริ่มต้น/เดือน</div>
            </div>
          </div>

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
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex justify-center z-50">
          <div className="max-w-3xl w-full">
            <Link href={`/dorm/${dorm.slug}/booking`}>
              <Button className="py-6 w-full text-lg rounded-2xl bg-gray-900 hover:bg-black text-white transition-all active:scale-[0.98]">
                จองหอพักนี้
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}