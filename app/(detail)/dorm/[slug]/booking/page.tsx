"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ChevronLeft, Bed, Calendar, Phone, User, Loader2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { getDormBySlug } from "@/app/action/dorm";

export default function DormBookingPage() {
    const router = useRouter();
    const { slug } = useParams();
    const { user, isLoading: authLoading } = useAuth();

    const [dorm, setDorm] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        roomId: "",
        moveInDate: "",
        phone: "",
        contactName: ""
    });

    // 1. Fetch ข้อมูลหอพักและห้องพักจาก Database
    useEffect(() => {
        async function init() {
            const data = await getDormBySlug(slug as string);
            if (data) {
                setDorm(data);
                // Pre-fill ชื่อจาก Auth Context
                if (user) setFormData(prev => ({ ...prev, contactName: user.name || "" }));
            }
            setLoading(false);
        }
        init();
    }, [slug, user]);

    const handleNext = () => {
        if (!formData.roomId || !formData.moveInDate || !formData.phone || !formData.contactName) {
            toast.error("กรุณากรอกข้อมูลให้ครบถ้วนและเลือกประเภทห้องพัก");
            return;
        }
        // ส่งข้อมูลต่อไปยังหน้า Confirm ผ่าน Query Params
        const params = new URLSearchParams({
            roomId: formData.roomId,
            moveInDate: formData.moveInDate,
            phone: formData.phone,
            contactName: formData.contactName
        });
        router.push(`/bookings/confirm?${params.toString()}`);
    };

    if (loading || authLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="animate-spin text-emerald-600" size={40} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-24 font-sans antialiased">
            {/* 🟢 Header Section */}
            <header className="bg-white p-4 flex items-center border-b sticky top-0 z-20 shadow-sm">
                <button
                    onClick={() => router.back()}
                    className="p-2 hover:bg-gray-100 rounded-full transition-all active:scale-90"
                >
                    <ChevronLeft size={24} className="text-gray-600" />
                </button>
                <h1 className="text-xl font-bold ml-2 text-gray-900 truncate">จองหอพัก - {dorm?.name}</h1>
            </header>

            <main className="max-w-xl mx-auto p-6 md:p-8 space-y-8">

                {/* หัวข้อและคำอธิบาย */}
                <div className="space-y-2">
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">ระบุรายละเอียดการจอง</h2>
                    <p className="text-sm text-gray-500 flex items-center gap-1.5 font-medium">
                        <MapPin size={16} className="text-emerald-500" />
                        {dorm?.locationShort || "พิกัดหอพักใกล้เคียง"}
                    </p>
                </div>

                {/* 🟢 1. เลือกประเภทห้องพัก (UI ใหม่แบบ Card) */}
                <section className="space-y-4">

                    <div className="grid gap-4">
                        {dorm?.rooms?.map((room: any) => (
                            <label
                                key={room.id}
                                className={`relative flex items-center justify-between p-6 bg-white border-2 rounded-3xl cursor-pointer transition-all duration-300 shadow-sm ${formData.roomId === room.id
                                        ? "border-emerald-500 ring-4 ring-emerald-50/50"
                                        : "border-gray-100 hover:border-emerald-200 hover:shadow-md"
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="room"
                                    className="absolute opacity-0"
                                    onChange={() => setFormData({ ...formData, roomId: room.id })}
                                    checked={formData.roomId === room.id}
                                />
                                <div className="flex items-center gap-4">
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${formData.roomId === room.id ? "border-emerald-500 bg-emerald-500" : "border-gray-300"
                                        }`}>
                                        {formData.roomId === room.id && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg text-gray-900">{room.name}</p>
                                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                                            {room.description || "ว่างพร้อมเข้าอยู่"}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-black text-emerald-600">฿{room.price.toLocaleString()}</p>
                                    <p className="text-[10px] font-bold text-gray-400">/ เดือน</p>
                                </div>
                            </label>
                        ))}
                    </div>
                </section>

                {/* 🟢 2. ข้อมูลนิสิตผู้จอง (Card สีขาวสะอาดตา) */}
                <section className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600 shadow-sm">
                            <Bed size={22} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">เลือกประเภทห้องพัก <span className="text-red-500">*</span></h3>
                    </div>

                    <div className="grid gap-4">
                        {/* 🟢 เช็คเงื่อนไข: ถ้ามีห้องพักให้ Map ออกมา แต่ถ้าไม่มีให้โชว์ Empty State */}
                        {dorm?.rooms && dorm.rooms.length > 0 ? (
                            dorm.rooms.map((room: any) => (
                                <label
                                    key={room.id}
                                    className={`relative flex items-center justify-between p-6 bg-white border-2 rounded-3xl cursor-pointer transition-all duration-300 shadow-sm ${formData.roomId === room.id
                                            ? "border-emerald-500 ring-4 ring-emerald-50/50"
                                            : "border-gray-100 hover:border-emerald-200 hover:shadow-md"
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="room"
                                        className="absolute opacity-0"
                                        onChange={() => setFormData({ ...formData, roomId: room.id })}
                                        checked={formData.roomId === room.id}
                                    />
                                    <div className="flex items-center gap-4">
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${formData.roomId === room.id ? "border-emerald-500 bg-emerald-500" : "border-gray-300"
                                            }`}>
                                            {formData.roomId === room.id && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-lg text-gray-900">{room.name}</p>
                                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                                                {room.description || "ว่างพร้อมเข้าอยู่"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-black text-emerald-600">฿{room.price.toLocaleString()}</p>
                                        <p className="text-[10px] font-bold text-gray-400">/ เดือน</p>
                                    </div>
                                </label>
                            ))
                        ) : (
                            /* 🔴 แสดงเมื่อไม่มีข้อมูลห้องพัก */
                            <div className="flex flex-col items-center justify-center p-12 bg-white border-2 border-dashed border-gray-200 rounded-3xl space-y-3">
                                <div className="p-4 bg-gray-50 rounded-full text-gray-300">
                                    <Bed size={40} />
                                </div>
                                <div className="text-center">
                                    <p className="text-lg font-bold text-gray-900">ยังไม่มีห้องพักเปิดจอง</p>
                                    <p className="text-sm text-gray-400">หอพักนี้ยังไม่ได้ลงข้อมูลประเภทห้องพักในระบบ</p>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                <p className="text-[11px] text-gray-400 text-center px-12 leading-relaxed font-medium">
                    ระบบจะพาคุณไปยังหน้ายืนยันยอดชำระเงินประกัน เพื่อล็อคห้องพักในราคาที่ระบุ <br />
                    กรุณาตรวจสอบข้อมูลให้ครบถ้วนก่อนดำเนินการต่อ
                </p>
            </main>

            {/* 🟢 Footer Button แบบ Sticky และ Backdrop blur */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 flex justify-center z-30 shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
                <div className="max-w-xl w-full">
                    <Button
                        onClick={handleNext}
                        className="w-full h-16 text-lg font-black rounded-3xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200 transition-all duration-200 active:scale-[0.97] hover:-translate-y-0.5"
                    >
                        ยืนยันและไปหน้าชำระเงิน
                    </Button>
                </div>
            </div>
        </div>
    );
}