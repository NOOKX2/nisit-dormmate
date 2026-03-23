import { getAuthUser } from "@/lib/auth";
import { NotificationClient } from "./_components/NotificationClient";
import { redirect } from "next/navigation";
import { getNotificationMatchRequests } from "@/app/action/matching";

export default async function NotificationsPage() {
  const currentUser = await getAuthUser();
  
  if (!currentUser) {
    redirect("/login");
  }

  // 🌟 ดึงข้อมูลมา แต่คราวนี้เรา "หยิบมาใช้แค่ received" อย่างเดียวครับ
  const { received } = await getNotificationMatchRequests(currentUser.id);

  return (
    // ส่งข้อมูลลงไปให้ Client Component หน้าตาคลีนๆ
    <NotificationClient receivedRequests={received} />
  );
}