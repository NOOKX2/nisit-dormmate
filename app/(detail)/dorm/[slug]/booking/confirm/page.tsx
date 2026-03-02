"use client";

import { useState } from "react";
import { ChevronLeft, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

import { BookingSummary } from "@/components/booking/BookingSummary";

import { PaymentSelector } from "@/components/booking/PaymentSelector";
import { PriceDetails } from "@/components/booking/PriceDetails";

export default function BookingConfirmPage() {
    const router = useRouter();
    const [paymentMethod, setPaymentMethod] = useState<"bank" | "qr">("qr");

    const bookingData = {
        dormName: "หอพักกรีนวิว",
        location: "ซอยพหลโยธิน 45",
        roomType: "ห้องแอร์ เตียงคู่ (2 คน)",
        contract: "1 ปี",
        startDate: "1 มิถุนายน 2026",
        price: 3500,
        deposit: 7000,
        serviceFee: 300,
    };

    const handleConfirm = () => {
        toast.success("กำลังส่งข้อมูลการจอง...");
        setTimeout(() => router.push("/bookings/success"), 1500);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-32">
            <header className="bg-white p-4 flex items-center border-b sticky top-0 z-20">
                <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full">
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-lg font-bold ml-2">ยืนยันการจอง</h1>
            </header>

            <main className="max-w-xl mx-auto p-4 space-y-4">
                <BookingSummary
                    name={bookingData.dormName}
                    location={bookingData.location}
                    roomType={bookingData.roomType}
                    contract={bookingData.contract}
                    startDate={bookingData.startDate}
                />

                <PriceDetails
                    price={bookingData.price}
                    deposit={bookingData.deposit}
                    serviceFee={bookingData.serviceFee}
                />

                <PaymentSelector
                    method={paymentMethod}
                    setMethod={setPaymentMethod}
                />

                <footer className="flex items-start gap-2 p-2 text-[10px] text-gray-400">
                    <Info size={14} className="shrink-0" />
                    <p>การกดจองหมายถึงคุณยอมรับเงื่อนไขการเช่าพักอาศัยเบื้องต้นของหอพัก</p>
                </footer>
            </main>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex justify-center z-30">
                <div className="max-w-xl w-full">
                    <Button onClick={handleConfirm} className="w-full py-6 text-lg font-bold rounded-2xl bg-gray-900 hover:bg-black">
                        ชำระเงินและยืนยันการจอง
                    </Button>
                </div>
            </div>
        </div>
    );
}