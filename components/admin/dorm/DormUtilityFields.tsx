import { Droplets, Zap, Wallet } from "lucide-react";
import { Input } from "@/components/ui/input";

interface DormUtilityFieldsProps {
  formData: {
    electricRate: string;
    waterRate: string;
    commonFee: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function DormUtilityFields({ formData, onChange }: DormUtilityFieldsProps) {
  return (
    <div className="grid gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4">
      <div>
        <h3 className="text-base font-bold text-gray-800">ค่าใช้จ่ายเพิ่มเติมของหอพัก</h3>
        <p className="text-xs text-gray-500 mt-1">
          กำหนดเรทค่าน้ำ ค่าไฟ และค่าส่วนกลาง เพื่อใช้แสดงบนหน้า Dorm Detail และตอนยืนยันการจอง
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <UtilityField
          label="ค่าไฟ (บาท/หน่วย)"
          icon={<Zap size={16} />}
          name="electricRate"
          value={formData.electricRate}
          placeholder="เช่น 8"
          onChange={onChange}
        />
        <UtilityField
          label="ค่าน้ำ (บาท/หน่วย)"
          icon={<Droplets size={16} />}
          name="waterRate"
          value={formData.waterRate}
          placeholder="เช่น 18"
          onChange={onChange}
        />
        <UtilityField
          label="ค่าส่วนกลาง (บาท/เดือน)"
          icon={<Wallet size={16} />}
          name="commonFee"
          value={formData.commonFee}
          placeholder="เช่น 500"
          onChange={onChange}
        />
      </div>
    </div>
  );
}

interface UtilityFieldProps {
  label: string;
  icon: React.ReactNode;
  name: string;
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function UtilityField({ label, icon, name, value, placeholder, onChange }: UtilityFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-bold flex items-center gap-2 text-gray-700">
        <span className="text-emerald-500">{icon}</span>
        {label}
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
          {icon}
        </div>
        <Input
          type="number"
          inputMode="decimal"
          step="0.01"
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="h-11 rounded-xl pl-9 pr-3 focus-visible:ring-emerald-500"
          required
        />
      </div>
    </div>
  );
}

