import { DormForm } from "@/components/admin/add-dorm/DormForm";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function AddDormPage() {
  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Back Button */}
        <Link 
          href="/admin" 
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors w-fit"
        >
          <ChevronLeft size={20} />
          <span className="font-medium">กลับไปหน้า Dashboard</span>
        </Link>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">เพิ่มหอพักใหม่</h1>
            <p className="text-gray-500 text-sm">กรอกข้อมูลหอพักและราคาเริ่มต้นเพื่อบันทึกลงระบบ</p>
          </div>

          {/* เรียกใช้ Component ย่อย */}
          <DormForm />
        </div>
      </div>
    </div>
  );
}