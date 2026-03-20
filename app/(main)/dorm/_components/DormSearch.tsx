import { Search, SlidersHorizontal } from 'lucide-react';
// ถ้าใช้ Input และ Button ของ shadcn/ui ให้ import จากที่นี่
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function DormSearch() {
  return (
    <div className="flex gap-3 mb-6">
      <div className="relative grow">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
       <Input
          type="text" 
          placeholder="ค้นหาชื่อหอพัก, ทำเล, หรือใกล้มหาวิทยาลัย..." 
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </div>
      <Button className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors shrink-0 font-medium">
        <SlidersHorizontal size={20} /> ฟิลเตอร์
      </Button>
    </div>
  );
}