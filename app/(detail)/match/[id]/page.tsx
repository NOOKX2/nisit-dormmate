import { checkMatchStatus, UIMatchStatus } from "@/app/action/matching";
import { getRoommateReviews } from "@/app/action/roommate-review";
import { getUserById, fetchCurrentUser } from "@/app/action/user"; 
import RoommateProfileClient from "@/components/match/profile/RoommateProfileClient";
import { getAuthUser } from "@/lib/auth";
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
  const dbCurrentUser = await getAuthUser();



  const profileUser = await getUserById(targetUserId);

  if (!profileUser) {
    notFound();
  }

  let matchStatusResult: UIMatchStatus = 'NONE'; // ค่าเริ่มต้นสำหรับคนไม่ได้ล็อกอิน
  
  if (dbCurrentUser) {
    // ถ้าล็อกอินแล้ว ถึงจะส่ง id ไปเช็ค (รับรองว่าไม่ undefined แน่นอน)
    matchStatusResult = await checkMatchStatus(dbCurrentUser.id, profileUser.id);
  }

  // 🌟 ดึงข้อมูลรีวิวจาก Server ตรงนี้เลย!

  const reviewsResult = await getRoommateReviews(targetUserId);

  
  // แกะเอาเฉพาะข้อมูลรีวิว ถ้าพังหรือไม่มีให้ส่ง Array ว่าง [] ไปแทน
  const initialReviews = reviewsResult.success && reviewsResult.reviews ? reviewsResult.reviews : [];

  console.log(matchStatusResult);
  

  // โยนข้อมูลทั้งหมดไปให้หน้า Client
  return (
    <RoommateProfileClient 
      profileUser={profileUser} 
      currentUser={dbCurrentUser} 
      initialReviews={initialReviews} // 👈 ส่ง Prop ตัวใหม่นี้ไปครับ!
      initialMatchStatus={matchStatusResult}
    />
  );
}