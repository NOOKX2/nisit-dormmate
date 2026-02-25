"use client";

import { AuthWrapper } from '@/components/auth/AuthWrapper';
import { Button } from '@/components/ui/button';
import { Mail, Lock } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Fetch API '/api/auth/login'
  };

  return (
    <AuthWrapper title="เข้าสู่ระบบ" subtitle="ยินดีต้อนรับกลับมาครับ">
      <form className="space-y-4" onSubmit={handleLogin}>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">อีเมลมหาวิทยาลัย</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
            <input type="email" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" placeholder="b6xxxxxxxxx@ku.th" required />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between">
            <label className="text-sm font-medium text-gray-700">รหัสผ่าน</label>
            <Link href="#" className="text-xs text-emerald-600">ลืมรหัสผ่าน?</Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
            <input type="password" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" placeholder="••••••••" required />
          </div>
        </div>

        <Button className="w-full py-6 mt-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">เข้าสู่ระบบ</Button>
        
        <p className="text-center text-sm text-gray-500 mt-6">
          ยังไม่มีบัญชี? <Link href="/register" className="text-emerald-600 font-semibold">สมัครสมาชิก</Link>
        </p>
      </form>
    </AuthWrapper>
  );
}