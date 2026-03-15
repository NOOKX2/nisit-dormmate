"use client";

import { useEffect, useState, use } from "react";
import { ChevronLeft, CloudCog, Info, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

import { processBookingAction, getRoomDetails } from "@/app/action/booking";
import { BookingSummary } from "@/components/booking/confirm/BookingSummary";
import { PaymentSelector } from "@/components/booking/confirm/PaymentSelector";
import { PriceDetails } from "@/components/booking/confirm/PriceDetails";
import { FormError } from "@/components/ui/FormError";
import { ContactInfo } from "@/components/booking/confirm/ContactInfo";

interface PageProps {
    searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default function BookingConfirmPage({ searchParams }: PageProps) {
    const router = useRouter();
    const { user } = useAuth();
    const params = use(searchParams);

    const [roomInfo, setRoomInfo] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<null | string>(null);
    const [paymentMethod, setPaymentMethod] = useState<"bank" | "qr">("qr");

    useEffect(() => {
        async function init() {
            if (!params.roomId) {
                toast.error("ข้อมูลห้องพักไม่ถูกต้อง");
                return;
            }
            const data = await getRoomDetails(params.roomId);
            if (data) {
                setRoomInfo(data);
            } else {
                toast.error("ไม่พบข้อมูลห้องพัก");
            }
            setLoading(false);
        }
        init();
    }, [params.roomId]);

    // 🟢 1. ถอดพารามิเตอร์ e (Event) ออกไปเลย เพราะเราไม่ใช้ Form แล้ว
    const handleConfirm = async () => {
        if (!user) {
            toast.error("กรุณาเข้าสู่ระบบก่อนทำรายการ");
            setError('ไม่พบผู้ใช้งาน');
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await processBookingAction({
                userId: user.id,
                roomId: roomInfo.roomId,
                dormId: roomInfo.dormId,
                customerName: params.contactName || `${user.firstName} ${user.lastName}` || "ไม่ระบุชื่อ",
                customerPhone: params.phone || "ไม่ระบุเบอร์",
            });

            if (result?.success === true && 'bookingId' in result) {
                toast.success("จองสำเร็จ! ห้องถูกล็อคให้คุณเรียบร้อย");
                router.push(`../booking/success?id=${result.bookingId}`);
                router.refresh();
            } else if (result && 'error' in result) {
                setError(result?.error)
            }
        } catch (error: any) {
            setError(error);
            toast.error(error.message || "เกิดข้อผิดพลาดในการจอง");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="animate-spin text-gray-400" size={32} />
        </div>
    );

    const deposit = roomInfo.price * 2;
    const total = roomInfo.price + deposit + roomInfo.serviceFee;

    return (
        <div className="min-h-screen bg-gray-50 pb-32 font-sans antialiased">
            <header className="bg-white p-4 flex items-center border-b sticky top-0 z-20">
                <button type="button" onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-all">
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-lg font-bold ml-2">ยืนยันการจอง</h1>
            </header>

            <main className="max-w-xl mx-auto p-4 space-y-4 text-gray-900">
                {/* 🏠 ข้อมูลหอพัก */}
                <BookingSummary
                    name={roomInfo.dormName}
                    location={roomInfo.location}
                    roomType={roomInfo.roomType}
                    contract="1 ปี"
                    startDate={params.moveInDate || "ระบุภายหลัง"}
                />

                {/* 👤 ส่วนที่เพิ่มใหม่: ข้อมูลผู้ใช้งาน/ผู้ติดต่อ */}
                <ContactInfo
                    name={params.contactName || (user ? `${user.firstName} ${user.lastName}` : "")}
                    phone={params.phone}
                    moveInDate={params.moveInDate}
                />

                <PriceDetails
                    price={roomInfo.price}
                    deposit={deposit}
                    serviceFee={roomInfo.serviceFee}
                    commonFee={roomInfo.dorm?.commonFee ?? 0}

                    // 🟢 ดึงค่าจริงจาก DB ถ้าเป็น 0 ให้ขึ้นว่า "ฟรี" ถ้าไม่มีให้โชว์ "-"
                    electricRate={
                        roomInfo.dorm.electricRate
                    }
                    waterRate={
                        roomInfo.dorm.waterRate
                    }
                    // (สมมติว่าขั้นต่ำตั้งไว้ 100 ถ้าใน DB มีฟิลด์นี้ก็ดึงมาใส่แทนได้ครับ)
                    waterMinimum={100}
                />

                <PaymentSelector
                    method={paymentMethod}
                    setMethod={setPaymentMethod}
                />

                <footer className="flex items-start gap-2 p-2 text-[10px] text-gray-400 italic leading-relaxed">
                    <Info size={14} className="shrink-0 text-emerald-500" />
                    <p>กรุณาตรวจสอบข้อมูลชื่อและเบอร์โทรศัพท์ให้ถูกต้อง เพื่อให้เจ้าหน้าที่หอพักสามารถติดต่อท่านได้ในการทำสัญญา</p>
                </footer>
            </main>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-gray-100 flex flex-col items-center z-30 gap-3">
                {error && <FormError message={error} />}
                <div className="max-w-xl w-full">
                    {/* 🟢 3. เพิ่ม onClick และเปลี่ยน type="button" เพื่อไม่ให้มันเผลอไป Submit อะไรอีก */}
                    <Button
                        type="button"
                        onClick={handleConfirm}
                        disabled={isSubmitting}
                        className="w-full py-8 text-xl font-black rounded-[2rem] bg-gray-900 hover:bg-black shadow-xl transition-all active:scale-95 disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="animate-spin" size={20} /> กำลังล็อคห้องพัก...
                            </span>
                        ) : (
                            `ชำระเงิน ฿${total.toLocaleString()}`
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}