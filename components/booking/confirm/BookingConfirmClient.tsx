"use client";

import { useState } from "react";
import { ChevronLeft, Info, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

import { processBookingAction } from "@/app/action/booking";
import { BookingSummary } from "@/components/booking/confirm/BookingSummary";
import { PaymentSelector } from "@/components/booking/confirm/PaymentSelector";
import { PriceDetails } from "@/components/booking/confirm/PriceDetails";
import { FormError } from "@/components/ui/FormError";
import { ContactInfo } from "@/components/booking/confirm/ContactInfo";

interface BookingConfirmClientProps {
    roomInfo: any;
    user: any;
    bookingParams: {
        contactName?: string;
        phone?: string;
        moveInDate?: string;
    };
}

export function BookingConfirmClient({ roomInfo, user, bookingParams }: BookingConfirmClientProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<null | string>(null);
    const [paymentMethod, setPaymentMethod] = useState<"bank" | "qr">("qr");

    const handleConfirm = async () => {
        setIsSubmitting(true);
        setError(null);

        try {
            const result = await processBookingAction({
                userId: user.id,
                roomId: roomInfo.roomId,
                dormId: roomInfo.dormId,
                customerName: bookingParams.contactName || `${user.firstName} ${user.lastName}` || "ไม่ระบุชื่อ",
                customerPhone: bookingParams.phone || "ไม่ระบุเบอร์",
            });

            if (result?.success === true && 'bookingId' in result) {
                toast.success("จองสำเร็จ! ห้องถูกล็อคให้คุณเรียบร้อย");
                router.push(`../booking/success?id=${result.bookingId}`);
                // รีเฟรชข้อมูลเบื้องหลัง
                router.refresh(); 
            } else if (result && 'error' in result) {
                setError(result?.error || "เกิดข้อผิดพลาด");
            }
        } catch (err: any) {
            setError(err.message || "เกิดข้อผิดพลาดในการจอง");
            toast.error(err.message || "เกิดข้อผิดพลาดในการจอง");
        } finally {
            setIsSubmitting(false);
        }
    };

    // คำนวณราคา
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
                    startDate={bookingParams.moveInDate || "ระบุภายหลัง"}
                />

                {/* 👤 ข้อมูลผู้ใช้งาน/ผู้ติดต่อ */}
                <ContactInfo
                    name={bookingParams.contactName || `${user.firstName} ${user.lastName}`}
                    phone={bookingParams.phone}
                    moveInDate={bookingParams.moveInDate}
                />

                <PriceDetails
                    price={roomInfo.price}
                    deposit={deposit}
                    serviceFee={roomInfo.serviceFee}
                    commonFee={roomInfo.dorm?.commonFee ?? 0}
                    electricRate={roomInfo.dorm?.electricRate}
                    waterRate={roomInfo.dorm?.waterRate}
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