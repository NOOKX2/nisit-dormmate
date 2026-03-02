"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, Building, MapPin, Bath, Image as ImageIcon, Banknote } from "lucide-react";
import { useState } from "react";
import { createDormAction } from "@/app/action/dorm";
import { FormError } from "@/components/ui/FormError";

export function DormForm() {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 🟢 สร้าง State สำหรับเก็บค่าแต่ละ Input
    const [formData, setFormData] = useState({
        name: "",
        locationShort: "",
        minPrice: "",
        maxPrice: "",
        basePrice: "",
        imageUrl: "",
        description: ""
    });

    // Function สำหรับจัดการการเปลี่ยนแปลงค่าใน Input
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault(); // ป้องกันการ reload หน้าจอ
        setIsPending(true);
        setError(null);

        // สร้าง FormData object จาก state
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            data.append(key, value);
        });

        const result = await createDormAction(data);

        if (result?.success) {
            toast.success("บันทึกข้อมูลหอพักเรียบร้อยแล้ว");
            router.push("/admin");
            router.refresh();
        } else if (result?.error) {
            setError(result.error);
            toast.error(result.error);
            setIsPending(false);
        }
    }

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <FormError message={error} />
            
            <div className="grid gap-6">
                {/* ชื่อหอพัก */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold flex items-center gap-2">
                        <Building size={16} className="text-gray-400" /> ชื่อหอพัก
                    </label>
                    <Input 
                        name="name" 
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="เช่น หอพักนิสิตอินเตอร์" 
                        required 
                        className="rounded-xl" 
                    />
                </div>

                {/* พิกัด/ที่ตั้ง */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold flex items-center gap-2">
                        <MapPin size={16} className="text-gray-400" /> พิกัด (ซอย/ถนน)
                    </label>
                    <Input 
                        name="locationShort" 
                        value={formData.locationShort}
                        onChange={handleChange}
                        placeholder="เช่น ซอยพหลโยธิน 45" 
                        required 
                        className="rounded-xl" 
                    />
                </div>

                {/* Price Range */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold flex items-center gap-2 text-emerald-700">
                            <Banknote size={16} /> ราคาเริ่มต้น (Min)
                        </label>
                        <Input
                            name="minPrice"
                            type="number"
                            value={formData.minPrice}
                            onChange={handleChange}
                            placeholder="4000"
                            required
                            className="rounded-xl border-emerald-200 focus-visible:ring-emerald-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold flex items-center gap-2 text-emerald-700">
                            <Banknote size={16} />ราคาสูงสุด (Max)
                        </label>
                        <Input
                            name="maxPrice"
                            type="number"
                            value={formData.maxPrice}
                            onChange={handleChange}
                            placeholder="8500"
                            required
                            className="rounded-xl border-emerald-200 focus-visible:ring-emerald-500"
                        />
                    </div>
                </div>

                {/* ราคาห้องมาตรฐาน */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold flex items-center gap-2">
                        <Bath size={16} className="text-gray-400" /> ราคาห้องมาตรฐาน
                    </label>
                    <Input 
                        name="basePrice" 
                        type="number" 
                        value={formData.basePrice}
                        onChange={handleChange}
                        placeholder="4500" 
                        required 
                        className="rounded-xl" 
                    />
                </div>

                {/* รูปภาพ */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold flex items-center gap-2">
                        <ImageIcon size={16} className="text-gray-400" /> URL รูปภาพหน้าปก
                    </label>
                    <Input 
                        name="imageUrl" 
                        value={formData.imageUrl}
                        onChange={handleChange}
                        placeholder="https://..." 
                        className="rounded-xl" 
                    />
                </div>

                {/* รายละเอียด */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold">รายละเอียดเพิ่มเติม</label>
                    <Textarea 
                        name="description" 
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="บรรยายจุดเด่นของหอพัก..." 
                        rows={4} 
                        className="rounded-xl" 
                    />
                </div>
            </div>

            <Button
                type="submit"
                disabled={isPending}
                className="w-full py-6 text-lg bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl transition-all shadow-lg shadow-emerald-100 active:scale-[0.98]"
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