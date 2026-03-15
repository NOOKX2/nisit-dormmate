// 🟢 เอา "use client" ออกไปเลย! กลายเป็น Server Component แล้ว
import { getAuthUser } from "@/lib/auth";
import { FeedbackWidget } from "./FeedBackWidget";

export async function Footer() {
  // 🟢 ดึงข้อมูล User จากฝั่ง Server (ไวกว่า ปลอดภัยกว่า)
  const user = await getAuthUser();

  return (
    <footer className="w-full border border-gray-100 bg-white py-10 ">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
        
        <p className="mb-4 md:mb-0">
          © 2026 Nisit Dormmate. All rights reserved.
        </p>

        <div className="flex items-center gap-6">
          <span className="text-gray-300">|</span>
          
          {/* 🟢 เรียกใช้ปุ่ม Client Component และส่ง user เข้าไป */}
          <FeedbackWidget user={user} />
        </div>
      </div>
    </footer>
  );
}