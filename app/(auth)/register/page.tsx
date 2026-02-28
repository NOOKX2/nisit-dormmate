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

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 🟢 ป้องกัน Default Form Submission ที่จะล้างข้อมูล
    setIsPending(true);
    setError(null);

    // สร้าง FormData จาก state เพื่อส่งให้ Server Action
    const data = new FormData();
    data.append('name', formData.name);
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
      <form className="space-y-4" onSubmit={handleSubmit}>

        <FormError message={error} />

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">ชื่อ-นามสกุล</label>
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              name='name'
              type="text"
              value={formData.name} // 🟢 ผูกค่ากับ State
              onChange={handleChange} // 🟢 อัปเดตเมื่อพิมพ์
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
              placeholder="สมชาย ใจดี"
              required />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">อีเมลมหาวิทยาลัย</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
            <input name='email'
              type="email"
              value={formData.email} // 🟢 ผูกค่ากับ State
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
              placeholder="b6xxxxxxxxx@ku.th"
              required />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">รหัสผ่าน</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              name='password'
              type="password"
              value={formData.password} // 🟢 ผูกค่ากับ State
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
              placeholder="••••••••"
              required />
          </div>
        </div>

        <Button
          disabled={isPending}
          className="w-full py-6 mt-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">{isPending ? "กำลังสร้างบัญชี..." : "สร้างบัญชีผู้ใช้"}</Button>

        <p className="text-center text-sm text-gray-500 mt-6">
          มีบัญชีอยู่แล้ว? <Link href="/login" className="text-emerald-600 font-semibold">เข้าสู่ระบบ</Link>
        </p>
      </form>
    </AuthWrapper>
  );
}