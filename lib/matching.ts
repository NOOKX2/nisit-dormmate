import { User } from "@prisma/client";

export function calculateMatchScore(user1: User, user2: User): number {
  // 1. ถ้าคนใดคนหนึ่งยังไม่ทำ Quiz ให้คะแนนเป็น 0 ไปก่อน
  if (!user1.hasCompletedQuiz || !user2.hasCompletedQuiz) return 0;

  let score = 0;

  // 🟢 Helper Function: เช็คว่า "ต้องมีค่าทั้งคู่" และ "ต้องตรงกัน" เท่านั้นถึงจะได้คะแนน
  const isMatch = (val1: string |boolean | null | undefined, val2: string | boolean | null | undefined) => {
    return val1 && val2 && val1 === val2; 
  };

  // 🟢 1. Smoking (Deal Breaker - 30%)
  if (isMatch(user1.smoking, user2.smoking)) {
    score += 30;
  }

  // 🟢 2. Cleanliness (20%) 
  if (isMatch(user1.cleanliness, user2.cleanliness)) {
    score += 20;
  }

  // 🟢 3. Sleep Habit / Study Time (25%)
  if (isMatch(user1.sleepHabit, user2.sleepHabit)) {
    score += 25;
  }

  // 🟢 4. Guest Policy (25%)
  if (isMatch(user1.guest_policy, user2.guest_policy)) {
    score += 25;
  }

  // ป้องกันค่าติดลบ หรือเกิน 100
  return Math.min(Math.max(score, 0), 100);
}