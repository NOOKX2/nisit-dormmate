import { redirect } from "next/navigation";
import { getRoomDetails } from "@/app/action/room";
import { getAuthUser } from "@/lib/auth"; 
import { BookingConfirmClient } from "@/components/booking/confirm/BookingConfirmClient";

interface PageProps {
    searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function BookingConfirmPage({ searchParams }: PageProps) {
    // 1. แกะค่าจาก URL (Search Params)
    const params = await searchParams;
    
    if (!params.roomId) {
        redirect("/"); // ถ้าไม่มี roomId ให้เด้งกลับหน้าหลัก
    }

    // 2. ดึงข้อมูลห้องพักและ User พร้อมกัน (ประหยัดเวลาโหลด)
    const [roomInfo, user] = await Promise.all([
        getRoomDetails(params.roomId),
        getAuthUser(),
    ]);

    // 3. ตรวจสอบความถูกต้องของข้อมูล
    if (!roomInfo) redirect("/");
    if (!user) redirect("/login"); // ถ้าไม่ได้ล็อกอิน เด้งไปหน้า login

    return (
        // 4. โยนข้อมูลที่ดึงเสร็จแล้วไปให้ Client วาดหน้าจอ
        <BookingConfirmClient 
            roomInfo={roomInfo} 
            user={user} 
            bookingParams={{
                contactName: params.contactName,
                phone: params.phone,
                moveInDate: params.moveInDate
            }} 
        />
    );
}