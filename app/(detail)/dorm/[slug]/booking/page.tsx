import { DormBookingContainer } from "@/app/(detail)/admin/dorm/[slug]/bookings/_components/DormBookingContainer";
import { getDormBySlug } from "@/app/action/dorm";
import { fetchCurrentUser } from "@/app/action/user";
import { redirect } from "next/navigation";

export default async function DormBookingPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);

    // 🟢 ดึงข้อมูลสดๆ จาก Server (เร็วและไม่เกิดจอขาว)
    const [dorm, currentUser] = await Promise.all([
        getDormBySlug(decodedSlug),
        fetchCurrentUser(),
    ]);

    // ถ้าไม่เจอหอพัก ให้เด้งกลับหน้าหลัก
    if (!dorm) {
        redirect("/");
    }

    return (
        // ส่งข้อมูลที่ดึงเสร็จแล้ว ไปให้ฝั่ง Client จัดการต่อ
        <DormBookingContainer dorm={dorm} currentUser={currentUser} />
    );
}