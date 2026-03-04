"use server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateUserProfile(userId: string, formData: FormData) {
  const name = formData.get("name") as string;
  const faculty = formData.get("faculty") as string;
  const year = parseInt(formData.get("year") as string);
  const cleanliness = parseInt(formData.get("cleanliness") as string);
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