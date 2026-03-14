import { Badge } from '@/components/ui/badge';

interface AmenitiesSectionProps {
  indoorAmenities?: string[];
  commonAmenities?: string[];
}

export function AmenitiesSection({
  indoorAmenities = ['แอร์', 'เครื่องทำน้ำอุ่น', 'ตู้เย็น', 'เตียง 5 ฟุต'],
  commonAmenities = ['Wi‑Fi', 'กล้องวงจรปิด', 'ที่จอดรถ'],
}: AmenitiesSectionProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm mb-6">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="text-lg font-bold text-gray-900">สิ่งอำนวยความสะดวก</h2>
        <span className="text-xs text-gray-400">บางรายการขึ้นกับประเภทห้อง</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <AmenityGroup title="ภายในห้อง" items={indoorAmenities} />
        <AmenityGroup title="ส่วนกลาง" items={commonAmenities} />
      </div>

      <div className="mt-6 rounded-2xl border border-gray-100 bg-gray-50 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-sm font-semibold text-gray-900">แผนที่ & ตำแหน่ง</div>
            <div className="text-sm text-gray-600">เตรียมพื้นที่สำหรับ Google Maps Embed ในอนาคต</div>
          </div>
          <div className="text-xs text-gray-400 shrink-0">Coming soon</div>
        </div>
        <div className="mt-3 h-32 w-full rounded-xl border border-dashed border-gray-200 bg-white" />
      </div>
    </div>
  );
}

function AmenityGroup({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div className="text-sm font-semibold text-gray-800 mb-2">{title}</div>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Badge key={item} variant="secondary" className="bg-gray-50 text-gray-700 border border-gray-100">
            {item}
          </Badge>
        ))}
      </div>
    </div>
  );
}

