"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateDormBaseInfo } from "@/app/action/dorm";
import { toast } from "sonner";
import { DormImageSection } from "./DormImageSection";
import { FormInput } from "./FormInput";
import { FormActions } from "./FormAction";

interface EditDormFormProps {
  dorm: any;
}

export function EditDormForm({ dorm }: EditDormFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: dorm.name || "",
    locationShort: dorm.locationShort || "",
    imageUrl: dorm.imageUrl || "",
    electricRate: dorm.electricRate || 0,
    waterRate: dorm.waterRate || 0,
    commonFee: dorm.commonFee || 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const parsedValue = ["electricRate", "waterRate", "commonFee"].includes(name) 
      ? Number(value) 
      : value;
    setFormData((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = await updateDormBaseInfo(dorm.id, formData);

    if (result.success) {
      toast.success("บันทึกข้อมูลสำเร็จ!");
      router.push(`/admin/dorm/${result.slug}`);
      router.refresh();
    } else {
      toast.error(result.error || "เกิดข้อผิดพลาด");
    }
    
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6 overflow-hidden">
      
      {/* 🖼️ ส่วนจัดการรูปภาพ */}
      <DormImageSection imageUrl={formData.imageUrl} onChange={handleChange} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {/* 📝 ช่องกรอกข้อมูล */}
        <FormInput 
          label="ชื่อหอพัก" name="name" type="text" required
          value={formData.name} onChange={handleChange} 
          containerClassName="md:col-span-2"
        />
        
        <FormInput 
          label="พิกัด / โซน (แบบสั้น)" name="locationShort" type="text" required
          value={formData.locationShort} onChange={handleChange} 
          placeholder="เช่น ซอยตั้งสิน, หน้ามอ, หลังมอ"
          containerClassName="md:col-span-2"
        />

        <FormInput 
          label="ค่าไฟ (บาท/หน่วย)" name="electricRate" type="number" required min="0" step="0.1"
          value={formData.electricRate} onChange={handleChange} 
        />

        <FormInput 
          label="ค่าน้ำ (บาท/หน่วย)" name="waterRate" type="number" required min="0" step="0.1"
          value={formData.waterRate} onChange={handleChange} 
        />

        <FormInput 
          label="ค่าส่วนกลาง (บาท/เดือน)" name="commonFee" type="number" required min="0"
          value={formData.commonFee} onChange={handleChange} 
          placeholder="หากไม่มีให้ใส่ 0"
        />
      </div>

      <FormActions isSubmitting={isSubmitting} onCancel={() => router.back()} />
      
    </form>
  );
}