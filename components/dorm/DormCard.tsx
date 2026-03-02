import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Star, Wifi, Shield, Car, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge'; 
import { Dorm, DormPriceRange } from '@prisma/client';

// 🟢 รวม Type ระหว่าง Dorm และ PriceRange
type DormWithPrice = Dorm & {
  priceRange: DormPriceRange | null;
};

interface DormCardProps {
  dorm: DormWithPrice;
}

// Map ไอคอนสำหรับสิ่งอำนวยความสะดวก
const facilityIcons: { [key: string]: React.ReactNode } = {
  wifi: <Wifi size={14} />,
  security: <Shield size={14} />,
  parking: <Car size={14} />,
};

export function DormCard({ dorm }: DormCardProps) {
  // ฟอร์แมตตัวเลขให้มีคอมม่า (เช่น 5,500)
  const format = (num: number) => new Intl.NumberFormat('th-TH').format(num);

  // 💰 จัดการการแสดงผลราคาแบบ Range
  const priceDisplay = dorm.priceRange 
    ? `฿${format(dorm.priceRange.minPrice)} - ${format(dorm.priceRange.maxPrice)}`
    : "ยังไม่ระบุราคา";

  return (
    <Link href={`/dorm/${dorm.slug}`} className="block group">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all flex flex-col md:flex-row">
        
        {/* 🖼️ Image Section */}
        <div className="relative w-full md:w-1/3 h-48 md:h-auto bg-gray-100 shrink-0">
          {dorm.imageUrl ? (
            <Image 
              src={dorm.imageUrl} 
              alt={dorm.name} 
              fill
              priority 
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              ไม่มีรูปภาพ
            </div>
          )}
          
          {/* Verified Badge (สมมติว่าใช้ rating > 4 เป็นเกณฑ์ หรือเพิ่ม field isVerified ในอนาคต) */}
          {dorm.rating >= 4.5 && (
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-emerald-600 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
              <CheckCircle2 size={14} fill="currentColor" className="text-emerald-100" /> Verified
            </div>
          )}
        </div>

        {/* 📝 Content Section */}
        <div className="p-5 flex flex-col grow">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                {dorm.name}
              </h3>
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                <MapPin size={14} /> {dorm.locationShort}
              </p>
            </div>
            
            <div className="text-right shrink-0">
              <div className="text-lg md:text-xl font-bold text-emerald-600">
                {priceDisplay}
              </div>
              <div className="text-xs text-gray-400 font-medium">ราคาต่อเดือน</div>
            </div>
          </div>

          {/* ⭐ Rating & Reviews */}
          <div className="flex items-center gap-1 text-sm mb-4">
            <Star size={16} className="text-yellow-400" fill="currentColor" /> 
            <span className="font-bold">{dorm.rating.toFixed(1)}</span>
            <span className="text-gray-400">({dorm.reviewCount} รีวิว)</span>
          </div>

          {/* 🏷️ Tags & Facilities */}
          <div className="mt-auto space-y-3">
            {/* Facilities Icons */}
      

            {/* General Tags */}
            
          </div>
        </div>
      </div>
    </Link>
  );
}