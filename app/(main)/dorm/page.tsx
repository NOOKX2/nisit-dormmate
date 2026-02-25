import { DormCard } from '@/components/dorm/DormCard';
import { DormSearch } from '@/components/dorm/DormSearch';
import { MOCK_DORMS } from '@/lib/mock-data';
import { Building } from 'lucide-react';


export default function DormListingPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex justify-center">
      <div className="max-w-5xl w-full">

        {/* Header */}
        <div className="mb-8 text-center md:text-left">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-100 text-emerald-600 rounded-2xl mb-4 md:hidden">
            <Building size={28} />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">ค้นหาหอพัก</h1>
          <p className="text-gray-500 mt-1">หอพักที่ผ่านการยืนยัน รีวิวจากผู้อยู่จริง ใกล้มหาวิทยาลัย</p>
        </div>

        {/* Search & Filter */}
        <DormSearch />

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-500 font-medium">
          พบ {MOCK_DORMS.length} แห่งที่น่าสนใจ
        </div>

        {/* Dorm List Grid */}
        <div className="grid grid-cols-1 gap-4">
          {MOCK_DORMS.map((dorm) => (
           
              <DormCard key={dorm.id} dorm={dorm} />
        
          ))}
        </div>

      </div>
    </div>
  );
}