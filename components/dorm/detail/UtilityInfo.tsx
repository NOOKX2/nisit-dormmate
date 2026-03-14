import { Zap, Droplets } from 'lucide-react';

interface UtilityInfoProps {
  electricRate: number; 
  waterRate: number;
}

export function UtilityInfo({ electricRate , waterRate }: UtilityInfoProps) {
  return (
    <div className="border-t border-gray-100 pt-4 mt-4">
      <div className="flex items-center justify-between gap-2 mb-3">
        <h2 className="text-base font-bold text-gray-900">ค่าใช้จ่ายเพิ่มเติม</h2>
        <span className="text-xs text-gray-400">อ้างอิงเรทมาตรฐานของหอ</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <UtilityCard icon={<Zap size={18} />} label="ค่าไฟ" rate={`${electricRate} บ./หน่วย`} iconColorClassName="text-amber-500" />
        <UtilityCard icon={<Droplets size={18} />} label="ค่าน้ำ" rate={`${waterRate} บ./หน่วย (ขั้นต่ำ 100 บ.)`} iconColorClassName="text-sky-500" />
      </div>
    </div>
  );
}

function UtilityCard({
  icon,
  label,
  rate,
  iconColorClassName,
}: {
  icon: React.ReactNode;
  label: string;
  rate: string;
  iconColorClassName: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-gray-100 ${iconColorClassName}`}>
          {icon}
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-gray-900">{label}</div>
          <div className="text-sm text-gray-600">{rate}</div>
        </div>
      </div>
    </div>
  );
}