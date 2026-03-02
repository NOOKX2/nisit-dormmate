"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createDormAction } from "@/app/action/dorm";
import { FormError } from "@/components/ui/FormError";
import { RoomManagement } from "./RoomManageMent";
import { PriceRangeCard } from "./PriceRangeCard";
import { DormInfoFields } from "./DormInFoDetail";

// --- Import Sub-components ---
export function DormForm() {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 🟢 State หลักสำหรับหอพัก
    const [formData, setFormData] = useState({
        name: "",
        locationShort: "",
        minPrice: "",
        maxPrice: "",
        basePrice: "",
        imageUrl: "",
        description: ""
    });

    // 🟢 State สำหรับจัดการห้องพัก (Array)
    const [rooms, setRooms] = useState([
        { name: '', price: '', description: '' }
    ]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsPending(true);
        setError(null);

        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => data.append(key, value));
        data.append("rooms", JSON.stringify(rooms));

        const result = await createDormAction(data);

        if (result?.success) {
            toast.success("บันทึกข้อมูลเรียบร้อยแล้ว");
            router.push("/admin");
            router.refresh();
        } else if (result?.error) {
            setError(result.error);
            toast.error(result.error);
            setIsPending(false);
        }
    }

    return (
        <form onSubmit={onSubmit} className="space-y-8 pb-10">
            <FormError message={error} />

            <div className="grid gap-6">
                {/* 1. ส่วนข้อมูลหอพักพื้นฐาน */}
                <DormInfoFields formData={formData} onChange={handleChange} />

                {/* 2. ส่วนช่วงราคา (Grid) */}
                <PriceRangeCard 
                    minPrice={formData.minPrice} 
                    maxPrice={formData.maxPrice} 
                    onChange={handleChange} 
                />
            </div>

            {/* 3. ส่วนจัดการห้องพัก (Dynamic) */}
            <RoomManagement rooms={rooms} setRooms={setRooms} />

            {/* --- ปุ่ม Submit --- */}
            <Button
                type="submit"
                disabled={isPending}
                className="w-full py-8 text-xl font-black bg-emerald-600 hover:bg-emerald-700 text-white rounded-[2rem] transition-all shadow-xl shadow-emerald-200/50 active:scale-[0.98] mt-10"
            >
                {isPending ? (
                    <><Loader2 className="mr-2 h-6 w-6 animate-spin" /> กำลังบันทึกข้อมูล...</>
                ) : (
                    "ยืนยันการเพิ่มหอพัก"
                )}
            </Button>
        </form>
    );
}