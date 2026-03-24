'use client';

import { Search, SlidersHorizontal, X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import type { FormEvent } from 'react';

interface DormSearchProps {
  defaultValues?: {
    q?: string;
    area?: string;
    min?: string;
    max?: string;
    verified?: boolean;
    sort?: string;
  };
}

export function DormSearch({ defaultValues }: DormSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [q, setQ] = useState(defaultValues?.q || '');
  const [area, setArea] = useState(defaultValues?.area || '');
  const [min, setMin] = useState(defaultValues?.min || '');
  const [max, setMax] = useState(defaultValues?.max || '');
  const [verified, setVerified] = useState(!!defaultValues?.verified);
  const [sort, setSort] = useState(defaultValues?.sort || 'newest');

  const applyFilters = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());

    const setOrDelete = (key: string, value: string) => {
      const normalized = value.trim();
      if (normalized) params.set(key, normalized);
      else params.delete(key);
    };

    setOrDelete('q', q);
    setOrDelete('area', area);
    setOrDelete('min', min);
    setOrDelete('max', max);
    if (verified) params.set('verified', '1');
    else params.delete('verified');
    if (sort && sort !== 'newest') params.set('sort', sort);
    else params.delete('sort');

    router.push(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    setQ('');
    setArea('');
    setMin('');
    setMax('');
    setVerified(false);
    setSort('newest');
    router.push(pathname);
  };

  return (
    <form onSubmit={applyFilters} className="mb-6 space-y-3">
      <div className="flex gap-3">
        <div className="relative grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ค้นหาชื่อหอพัก, ทำเล, หรือใกล้มหาวิทยาลัย..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
        <Button
          type="button"
          onClick={() => setShowAdvanced((v) => !v)}
          className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors shrink-0 font-medium"
        >
          <SlidersHorizontal size={20} /> ฟิลเตอร์
        </Button>
        <Button type="submit" className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shrink-0">
          ค้นหา
        </Button>
      </div>

      {showAdvanced && (
        <div className="rounded-xl border border-gray-200 bg-white p-4 grid grid-cols-1 md:grid-cols-4 gap-3">
          <Input
            type="text"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="โซน/ทำเล เช่น หน้ามอ"
          />
          <Input
            type="number"
            min="0"
            value={min}
            onChange={(e) => setMin(e.target.value)}
            placeholder="ราคาเริ่มต้น"
          />
          <Input
            type="number"
            min="0"
            value={max}
            onChange={(e) => setMax(e.target.value)}
            placeholder="ราคาสูงสุด"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="newest">ใหม่ล่าสุด</option>
            <option value="price_asc">ราคาต่ำไปสูง</option>
            <option value="price_desc">ราคาสูงไปต่ำ</option>
            <option value="rating_desc">คะแนนรีวิวสูงสุด</option>
          </select>

          <label className="md:col-span-2 flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={verified}
              onChange={(e) => setVerified(e.target.checked)}
              className="h-4 w-4 accent-emerald-600"
            />
            แสดงเฉพาะหอ Verified (เรตติ้ง 4.5+)
          </label>

          <div className="md:col-span-2 flex justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={clearFilters}
              className="flex items-center gap-2"
            >
              <X size={16} />
              ล้างตัวกรอง
            </Button>
          </div>
        </div>
      )}
    </form>
  );
}