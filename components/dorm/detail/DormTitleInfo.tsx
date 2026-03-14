import { MapPin, Star } from 'lucide-react';

interface DormTitleInfoProps {
  dorm: {
    name: string;
    locationShort: string;
    rating: number;
    reviewCount: number;
    priceRange?: {
      minPrice: number;
    } | null;
  };
}

export function DormTitleInfo({ dorm }: DormTitleInfoProps) {
  const formattedMinPrice = dorm.priceRange 
    ? dorm.priceRange.minPrice.toLocaleString() 
    : '0';

  return (
    <div className="flex justify-between items-start mb-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          {dorm.name}
        </h1>
        
        <p className="text-sm text-gray-500 flex items-center gap-1">
          <MapPin size={14} className="text-emerald-500" /> 
          {dorm.locationShort}
        </p>

        {/* ระยะทาง - เพิ่มความโดดเด่นเล็กน้อย */}
        <div className="bg-emerald-50 text-emerald-700 text-xs px-2.5 py-1 rounded-full inline-flex items-center gap-1 font-medium border border-emerald-100 mt-1">
          📍 ห่างจากมหาวิทยาลัย 500 ม.
        </div>

        <div className="flex items-center gap-1.5 pt-2">
          <div className="flex items-center gap-0.5 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">
            <Star size={14} className="text-amber-500" fill="currentColor" /> 
            <span className="text-sm font-bold text-amber-700">{dorm.rating.toFixed(1)}</span>
          </div>
          <span className="text-xs text-gray-400 font-normal">({dorm.reviewCount} รีวิว)</span>
        </div>
      </div>

      <div className="text-right">
        <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5">เริ่มต้น</div>
        <div className="text-2xl font-black text-emerald-600">
          ฿{formattedMinPrice}
        </div>
        <div className="text-[10px] text-gray-400 font-medium italic">/ เดือน</div>
      </div>
    </div>
  );
}