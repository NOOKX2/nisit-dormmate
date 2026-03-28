import { redirect } from "next/navigation";
import { getRoomDetails } from "@/app/action/room";
import { getAuthUser } from "@/lib/auth";
import { BookingConfirmClient } from "@/app/(detail)/dorm/[slug]/booking/confirm/_components/BookingConfirmClient";

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
    const user = await getAuthUser();
    if (!user) redirect("/login");

    const roomInfo = await getRoomDetails(params.roomId, user.id);

    // 3. ตรวจสอบความถูกต้องของข้อมูล
    if (!roomInfo) redirect("/");

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