"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createDormAction } from "@/app/action/dorm";
import { uploadDormImageToR2 } from "@/lib/uploadDormImageClient";
import { FormError } from "@/components/ui/FormError";

import { DormInfoFields } from "./DormInfoFields";

import { DormUtilityFields } from "../../dorm/[slug]/_components/DormUtilityFields";
import { DormAmenitiesFields } from "../../dorm/[slug]/_components/DormAmenitiesFields";
import { MapPicker } from "./MapPicker";
import { RoomGenerator } from "./RoomGenerator";
import { RoomManagement } from "./RoomManageMent";

export function DormForm() {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showGenerator, setShowGenerator] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        locationShort: "",
        address: "",
        imageUrl: "",
        description: "",
        electricRate: "",
        waterRate: "",
        commonFee: "",
        lat: 13.84786,
        lng: 100.56965,
    });

    const [rooms, setRooms] = useState([
        { name: '', price: '', description: '' }
    ]);

    const [amenities, setAmenities] = useState<string[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

        let imageUrl = formData.imageUrl;
        if (selectedFile) {
            try {
                imageUrl = await uploadDormImageToR2(selectedFile);
            } catch (err) {
                console.error(err);
                const message =
                    err instanceof Error ? err.message : "อัปโหลดรูปไม่สำเร็จ";
                setError(message);
                toast.error(message);
                setIsPending(false);
                return;
            }
        }

        const data = new FormData();
        const payload = { ...formData, imageUrl };
        // 🟢 แปลง value เป็น String ก่อนยัดลง FormData ป้องกัน Error ตัวเลขพิกัด
        Object.entries(payload).forEach(([key, value]) => data.append(key, String(value)));

        const validPrices = rooms
            .map(room => parseFloat(room.price))
            .filter(price => !isNaN(price));

        const calculatedMinPrice = validPrices.length > 0 ? Math.min(...validPrices) : 0;
        const calculatedMaxPrice = validPrices.length > 0 ? Math.max(...validPrices) : 0;

        data.append("minPrice", calculatedMinPrice.toString());
        data.append("maxPrice", calculatedMaxPrice.toString());
        data.append("basePrice", calculatedMinPrice.toString());

        data.append("rooms", JSON.stringify(rooms));
        data.append("amenities", JSON.stringify(amenities));

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
                <DormInfoFields
                    formData={formData}
                    onChange={handleChange}
                    onFileSelect={(file) => setSelectedFile(file)}
                />

                {/* 2. ตำแหน่งที่ตั้งและแผนที่ */}
                <div className="space-y-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800">ตำแหน่งที่ตั้งหอพัก</h3>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">ที่อยู่แบบเต็ม (Address)</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="เช่น 123 ซ.งามวงศ์วาน 52 เขตจตุจักร กรุงเทพฯ"
                            className="w-full p-3 border border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-emerald-500 transition-colors"
                        />
                    </div>

                    <MapPicker
                        lat={formData.lat}
                        lng={formData.lng}
                        onChange={(newLat, newLng) => {
                            setFormData(prev => ({ ...prev, lat: newLat, lng: newLng }));
                        }}
                    />
                </div>

                {/* 3. สิ่งอำนวยความสะดวก */}
                <DormAmenitiesFields value={amenities} onChange={setAmenities} />

                {/* 4. ค่าใช้จ่ายเพิ่มเติม */}
                <DormUtilityFields
                    formData={{
                        electricRate: formData.electricRate,
                        waterRate: formData.waterRate,
                        commonFee: formData.commonFee,
                    }}
                    onChange={handleChange}
                />
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-100">
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

            {/* ส่วนจัดการห้องพัก (Dynamic) */}
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