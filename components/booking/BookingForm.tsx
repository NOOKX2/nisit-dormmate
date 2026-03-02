"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // 🟢 เพิ่ม Input
import { Loader2, User, Phone } from "lucide-react"; // 🟢 เพิ่ม Icon
import { BookingSummary } from "@/components/booking/BookingSummary";
import { PaymentSelector } from "@/components/booking/PaymentSelector";
import { PriceDetails } from "@/components/booking/PriceDetails";
import { processBookingAction } from "@/app/action/booking";
import { getAuthUser } from "@/lib/auth";

interface BookingFormProps {
    bookingData: {
        dormId: string;   
        roomId: string;
        dormName: string;
        location: string;
        roomType: string;
        contract: string;
        startDate: string;
        price: number;
        deposit: number;
        serviceFee: number;
    }
}

export function BookingForm({ bookingData }: BookingFormProps) {
    const user = getAuthUser;
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<"bank" | "qr">("qr");

    // 🟢 State สำหรับฟอร์มผู้จอง
    const [customerInfo, setCustomerInfo] = useState({
        name: "",
        phone: ""
    });

    const handleConfirm = async () => {
        // Validation เบื้องต้น
        if (!customerInfo.name || !customerInfo.phone) {
            toast.error("กรุณากรอกข้อมูลผู้จองให้ครบถ้วน");
            return;
        }

        setIsPending(true);
        toast.info("กำลังประมวลผลการจอง...");


    }
}