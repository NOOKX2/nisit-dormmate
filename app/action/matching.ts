// lib/matching.ts

import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { User } from "@prisma/client";

export interface Lifestyle {
  study_time: string;
  location: string;
  guest_policy: string;
  cleanliness: number; // 1-5 หรือตามที่คุณเก็บ
  sleepHabit: string;
  smoking: boolean;
}

// lib/matching.ts


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