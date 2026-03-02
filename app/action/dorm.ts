"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

function generateSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\u0E00-\u0E7Fa-zA-Z0-9\s]/g, '') // เอาอักขระพิเศษออก (รองรับภาษาไทย)
    .replace(/\s+/g, '-')                      // เปลี่ยนช่องว่างเป็น -
    .replace(/-+/g, '-')                       // กันไม่ให้มี -- ติดกัน
    .trim();
}

export async function createDormAction(formData: FormData) {
    const name = formData.get("name") as string;
    const locationShort = formData.get("locationShort") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const description = formData.get("description") as string;

    const minPrice = parseInt(formData.get("minPrice") as string) || 0;
    const maxPrice = parseInt(formData.get("maxPrice") as string) || 0;
    const basePrice = parseInt(formData.get("basePrice") as string) || 0;

    if (!name || !locationShort) {
        return { error: "กรุณากรอกข้อมูลที่จำเป็น (ชื่อและที่ตั้ง) ให้ครบถ้วน" };
    }

    const slug = `${generateSlug(name)}-${Math.random().toString(36).substring(2, 5)}`;

    try {
        const newDorm = await prisma.$transaction(async (tx) => {
            const dorm = await tx.dorm.create({
                data: {
                    name,
                    slug,
                    locationShort,
                    imageUrl: imageUrl || "/mock/dorm2.jpg", // ใส่รูป Default ถ้าไม่ได้ระบุ
                    description,
                    rating: 4.5, // ค่า Default สำหรับ Demo
                    reviewCount: 1,
                    priceRange: {
                        create: {
                            minPrice: minPrice,
                            maxPrice: maxPrice,
                        }
                    },
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
        return { error: `ไม่สามารถบันทึกข้อมูลได้ ` };
    }
}



export async function getDorms() {
    try {
        const dorms = await prisma.dorm.findMany({
            include: {
                priceRange: true, // 👈 สำคัญมาก! ต้องใส่บรรทัดนี้
            },
            orderBy: {
                createdAt: 'desc', // เอาหอพักใหม่ขึ้นก่อน
            },
            // ถ้าในอนาคตมีระบบ Search สามารถเพิ่ม where clause ตรงนี้ได้ครับ
        });
        return { success: true, data: dorms };
    } catch (error) {
        console.error("Fetch Dorms Error:", error);
        return { success: false, error: "ไม่สามารถดึงข้อมูลหอพักได้" };
    }
}

// เพิ่มต่อในไฟล์ app/action/dorm.ts
export async function getDormBySlug(slug: string) {
  try {
    const dorm = await prisma.dorm.findUnique({
      where: { 
        // ถ้าคุณเปลี่ยนไปใช้ slug ให้ใช้ slug: slug
        // แต่ถ้าตอนนี้ใน DB มีแค่ ID ให้ใช้ id: slug ไปก่อนครับ
        slug: slug 
      },
      include: {
        priceRange: true,
      },
    });

    if (!dorm) return null;
    return dorm;
  } catch (error) {
    console.error("Fetch Dorm Detail Error:", error);
    return null;
  }
}