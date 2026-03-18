import { getRoommateReviews } from "@/app/action/roommate-review";
import { getUserById, fetchCurrentUser } from "@/app/action/user"; 
import RoommateProfileClient from "@/components/match/profile/RoommateProfileClient";
import { notFound } from "next/navigation";

export default async function RoommateProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const targetUserId = resolvedParams.id;

  if (!targetUserId) {
    notFound();
  }

  // ดึงข้อมูล User (ทำงานบน Server)
  const dbCurrentUser = await fetchCurrentUser();
  const profileUser = await getUserById(targetUserId);

  if (!profileUser) {
    notFound();
  }

  // 🌟 ดึงข้อมูลรีวิวจาก Server ตรงนี้เลย!
  const reviewsResult = await getRoommateReviews(targetUserId);

  console.log(reviewsResult);
  
  // แกะเอาเฉพาะข้อมูลรีวิว ถ้าพังหรือไม่มีให้ส่ง Array ว่าง [] ไปแทน
  const initialReviews = reviewsResult.success && reviewsResult.reviews ? reviewsResult.reviews : [];

  console.log(initialReviews);

  // โยนข้อมูลทั้งหมดไปให้หน้า Client
  return (
    <RoommateProfileClient 
      profileUser={profileUser} 
      currentUser={dbCurrentUser} 
      initialReviews={initialReviews} // 👈 ส่ง Prop ตัวใหม่นี้ไปครับ!
    />
  );
}