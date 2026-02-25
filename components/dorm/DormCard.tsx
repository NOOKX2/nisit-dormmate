import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Star, Wifi, Shield, Car, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge'; 
import { Dorm } from '@/types/dorm';

const facilityIcons: { [key: string]: React.ReactNode } = {
  wifi: <Wifi size={14} />,
  security: <Shield size={14} />,
  parking: <Car size={14} />,
};

interface DormCardProps {
  dorm: Dorm,
}

export function DormCard({ 
  dorm
}: DormCardProps) {
 
  const formattedPrice = new Intl.NumberFormat('th-TH').format(dorm.price);

  return (
    <Link href={`/dorm/${dorm.slug}`} className="block group">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="relative w-full md:w-1/3 h-48 md:h-auto bg-gray-200 shrink-0">
           <Image src={dorm.imageUrl} alt='dorm image' fill className='object-cover'/>
           
           {dorm.isVerified && (
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-emerald-600 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
              <CheckCircle2 size={14} fill="currentColor" className="text-emerald-100" /> Verified
            </div>
           )}
        </div>

        {/* Content Section */}
        <div className="p-5 flex flex-col grow">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">{dorm.name}</h3>
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                <MapPin size={14} /> {dorm.locationShort}
              </p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-xl font-bold text-emerald-600">฿{formattedPrice}</div>
              <div className="text-xs text-gray-400">ต่อเดือน</div>
            </div>
          </div>

          <div className="flex items-center gap-1 text-sm mb-4">
            <Star size={16} className="text-yellow-400" fill="currentColor" /> 
            <span className="font-bold">{dorm.rating}</span>
            <span className="text-gray-400">({dorm.reviewCount} รีวิว)</span>
          </div>

          {/* Tags & Facilities */}
          <div className="mt-auto">
            <div className="flex flex-wrap gap-2 mb-3">
              {dorm.facilities.map((fac) => (
                 <div key={fac} className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                   {facilityIcons[fac]} {fac.charAt(0).toUpperCase() + fac.slice(1)}
                 </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {dorm.tags.map((tag, index) => (
                // ใช้ Badge แบบ shadcn/ui
                <Badge key={index} variant="secondary" className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-transparent font-normal">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}