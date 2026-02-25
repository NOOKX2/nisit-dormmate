"use client";

import { AuthWrapper } from '@/components/auth/AuthWrapper';
import { Button } from '@/components/ui/button';
import { Mail, Lock, User } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Fetch API '/api/auth/register'
  };

  return (
    <AuthWrapper title="สมัครสมาชิก" subtitle="เริ่มต้นหาหอพักและรูมเมทที่ใช่">
      <form className="space-y-4" onSubmit={handleRegister}>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">ชื่อ-นามสกุล</label>
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400" size={18} />
            <input type="text" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" placeholder="สมชาย ใจดี" required />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">อีเมลมหาวิทยาลัย</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
            <input type="email" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" placeholder="b6xxxxxxxxx@ku.th" required />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">รหัสผ่าน</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
            <input type="password" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" placeholder="••••••••" required />
          </div>
        </div>

        <Button className="w-full py-6 mt-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">สร้างบัญชีผู้ใช้</Button>

        <p className="text-center text-sm text-gray-500 mt-6">
          มีบัญชีอยู่แล้ว? <Link href="/login" className="text-emerald-600 font-semibold">เข้าสู่ระบบ</Link>
        </p>
      </form>
    </AuthWrapper>
  );
}