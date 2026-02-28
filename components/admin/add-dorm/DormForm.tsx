"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, Building, MapPin, Bath, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { createDormAction } from "@/app/action/dorm";

export function DormForm() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    const result = await createDormAction(formData);
    
    if (result.success) {
      toast.success("บันทึกข้อมูลหอพักเรียบร้อยแล้ว");
      router.push("/admin");
      router.refresh();
    } else {
      toast.error(result.error || "เกิดข้อผิดพลาด");
      setIsPending(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="grid gap-6">
        {/* ชื่อหอพัก */}
        <div className="space-y-2">
          <label className="text-sm font-semibold flex items-center gap-2">
            <Building size={16} className="text-gray-400" /> ชื่อหอพัก
          </label>
          <Input name="name" placeholder="เช่น หอพักนิสิตอินเตอร์" required className="rounded-xl" />
        </div>

        {/* พิกัด/ที่ตั้ง */}
        <div className="space-y-2">
          <label className="text-sm font-semibold flex items-center gap-2">
            <MapPin size={16} className="text-gray-400" /> พิกัด (ซอย/ถนน)
          </label>
          <Input name="locationShort" placeholder="เช่น ซอยพหลโยธิน 45" required className="rounded-xl" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* ช่วงราคา */}
          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2">
              <Bath size={16} className="text-gray-400" /> ช่วงราคา (Text)
            </label>
            <Input name="priceRange" placeholder="เช่น 4,000 - 6,500" className="rounded-xl" />
          </div>
          {/* ราคาเริ่มต้น (ตัวเลขสำหรับ DB) */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">ราคาเริ่มต้น (บาท)</label>
            <Input name="basePrice" type="number" placeholder="4000" required className="rounded-xl" />
          </div>
        </div>

        {/* รูปภาพ */}
        <div className="space-y-2">
          <label className="text-sm font-semibold flex items-center gap-2">
            <ImageIcon size={16} className="text-gray-400" /> URL รูปภาพหน้าปก
          </label>
          <Input name="imageUrl" placeholder="https://images.unsplash.com/..." className="rounded-xl" />
        </div>

        {/* รายละเอียด */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">รายละเอียดเพิ่มเติม</label>
          <Textarea name="description" placeholder="บรรยายจุดเด่นของหอพัก..." rows={4} className="rounded-xl" />
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={isPending}
        className="w-full py-6 text-lg bg-gray-900 hover:bg-black text-white rounded-2xl transition-all active:scale-[0.98]"
      >
        {isPending ? (
          <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> กำลังบันทึก...</>
        ) : (
          "ยืนยันการเพิ่มหอพัก"
        )}
      </Button>
    </form>
  );
}