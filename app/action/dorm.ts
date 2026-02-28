"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createDormAction(formData: FormData) {
    const name = formData.get("name") as string;
    const locationShort = formData.get("locationShort") as string;
    const priceRange = formData.get("priceRange") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const description = formData.get("description") as string;

    const basePrice = parseInt(formData.get("basePrice") as string) || 0;

    if (!name || !locationShort) {
        return { error: "กรุณากรอกข้อมูลที่จำเป็น (ชื่อและที่ตั้ง) ให้ครบถ้วน" };
    }

    try {
        const newDorm = await prisma.$transaction(async (tx) => {
            const dorm = await tx.dorm.create({
                data: {
                    name,
                    locationShort,
                    priceRange,
                    imageUrl: imageUrl || "/mock/dorm2.jpg", // ใส่รูป Default ถ้าไม่ได้ระบุ
                    description,
                    rating: 4.5, // ค่า Default สำหรับ Demo
                    reviewCount: 1,
                },
            });

            await tx.room.create({
                data: {
                    name: "ห้องมาตรฐาน",
                    price: basePrice,
                    capacity: 2,
                    isAvailable: true,
                    dormId: dorm.id,
                },
            });

            return dorm;
        });

        revalidatePath("/dorm");
        revalidatePath("/");

        return { success: true, dormId: newDorm.id };

    } catch (error: any) {
        console.error("Dorm Creation Error:", error);
        return { error: "ไม่สามารถบันทึกข้อมูลได้ กรุณาเช็ค Docker หรือ Database" };
    }
}