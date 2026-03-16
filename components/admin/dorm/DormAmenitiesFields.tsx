interface DormAmenitiesFieldsProps {
  value: string[];
  onChange: (next: string[]) => void;
}

const indoorAmenities = [
  { id: "aircon", label: "แอร์" },
  { id: "waterHeater", label: "เครื่องทำน้ำอุ่น" },
  { id: "furniture", label: "เฟอร์นิเจอร์" },
  { id: "fridge", label: "ตู้เย็น" },
  { id: "tv", label: "ทีวี" },
  { id: "sink", label: "ซิงค์ล้างจาน" },
  { id: "balcony", label: "ระเบียง" },
] as const;

const commonAmenities = [
  { id: "elevator", label: "ลิฟต์" },
  { id: "security", label: "กล้องวงจรปิด / คีย์การ์ด" },
  { id: "washingMachine", label: "เครื่องซักผ้าหยอดเหรียญ" },
  { id: "wifi", label: "Wi‑Fi ส่วนกลาง" },
  { id: "fitness", label: "ฟิตเนส" },
  { id: "pool", label: "สระว่ายน้ำ" },
  { id: "carParking", label: "ที่จอดรถยนต์" },
  { id: "motorcycleParking", label: "ที่จอดมอเตอร์ไซค์" },
  { id: "coworking", label: "Co-working space" },
] as const;

export function DormAmenitiesFields({ value, onChange }: DormAmenitiesFieldsProps) {
  const handleToggle = (id: string) => {
    if (value.includes(id)) {
      onChange(value.filter((item) => item !== id));
    } else {
      onChange([...value, id]);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 space-y-4">
      <div>
        <h3 className="text-base font-bold text-gray-800">สิ่งอำนวยความสะดวกของหอพัก</h3>
        <p className="text-xs text-gray-500 mt-1">
          เลือกรายการที่มีจริง เพื่อช่วยให้ นิสิต เปรียบเทียบหอพักได้ง่ายขึ้น
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <AmenityColumn title="ภายในห้อง" items={indoorAmenities} value={value} onToggle={handleToggle} />
        <AmenityColumn title="ส่วนกลาง" items={commonAmenities} value={value} onToggle={handleToggle} />
      </div>
    </div>
  );
}

interface AmenityColumnProps {
  title: string;
  items: readonly { id: string; label: string }[];
  value: string[];
  onToggle: (id: string) => void;
}

function AmenityColumn({ title, items, value, onToggle }: AmenityColumnProps) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-700">{title}</h4>
      <div className="grid grid-cols-1 gap-2">
        {items.map((item) => (
          <label
            key={item.id}
            className="flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-700 cursor-pointer hover:bg-emerald-50 hover:border-emerald-100 transition-colors"
          >
            <input
              type="checkbox"
              checked={value.includes(item.id)}
              onChange={() => onToggle(item.id)}
              className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span>{item.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

