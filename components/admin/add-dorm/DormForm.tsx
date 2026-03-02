"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createDormAction } from "@/app/action/dorm";
import { FormError } from "@/components/ui/FormError";
import { RoomManagement } from "./RoomManageMent";
import { PriceRangeCard } from "./PriceRangeCard";
import { DormInfoFields } from "./DormInFoDetail";
import { RoomGenerator } from "./RoomGenerator";

// --- Import Sub-components ---
export function DormForm() {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showGenerator, setShowGenerator] = useState(false); // 👈 เพิ่ม State เพื่อเปิด/ปิด Generator

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

    const handleBulkGenerate = (generatedRooms: any[]) => {
        // นำห้องที่สร้างใหม่ไป "ต่อท้าย" หรือ "แทนที่" ห้องเดิมที่มีอยู่
        setRooms((prev) => {
            // ถ้าห้องแรกว่างอยู่ ให้ลบทิ้งแล้วแทนที่เลย
            if (prev.length === 1 && prev[0].name === '') return generatedRooms;
            return [...prev, ...generatedRooms];
        });
        toast.success(`สร้างห้องพักจำนวน ${generatedRooms.length} ห้องสำเร็จ!`);
        setShowGenerator(false); // สร้างเสร็จแล้วปิดฟอร์มไป
    };

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

            <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                    <h3 className="text-lg font-bold text-gray-700">รายการห้องพัก</h3>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowGenerator(!showGenerator)}
                        className="rounded-2xl border-emerald-200 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 gap-2"
                    >
                        <Wand2 size={16} />
                        {showGenerator ? "ปิดเครื่องมือสร้าง" : "ใช้เครื่องมือสร้างห้องจำนวนมาก"}
                    </Button>
                </div>

                {showGenerator && (
                    <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                        <RoomGenerator
                            onGenerate={handleBulkGenerate}
                            initialConfig={{
                                price: 6000,       // ตั้งค่าเริ่มต้นให้แพงหน่อย
                                capacity: 2,       // หอนี้อยู่คู่
                                typeName: "ห้องแอร์พรีเมียม"
                            }} />
                    </div>
                )}
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