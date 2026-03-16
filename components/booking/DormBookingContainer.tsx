"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Bed, Calendar, Phone, User, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { SectionWrapper } from "@/components/booking/SectionWrapper";
import { ExtendedRoom, RoomOptionCard } from "@/components/booking/RoomOptionCard";
import { BookingField } from "@/components/booking/BookingField";
import { FormError } from "@/components/ui/FormError";
import { RoomWithBookingRoommate } from "@/types/room";
import { calculateMatchScore } from "@/lib/matching";

interface DormBookingContainerProps {
    dorm: any;
    currentUser: any;
}

export function DormBookingContainer({ dorm, currentUser }: DormBookingContainerProps) {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    // 🟢 เอา currentUser ที่ได้จาก Server มาเป็นค่าเริ่มต้นเลยทันที!
    const [formData, setFormData] = useState({
        roomId: "",
        moveInDate: "",
        phone: "",
        contactName: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : ""
    });

    const handleNext = () => {
        const { roomId, moveInDate, phone, contactName } = formData;
        if (!roomId || !moveInDate || !phone || !contactName) {
            toast.error("กรุณากรอกข้อมูลให้ครบถ้วน");
            setError("กรุณากรอกข้อมูลให้ครบถ้วน");
            return;
        }
        const params = new URLSearchParams(formData);
        router.push(`./booking/confirm?${params.toString()}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-24 font-sans antialiased">
            {/* Header */}
            <header className="bg-white p-4 flex items-center border-b sticky top-0 z-20 shadow-sm">
                <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-all">
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-xl font-bold ml-2 text-gray-900 truncate">จองหอพัก - {dorm?.name}</h1>
            </header>

            <main className="max-w-xl mx-auto p-6 md:p-8 space-y-10">
                <div className="space-y-2">
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">ระบุรายละเอียดการจอง</h2>
                    <p className="text-sm text-gray-500 flex items-center gap-1.5"><MapPin size={16} /> {dorm?.locationShort}</p>
                </div>

                {/* ส่วนข้อมูลผู้จอง */}
                <SectionWrapper title="ข้อมูลนิสิตผู้จอง" icon={User}>
                    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-5">
                        <BookingField
                            label="ชื่อ-นามสกุล"
                            icon={User}
                            value={formData.contactName}
                            onChange={(e: any) => setFormData({ ...formData, contactName: e.target.value })}
                        />
                        <BookingField
                            label="เบอร์โทรศัพท์"
                            icon={Phone}
                            value={formData.phone}
                            onChange={(e: any) => setFormData({ ...formData, phone: e.target.value })}
                        />
                        <BookingField
                            label="วันที่เข้าอยู่"
                            icon={Calendar}
                            type="date"
                            value={formData.moveInDate}
                            onChange={(e: any) => setFormData({ ...formData, moveInDate: e.target.value })}
                        />
                    </div>
                </SectionWrapper>

                {/* ส่วนเลือกห้อง */}
                <SectionWrapper title="เลือกประเภทห้องพัก" icon={Bed}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {dorm?.rooms?.map((room: RoomWithBookingRoommate) => {
                            const roommateUser = room.bookings?.[0]?.user;

                            // 🟢 คำนวณ % MatchScore
                            const calculatedPercent = (currentUser && roommateUser)
                                ? calculateMatchScore(currentUser, roommateUser)
                                : 0;
                            
                            // 🟢 ประกอบร่าง Room
                            const extendedRoom: ExtendedRoom = {
                                ...room,
                                floor: room.floor,
                                existingRoommate: roommateUser ? {
                                    name: `${roommateUser.firstName} ${roommateUser.lastName}`,
                                    major: roommateUser.faculty || "นิสิต",
                                    matchPercent: calculatedPercent 
                                } : null
                            };

                            return (
                                <RoomOptionCard
                                    key={room.id}
                                    room={extendedRoom}
                                    isSelected={formData.roomId === room.id}
                                    onSelect={() => setFormData({ ...formData, roomId: room.id })}
                                    hasCompletedQuiz={currentUser?.hasCompletedQuiz ?? false}
                                />
                            );
                        })}
                    </div>
                </SectionWrapper>
            </main>

            {/* Footer Button */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t flex flex-col items-center gap-3 z-30">
                {error && <FormError message={error} />}
                <div className="max-w-xl w-full">
                    <Button
                        onClick={handleNext}
                        className="w-full h-16 text-lg font-black rounded-3xl bg-emerald-600 text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-[0.98]"
                    >
                        ยืนยันและไปหน้าชำระเงิน
                    </Button>
                </div>
            </div>
        </div>
    );
}