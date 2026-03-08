"use server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";

export async function updateUserProfile(userId: string, formData: FormData) {
  const name = formData.get("name") as string;
  const faculty = formData.get("faculty") as string;
  const year = parseInt(formData.get("year") as string);
  const cleanliness = (formData.get("cleanliness") as string);
  const sleepHabit = formData.get("sleepHabit") as string;
  const smoking = formData.get("smoking") === "true";

  await prisma.user.update({
    where: { id: userId },
    data: {
      name,
      faculty,
      year,
      cleanliness,
      sleepHabit,
      smoking,
    },
  });

  revalidatePath("/profile");
  redirect("/profile");
}

export async function getQuizUser() {
  const user = await getAuthUser();
  return user;
}

// @/app/action/profile.ts

export async function completeQuiz(userId: string, answers: Record<string, string>) {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        // อัปเดตข้อมูล Lifestyle จาก Quiz
        study_time: answers.study_time,
        location: answers.location,
        guest_policy: answers.guest_policy,
        cleanliness: answers.cleanliness,
        air_con: answers.air_con,
        // แปลง 'yes' เป็น true, 'no' เป็น false สำหรับ Boolean
        smoking: answers.smoking === 'yes', 
        
        // ฟิลด์ sleepHabit (ถ้าต้องการใช้ค่าเดียวกับ study_time หรือแยก)
        sleepHabit: answers.study_time, 

        // ยืนยันว่าทำ Quiz เสร็จแล้ว
        hasCompletedQuiz: true,
      },
    });

    revalidatePath("/quiz");
    revalidatePath("/profile");
    revalidatePath("/dorm"); // เพื่อให้หน้าจองเห็น Match % ทันที

    return updatedUser;
  } catch (error: any) {
    console.error("Failed to update quiz data:", error);
    throw new Error(`บันทึกข้อมูลไม่สำเร็จ ${error.message}`);
  }
}

