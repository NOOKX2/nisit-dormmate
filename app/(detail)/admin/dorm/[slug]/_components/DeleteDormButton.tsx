"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { deleteDormAction } from "@/app/action/dorm";

interface DeleteDormButtonProps {
  dormId: string;
  dormName: string;
}

export function DeleteDormButton({ dormId, dormName }: DeleteDormButtonProps) {
  const [isPending, setIsPending] = useState(false);

  const handleDelete = async () => {
    // 🟢 1. ด่านตรวจ: ถามย้ำความมั่นใจก่อนลบจริง
    const confirmed = window.confirm(`⚠️ คุณแน่ใจหรือไม่ว่าต้องการลบหอพัก "${dormName}"?\n\nข้อมูลห้องพักและการจองทั้งหมดจะหายไปและไม่สามารถกู้คืนได้!`);
    
    if (!confirmed) return;

    setIsPending(true);
    
    // 🟢 2. เรียก Server Action ให้ทำงาน
    const result = await deleteDormAction(dormId);

    // 3. ถ้าพัง ค่อยแจ้งเตือน (ถ้าสำเร็จ มันจะ Redirect เด้งไปหน้าอื่นเองตามที่เขียนไว้ใน action)
    if (result?.error) {
      toast.error(result.error);
      setIsPending(false);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isPending}
      className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
    >
      {isPending && <Loader2 size={16} className="animate-spin" />}
      {isPending ? "กำลังลบข้อมูล..." : "ลบหอพักนี้"}
    </button>
  );
}