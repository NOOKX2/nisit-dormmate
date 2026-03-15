import { Droplets, Zap } from "lucide-react";

interface PriceProps {
  price: number; // ค่าเช่าล่วงหน้า 1 เดือน
  deposit: number; // ค่าประกันความเสียหาย
  serviceFee?: number;
  commonFee?: number; // 🟢 1. เพิ่ม properties ค่าส่วนกลาง
  electricRate?: string; // เช่น "8"
  waterRate?: string; // เช่น "18"
  waterMinimum?: number; // เช่น 100
}

const formatTHB = (amount: number) => `฿${amount.toLocaleString("th-TH")}`;

export const PriceDetails = ({
  price,
  deposit,
  serviceFee = 0,
  commonFee = 0, // 🟢 2. รับค่าและตั้งค่าเริ่มต้นเป็น 0
  electricRate,
  waterRate,
  waterMinimum,
}: PriceProps) => {
  const day1Total = price + deposit + serviceFee;

  return (
    <div className="space-y-4">
      {/* Card 1: Day-1 Cost */}
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h3 className="font-extrabold text-gray-900">💰 ยอดชำระวันเข้าอยู่ (Day-1 Cost)</h3>
        </div>

        <div className="space-y-2.5 text-sm">
          <Row label="ค่าเช่าล่วงหน้า 1 เดือน" value={formatTHB(price)} />
          <Row label="ค่าประกันความเสียหาย" value={formatTHB(deposit)} />
          {serviceFee > 0 ? <Row label="ค่าดำเนินการ (ชำระครั้งเดียว)" value={formatTHB(serviceFee)} /> : null}

          <div className="flex items-end justify-between border-t border-emerald-100 pt-3 mt-3">
            <div>
              <div className="text-xs text-emerald-700/80 font-medium">ยอดรวมที่ต้องจ่ายวันนี้</div>
              <div className="text-[11px] text-gray-500">รวมรายการด้านบน</div>
            </div>
            <div className="text-2xl font-black text-emerald-700">{formatTHB(day1Total)}</div>
          </div>
        </div>
      </div>

      {/* Card 2: Monthly Estimate */}
      <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4">📅 ประมาณการค่าใช้จ่ายรายเดือน</h3>

        <div className="space-y-3 text-sm">
          <Row label="ค่าเช่ารายเดือน" value={formatTHB(price)} />
          
          {/* 🟢 3. เพิ่มบรรทัดค่าส่วนกลาง โชว์เฉพาะหอที่มีการเก็บรายเดือน */}
          {commonFee > 0 && (
            <Row label="ค่าส่วนกลาง" value={formatTHB(commonFee)} />
          )}

          <div className="rounded-xl border border-gray-100 bg-white p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-gray-700">
                <Zap size={16} className="text-amber-500" />
                <span className="font-medium">ค่าไฟ</span>
              </div>
              <div className="text-gray-700">{electricRate} บ./หน่วย</div>
            </div>
            <div className="flex items-center justify-between gap-3 mt-2">
              <div className="flex items-center gap-2 text-gray-700">
                <Droplets size={16} className="text-sky-500" />
                <span className="font-medium">ค่าน้ำ</span>
              </div>
              <div className="text-gray-700">
                {waterRate} บ./หน่วย <span className="text-gray-400">(ขั้นต่ำ {waterMinimum} บ.)</span>
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-500 italic">
            *ค่าน้ำและค่าไฟชำระตามมิเตอร์ที่ใช้จริงในเดือนถัดไป
          </div>
        </div>
      </div>
    </div>
  );
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );
}