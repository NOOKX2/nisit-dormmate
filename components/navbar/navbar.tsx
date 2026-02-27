import Link from 'next/link';
import { Building2, User, LogOut } from 'lucide-react'; // เพิ่ม Icon สำหรับ User และ Logout
import { getAuthUser } from '@/lib/auth';
import { logoutAction } from '@/app/(auth)/logout/action';
import UserDropdown from '../ui/UseDropDown';

export default async function Navbar() {
  const user = await getAuthUser(); // ตรวจสอบสถานะจาก Cookie

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="bg-emerald-500 text-white p-2 rounded-xl">
            <Building2 size={20} />
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">
            Nisit<span className="text-emerald-600"> Dormmate</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link href="/dorm" className="hover:text-emerald-600 transition-colors">
            ค้นหาหอพัก
          </Link>
          <Link href="/quiz" className="hover:text-emerald-600 transition-colors">
            จับคู่หารูมเมท
          </Link>
        </div>

        {/* Auth Section */}
        <div className="flex items-center gap-3">
          {user ? (
            // ✅ กรณี Login แล้ว: แสดงชื่อและปุ่ม Logout
            <UserDropdown 
              name={user.name} 
              onClick={logoutAction} 
            />
          ) : (
            // ❌ กรณีไม่ได้ Login: แสดงปุ่มเข้าสู่ระบบ
            <Link href='/login'>
              <button className="bg-gray-900 text-white px-5 py-2.5 rounded-xl hover:bg-gray-800 transition-all font-medium text-sm">
                เข้าสู่ระบบ
              </button>
            </Link>
          )}
        </div>

      </div>
    </nav>
  );
}