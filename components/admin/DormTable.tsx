import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface Dorm {
  id: string;
  name: string;
  locationShort: string;
  priceRange: string | null;
}

export function DormTable({ dorms }: { dorms: Dorm[] }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-50 flex justify-between items-center">
        <h2 className="font-bold text-lg">หอพักที่เพิ่มล่าสุด</h2>
        <Link href="/dorm" className="text-sm text-emerald-600 font-medium hover:underline">
          ดูทั้งหมด
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
            <tr>
              <th className="px-6 py-4">ชื่อหอพัก</th>
              <th className="px-6 py-4">พิกัด</th>
              <th className="px-6 py-4">ราคาเริ่มต้น</th>
              <th className="px-6 py-4">สถานะ</th>
              <th className="px-6 py-4 text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {dorms.map((dorm) => (
              <tr key={dorm.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-4 font-medium text-gray-900">{dorm.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{dorm.locationShort}</td>
                <td className="px-6 py-4 text-sm font-semibold text-emerald-600">฿{dorm.priceRange}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full uppercase">Verified</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 group-hover:text-gray-900">
                    <ChevronRight size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}