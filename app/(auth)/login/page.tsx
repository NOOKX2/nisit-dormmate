"use client";

import { AuthWrapper } from '@/components/auth/AuthWrapper';
import { Button } from '@/components/ui/button';
import { Mail, Lock } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { loginAction } from '../../action/login';
import { FormError } from '@/components/ui/FormError'; // อย่าลืม Import Component Error ที่เราสร้างไว้ครับ

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isPending, setIsPending] = useState(false); 
  const [error, setError] = useState<string | null>(null);

  // เปลี่ยนมาใช้ onSubmit เพื่อคุมสถานะฟอร์มให้แม่นยำขึ้นครับ
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 🟢 ป้องกันการล้างข้อมูลในฟอร์ม
    setIsPending(true);
    setError(null);

    // สร้าง FormData จาก State เพื่อส่งให้ Server Action
    const data = new FormData();
    data.append('email', formData.email);
    data.append('password', formData.password);

    const result = await loginAction(data);

    if (result?.error) {
      setError(result.error);
      setIsPending(false); // ปิดสถานะโหลดเพื่อให้แก้ข้อมูลได้
    }
    // หมายเหตุ: ถ้าสำเร็จ loginAction มักจะสั่ง redirect ไปหน้าอื่นโดยอัตโนมัติครับ
  };

  return (
    <AuthWrapper title="เข้าสู่ระบบ" subtitle="ยินดีต้อนรับกลับมาครับ">
      {/* 🟢 เปลี่ยนจาก action เป็น onSubmit */}
      <form className="space-y-4" onSubmit={handleSubmit}>
        
        {/* 🔴 แสดง Error Message โดยใช้ Component ที่เราสร้าง */}
        <FormError message={error} />

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">อีเมลมหาวิทยาลัย</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              name='email'
              type="email"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              placeholder="b6xxxxxxxxx@ku.th"
              required
              value={formData.email} // 🟢 ผูกค่ากับ State
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between">
            <label className="text-sm font-medium text-gray-700">รหัสผ่าน</label>
            <Link href="#" className="text-xs text-emerald-600 hover:underline">ลืมรหัสผ่าน?</Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              name='password'
              type="password"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              placeholder="••••••••"
              required
              value={formData.password} // 🟢 ผูกค่ากับ State
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="w-full py-6 mt-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all disabled:opacity-70"
        >
          {isPending ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
        </Button>

        <p className="text-center text-sm text-gray-500 mt-6">
          ยังไม่มีบัญชี? <Link href="/register" className="text-emerald-600 font-semibold hover:underline">สมัครสมาชิก</Link>
        </p>
      </form>
    </AuthWrapper>
  );
}