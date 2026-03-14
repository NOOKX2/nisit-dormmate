"use client";

import { AuthWrapper } from '@/components/auth/AuthWrapper';
import { Button } from '@/components/ui/button';
import { Mail, Lock, User } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { registerAction } from '../../action/register';
import { FormError } from '@/components/ui/FormError';

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  // 🟢 1. แยก State ชื่อและนามสกุลออกจากกัน
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    const data = new FormData();
    // 🟢 2. ส่งค่าที่แยกแล้วให้ Server Action
    data.append('firstName', formData.firstName);
    data.append('lastName', formData.lastName);
    data.append('email', formData.email);
    data.append('password', formData.password);

    const result = await registerAction(data);
    if (result?.error) {
      setError(result.error);
      setIsPending(false);
    }
  };

  return (
    <AuthWrapper title="สมัครสมาชิก" subtitle="เริ่มต้นหาหอพักและรูมเมทที่ใช่">
      <form className="space-y-5" onSubmit={handleSubmit}> {/* เพิ่ม space-y-5 ให้ช่องห่างกันขึ้นนิดนึง */}

        <FormError message={error} />

        {/* --- หมวดชื่อ-นามสกุล --- */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700">ชื่อ-นามสกุล</label>
          
          {/* 🟢 3. เปลี่ยนจาก flex เป็น grid เพื่อให้แบ่ง 2 ช่องเท่าๆ กัน (Mobile-friendly) */}
          <div className="grid grid-cols-2 gap-3">
            {/* ช่องชื่อจริง (มี Icon) */}
            <div className="relative">
              <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
              <input
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                // เพิ่ม focus:ring และ focus:border ให้ดูพรีเมียมเวลาคลิก
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:bg-white"
                placeholder="ชื่อจริง"
                required 
              />
            </div>
            
            {/* ช่องนามสกุล (ไม่มี Icon จะได้ดูคลีนๆ) */}
            <div className="relative">
              <input
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:bg-white"
                placeholder="นามสกุล"
                required 
              />
            </div>
          </div>
        </div>

        {/* --- หมวดอีเมล --- */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700">อีเมลมหาวิทยาลัย</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <input 
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:bg-white"
              placeholder="b6xxxxxxxxx@ku.th"
              required 
            />
          </div>
        </div>

        {/* --- หมวดรหัสผ่าน --- */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700">รหัสผ่าน</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:bg-white"
              placeholder="••••••••"
              minLength={5} // เพิ่ม minLength กันคนตั้งรหัสผ่านสั้นเกินไป
              required 
            />
          </div>
        </div>

        <Button
          type="submit" // ระบุ type ให้ชัดเจน
          disabled={isPending}
          className="w-full py-6 mt-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-base font-semibold shadow-lg shadow-emerald-200 transition-all active:scale-[0.98]"
        >
          {isPending ? "กำลังสร้างบัญชี..." : "สร้างบัญชีผู้ใช้"}
        </Button>

        <p className="text-center text-sm text-gray-500 mt-6">
          มีบัญชีอยู่แล้ว? <Link href="/login" className="text-emerald-600 font-semibold hover:underline">เข้าสู่ระบบ</Link>
        </p>
      </form>
    </AuthWrapper>
  );
}