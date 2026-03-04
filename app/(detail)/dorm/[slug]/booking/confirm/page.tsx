"use client";

import { useEffect, useState, use } from "react";
import { ChevronLeft, Info, Loader2, User, Phone, Calendar } from "lucide-react"; // เพิ่ม Icon
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

import { processBookingAction, getRoomDetails } from "@/app/action/booking";
import { BookingSummary } from "@/components/booking/confirm/BookingSummary";
import { PaymentSelector } from "@/components/booking/confirm/PaymentSelector";
import { PriceDetails } from "@/components/booking/confirm/PriceDetails";
import { FormError } from "@/components/ui/FormError";
import Link from "next/link";

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

    const handleConfirm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('booking before user');

        if (!user) {
            console.log('no user');
            toast.error("กรุณาเข้าสู่ระบบก่อนทำรายการ");
            setError('ไม่พบผู้ใช้งาน');
            return;
        }

        console.log('booking after user');

        setIsSubmitting(true);
        console.log('booking before process');

        try {
            console.log('booking processs');
            const result = await processBookingAction({
                userId: user.id,
                roomId: roomInfo.roomId,
                dormId: roomInfo.dormId,
                customerName: params.contactName || user.name || "ไม่ระบุชื่อ",
                customerPhone: params.phone || "ไม่ระบุเบอร์",
            });

            if (result?.success === true && 'bookingId' in result) {
                console.log("booking success");
                toast.success("จองสำเร็จ! ห้องถูกล็อคให้คุณเรียบร้อย");
                router.push(`../booking/success?id=${result.bookingId}`);
                router.refresh();
            } else if (result && 'error' in result) {
                setError(result?.error)
            }
        } catch (error: any) {
            console.log("booking success");
            setError(error);
            toast.error(error.message || "เกิดข้อผิดพลาดในการจอง");
        } finally {
            setIsSubmitting(false);
        }
    };

    console.log(`error ${error}`);

    if (loading) return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="animate-spin text-gray-400" size={32} />
        </div>
    );

    const deposit = roomInfo.price * 2;
    const total = roomInfo.price + deposit + roomInfo.serviceFee;

    return (
        <form onSubmit={handleConfirm}>
            <div className="min-h-screen bg-gray-50 pb-32 font-sans antialiased">
                <header className="bg-white p-4 flex items-center border-b sticky top-0 z-20">
                    <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-all">
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
                    <section className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-2 bg-emerald-50 rounded-full text-emerald-600">
                                <User size={18} />
                            </div>
                            <h3 className="font-bold">ข้อมูลผู้ติดต่อ</h3>
                        </div>

                        <div className="grid grid-cols-1 gap-4 text-sm">
                            <div className="flex items-center justify-between py-1 border-b border-gray-50">
                                <span className="text-gray-500">ชื่อ-นามสกุล</span>
                                <span className="font-semibold">{params.contactName || user?.name || "-"}</span>
                            </div>
                            <div className="flex items-center justify-between py-1 border-b border-gray-50">
                                <span className="text-gray-500">เบอร์โทรศัพท์</span>
                                <span className="font-semibold">{params.phone || "-"}</span>
                            </div>
                            <div className="flex items-center justify-between py-1">
                                <span className="text-gray-500">วันที่คาดว่าจะเข้าอยู่</span>
                                <div className="flex items-center gap-1.5 font-semibold text-emerald-600">
                                    <Calendar size={14} />
                                    <span>{params.moveInDate || "-"}</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    <PriceDetails
                        price={roomInfo.price}
                        deposit={deposit}
                        serviceFee={roomInfo.serviceFee}
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
                                type="submit"
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
        </form>
    );
}