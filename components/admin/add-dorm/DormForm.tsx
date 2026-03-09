"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createDormAction } from "@/app/action/dorm";
import { FormError } from "@/components/ui/FormError";
import { RoomManagement } from "./RoomManageMent";
// ลบ import PriceRangeCard ออกได้เลยครับ
import { DormInfoFields } from "./DormInfoDetail";
import { RoomGenerator } from "./RoomGenerator";

export function DormForm() {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showGenerator, setShowGenerator] = useState(false);

    // 🟢 1. เอาฟิลด์ราคาออกจาก State เพราะเราจะไม่ให้ Admin กรอกเองแล้ว
    const [formData, setFormData] = useState({
        name: "",
        locationShort: "",
        imageUrl: "",
        description: ""
    });

    const [rooms, setRooms] = useState([
        { name: '', price: '', description: '' }
    ]);

    const handleBulkGenerate = (generatedRooms: any[]) => {
        setRooms((prev) => {
            if (prev.length === 1 && prev[0].name === '') return generatedRooms;
            return [...prev, ...generatedRooms];
        });
        toast.success(`สร้างห้องพักจำนวน ${generatedRooms.length} ห้องสำเร็จ!`);
        setShowGenerator(false);
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

        // 🟢 2. Logic คำนวณราคา Min / Max อัตโนมัติจากห้องพัก
        // กรองเฉพาะห้องที่มีการกรอกราคาแล้ว และแปลงเป็นตัวเลข
        const validPrices = rooms
            .map(room => parseFloat(room.price))
            .filter(price => !isNaN(price));

        // ถ้ามีราคาห้องพักอย่างน้อย 1 ห้อง ให้หาค่าน้อยสุดและมากสุด
        const calculatedMinPrice = validPrices.length > 0 ? Math.min(...validPrices) : 0;
        const calculatedMaxPrice = validPrices.length > 0 ? Math.max(...validPrices) : 0;

        // แนบค่าที่คำนวณได้ ส่งไปให้ Backend สบายๆ
        data.append("minPrice", calculatedMinPrice.toString());
        data.append("maxPrice", calculatedMaxPrice.toString());
        data.append("basePrice", calculatedMinPrice.toString()); // ตั้งค่า Base Price ให้เท่ากับราคาเริ่มต้นไปเลย
        
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
                
                {/* 🟢 3. ลบ Component PriceRangeCard ออกไปเลย UI จะได้คลีนๆ */}
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
                                price: 6000,
                                capacity: 2,
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