import { Image as ImageIcon } from "lucide-react";

interface DormImageSectionProps {
  imageUrl: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function DormImageSection({ imageUrl, onChange }: DormImageSectionProps) {
  return (
    <div className="space-y-3 -mx-6 md:-mx-8 -mt-6 md:-mt-8 mb-6 border-b border-gray-100 bg-gray-50">
      <div className="relative w-full h-48 sm:h-64 md:h-80 overflow-hidden bg-gray-100 flex items-center justify-center">
        {imageUrl ? (
          <img 
            key={imageUrl}
            src={imageUrl} 
            alt="Dorm banner preview" 
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = '/mock/dorm2.jpg'; }}
          />
        ) : (
          <div className="flex flex-col items-center gap-3 text-gray-400">
            <ImageIcon size={48} strokeWidth={1} />
            <span className="text-sm">ยังไม่ได้ใส่ URL รูปภาพ</span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black/60 to-transparent">
           <span className="text-xs font-medium text-white/80">พรีวิวรูปภาพหอพัก (Banner)</span>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-2">
        <label className="text-sm font-bold text-gray-700">แก้ไข URL รูปภาพหอพัก</label>
        <input
          type="text" name="imageUrl" 
          value={imageUrl} onChange={onChange}
          className="w-full p-3 rounded-xl border border-gray-200 focus:border-emerald-500 transition-all outline-none bg-white shadow-inner"
          placeholder="ใส่ URL ของรูปภาพ (เช่น https://example.com/dorm.jpg)"
        />
        <p className="text-xs text-gray-500 italic">*รูปภาพจะอัปเดตทันทีที่ใส่ URL ที่ถูกต้อง</p>
      </div>
    </div>
  );
}