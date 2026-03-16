import Link from 'next/link';
import { Building2, MessageCircle } from 'lucide-react';
import { getAuthUser } from '@/lib/auth';
import { logoutAction } from '@/app/action/logout';
import UserDropdown from '../ui/UseDropDown';
import NavLink from './navLink';

export default async function Navbar() {
  const user = await getAuthUser();

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

        {/* 🟢 Desktop Menu - เปลี่ยนจาก Link เป็น NavLink */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <NavLink href="/dorm">ค้นหาหอพัก</NavLink>
          <NavLink href="/quiz">จับคู่หารูมเมท</NavLink>
          <NavLink href="/match">รูมเมทที่แนะนำ</NavLink>
        </div>

        {/* Auth Section */}
        <div className="flex items-center gap-5">
          {user ? (
            <>
              <NavLink 
                href="/chat" 
              >
                <MessageCircle size={22} />
              </NavLink>

              <UserDropdown
                name={`${user.firstName} ${user.lastName}`}
                onClick={logoutAction}
              />
            </>
          ) : (
            <Link href='/login'>
              <button className="bg-gray-900 text-white px-5 py-2.5 rounded-xl hover:bg-gray-800 transition-all font-medium text-sm shadow-sm">
                เข้าสู่ระบบ
              </button>
            </Link>
          )}
        </div>

      </div>
    </nav>
  );
}