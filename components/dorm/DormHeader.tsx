import { MapPin, Star } from 'lucide-react';

interface DormHeaderProps {
  name: string;
  address: string;
  rating: number;
  reviewCount: number;
  price: number;
}

export function DormHeader({ name, address, rating, reviewCount, price }: DormHeaderProps) {
  return (
    <div className="flex justify-between items-start mb-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{name}</h1>
        <p className="text-sm text-gray-500 flex items-center gap-1 mb-2">
          <MapPin size={14} /> {address}
        </p>
        <div className="flex items-center gap-1 text-sm font-medium">
          <Star size={16} className="text-yellow-400" fill="currentColor" /> 
          {rating} <span className="text-gray-400 font-normal">({reviewCount} รีวิว)</span>
        </div>
      </div>
      <div className="text-right">
        <div className="text-2xl font-bold text-emerald-600">฿{price.toLocaleString()}</div>
        <div className="text-sm text-gray-400">ต่อเดือน</div>
      </div>
    </div>
  );
}