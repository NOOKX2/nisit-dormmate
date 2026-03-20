import { DormHeroImage } from '@/app/(detail)/dorm/[slug]/_components/DormHeroImage';
import { AmenitiesSection } from '@/app/(detail)/dorm/[slug]/_components/AmenitiesSection';
import { BookingFooter } from '@/app/(detail)/dorm/[slug]/_components/BookingFooter';
import { DormTitleInfo } from '@/app/(detail)/dorm/[slug]/_components/DormTitleInfo';
import { UtilityInfo } from '@/app/(detail)/dorm/[slug]/_components/UtilityInfo';
import { ScoreItem } from '@/app/(main)/dorm/_components/ScoreItem';
import { BackButton } from '@/components/ui/BackButton';
import { Wifi, Shield, Heart } from 'lucide-react';
import { checkUserBookingStatus, getDormBySlug } from '@/app/action/dorm';
import { notFound } from 'next/navigation';
import { LocationSection } from '@/app/(detail)/dorm/[slug]/_components/LocationSection';
import { ReviewSection } from '@/app/(detail)/dorm/[slug]/_components/ReviewSection';
import { getAuthUser } from '@/lib/auth';

interface PageProps {
  params: Promise<{ slug: string }>; // Next.js 15+ params เป็น Promise
}

export default async function DormDetailPage({ params }: PageProps) {

  // 🟢 1. ดึงข้อมูลจริงจาก Database ผ่าน Server Action
  const resolvedParams = await params;
  const slug = decodeURIComponent(resolvedParams.slug);
  const dorm = await getDormBySlug(slug);
  const user = await getAuthUser();

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
          <UtilityInfo
            electricRate={dorm.electricRate ?? 0}
            waterRate={dorm.waterRate ?? 0}
            commonFee={dorm.commonFee ?? 0}
          />

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

        <AmenitiesSection
          indoorAmenities={(dorm as any).indoorAmenities ?? []}
          commonAmenities={(dorm as any).commonAmenities ?? []}
        />

        <LocationSection
          dormName={dorm.name}
          address={dorm.address}
          lat={dorm.lat}
          lng={dorm.lng}
        />

        {/* Reviews Section (ส่วนนี้ยัง Mock ไว้ก่อนได้ครับจนกว่าจะมีตาราง Review) */}
        <ReviewSection dormId={dorm.id} currentUserId={user?.id} />

        {/* Sticky Bottom Button */}
        <BookingFooter hasBooked={hasBooked} dormSlug={dorm.slug} />
      </div>
    </div>
  );
}