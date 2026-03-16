"use server";

import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export interface Lifestyle {
  study_time: string;
  location: string;
  guest_policy: string;
  cleanliness: number; 
  sleepHabit: string;
  smoking: boolean;
}




export async function getPotentialMatches() {
  const currentUser = await getAuthUser();
  if (!currentUser) return [];

  const users = await prisma.user.findMany({
    where: {
      hasCompletedQuiz: true,
      id: { not: currentUser.id }, // ไม่ดึงตัวเองมาโชว์
    },
  });

  return users;
}