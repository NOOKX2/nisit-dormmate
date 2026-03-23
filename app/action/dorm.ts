"use server";

import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function generateSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\u0E00-\u0E7Fa-zA-Z0-9\s]/g, '') 
    .replace(/\s+/g, '-')                      
    .replace(/-+/g, '-')                      
    .trim();
}

export async function createDormAction(formData: FormData) {
    const name = formData.get("name") as string;
    const locationShort = formData.get("locationShort") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const description = formData.get("description") as string;

    const address = formData.get("address") as string;
    const lat = parseFloat(formData.get("lat") as string);
    const lng = parseFloat(formData.get("lng") as string);

    // ฟิลด์ค่าใช้จ่ายเพิ่มเติม
    const electricRateRaw = formData.get("electricRate") as string | null;
    const waterRateRaw = formData.get("waterRate") as string | null;
    const commonFeeRaw = formData.get("commonFee") as string | null;

    const electricRate = electricRateRaw ? parseInt(electricRateRaw) : null;
    const waterRate = waterRateRaw ? parseInt(waterRateRaw) : null;
    const commonFee = commonFeeRaw ? parseInt(commonFeeRaw) : null;

    const minPrice = parseInt(formData.get("minPrice") as string) || 0;
    const maxPrice = parseInt(formData.get("maxPrice") as string) || 0;
    const basePrice = parseInt(formData.get("basePrice") as string) || 0;

    const roomsRaw = formData.get("rooms") as string;
    const amenitiesRaw = formData.get("amenities") as string;
    let roomsData = [];
    let amenities: string[] = [];

    try {
        roomsData = JSON.parse(roomsRaw);
    } catch (e) {
        console.error("Parse rooms error:", e);
    }

    try {
        amenities = amenitiesRaw ? JSON.parse(amenitiesRaw) : [];
        if (!Array.isArray(amenities)) {
            amenities = [];
        }
    } catch (e) {
        console.error("Parse amenities error:", e);
        amenities = [];
    }

    // แยก amenities จากฟอร์มให้เป็น ภายในห้อง / ส่วนกลาง ตาม key
    const INDOOR_AMENITY_KEYS = [
        "aircon",
        "waterHeater",
        "furniture",
        "fridge",
        "tv",
        "sink",
        "balcony",
    ];

    const COMMON_AMENITY_KEYS = [
        "elevator",
        "security",
        "washingMachine",
        "wifi",
        "fitness",
        "pool",
        "carParking",
        "motorcycleParking",
        "coworking",
    ];

    const indoorAmenities = amenities.filter((id) =>
        INDOOR_AMENITY_KEYS.includes(id)
    );
    const commonAmenities = amenities.filter((id) =>
        COMMON_AMENITY_KEYS.includes(id)
    );

    if (!name || !locationShort) {
        return { error: "กรุณากรอกข้อมูลที่จำเป็น (ชื่อและที่ตั้ง) ให้ครบถ้วน" };
    }

    const slug = `${generateSlug(name)}-${Math.random().toString(36).substring(2, 5)}`;

    try {
        const newDorm = await prisma.$transaction(async (tx) => {
            const dormData: any = {
                name,
                slug,
                locationShort,
                imageUrl: imageUrl || "/mock/dorm2.jpg", // ใส่รูป Default ถ้าไม่ได้ระบุ
                description,
                address: address,
                lat: lat,
                lng: lng,
                electricRate: electricRate ?? undefined,
                waterRate: waterRate ?? undefined,
                commonFee: commonFee ?? undefined,
                indoorAmenities,
                commonAmenities,
                rating: 4.5, // ค่า Default สำหรับ Demo
                reviewCount: 1,
                priceRange: {
                    create: {
                        minPrice: minPrice,
                        maxPrice: maxPrice,
                    }
                },
            };

            const dorm = await tx.dorm.create({
                data: dormData,
            });

           if (roomsData.length > 0) {
                await tx.room.createMany({
                    data: roomsData.map((room: any) => ({
                        name: room.name,
                        price: parseInt(room.price) || 0,
                        description: room.description || "",
                        capacity: 2, // ค่า Default
                        isAvailable: true,
                        dormId: dorm.id,
                        floor: room.floor ? parseInt(room.floor) : null,
                    })),
                });
            } else {
                // ถ้าไม่มีการส่งห้องมาจริงๆ ค่อยสร้างห้องมาตรฐานเป็น fallback
                await tx.room.create({
                    data: {
                        name: "ห้องมาตรฐาน",
                        price: basePrice,
                        capacity: 2,
                        isAvailable: true,
                        dormId: dorm.id,
                    },
                });
            }

            return dorm;
        });

        revalidatePath("/dorm");
        revalidatePath("/");

        return { success: true, dormId: newDorm.id };

    } catch (error: any) {
        console.error("Dorm Creation Error:", error);
       return { error: `DB Error: ${error.message || "Unknown error"}` };
    }
}



export async function getDorms() {
    try {
        const dorms = await prisma.dorm.findMany({
            include: {
                priceRange: true, // 👈 สำคัญมาก! ต้องใส่บรรทัดนี้
                reviews: true,
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
// app/action/dorm.ts

export async function getDormBySlug(slug: string) {
  try {
    const dorm = await prisma.dorm.findUnique({
      where: { 
        slug: slug 
      },
      include: {
        priceRange: true,
        rooms: {
          // 🌟 เพิ่มส่วนการเรียงลำดับตรงนี้ครับ
          orderBy: [
            { floor: 'asc' }, // เรียงตามชั้นจาก 1 ไป 10
            { name: 'asc' }   // ถ้าชั้นเดียวกัน ให้เรียงตามเลขห้อง เช่น 101, 102
          ],
          include: {
            bookings: {
              where: {
                status: "SUCCESS",
              },
              include: {
                user: true
              }
            }
          }
        },
      },
    });

    if (!dorm) return null;

    // --- 🪄 ขั้นตอนการปั้นข้อมูล (เหมือนเดิม) ---
    const roomsWithRoommateData = dorm.rooms.map((room) => {
      const activeBooking = room.bookings[0]; 
      const roommateUser = activeBooking?.user;

      return {
        ...room,
        // มั่นใจว่า floor ถูกส่งออกไปใช้งานที่ Frontend ด้วย
        floor: room.floor, 
        existingRoommate: roommateUser ? {
          name: `${roommateUser.firstName} ${roommateUser.lastName}`,
          major: roommateUser.faculty || "นิสิต",
          matchPercent: 85, 
        } : null,
      };
    });

    return {
      ...dorm,
      rooms: roomsWithRoommateData,
    };

  } catch (error) {
    console.error("Fetch Dorm Detail Error:", error);
    return null;
  }
}

export async function checkUserBookingStatus(dormId: string) {
  try {
    // 1. ดึง User จาก Token/Cookie (ใช้ฟังก์ชันที่คุณเขียน)
    const user = await getAuthUser();

    // ถ้าไม่ Login ถือว่ายังไม่เคยจอง
    if (!user) return false;

    // 2. เช็คในฐานข้อมูล
    const existingBooking = await prisma.booking.findFirst({
      where: {
        userId: user.id,
        dormId: dormId,
        status: "SUCCESS",
      },
    });

    // ถ้าเจอข้อมูลคืนค่า true, ถ้าไม่เจอคืนค่า false
    return !!existingBooking;
  } catch (error) {
    console.error("Check Booking Status Error:", error);
    return false;
  }
}

// app/action/dorm.ts
export async function updateDormBaseInfo(dormId: string, data: {
  name: string;
  locationShort: string;
  imageUrl?: string;
  electricRate: number;
  waterRate: number;
  commonFee: number;
  // 🟢 1. รับค่า Array ของสิ่งอำนวยความสะดวกเพิ่มเข้ามา
  indoorAmenities: string[]; 
  commonAmenities: string[];
}) {
  try {
    const updatedDorm = await prisma.dorm.update({
      where: { id: dormId },
      data: {
        name: data.name,
        locationShort: data.locationShort,
        imageUrl: data.imageUrl,
        electricRate: data.electricRate,
        waterRate: data.waterRate,
        commonFee: data.commonFee,
        // 🟢 2. โยนลง Database
        indoorAmenities: data.indoorAmenities,
        commonAmenities: data.commonAmenities,
      },
    });

    revalidatePath("/admin");
    revalidatePath(`/admin/dorm/${updatedDorm.slug}`);
    return { success: true, slug: updatedDorm.slug };
  } catch (error: any) {
    console.error("Update Dorm Error:", error);
    return { error: "ไม่สามารถอัปเดตข้อมูลได้ โปรดลองอีกครั้ง" };
  }
}

export async function deleteDormAction(dormId: string) {
  try {
    // 🟢 สั่ง Prisma ลบหอพัก (ข้อมูลห้องพัก/ช่วงราคา ที่ผูกกันอยู่จะโดนลบตามไปด้วยเพราะเราตั้ง onDelete: Cascade ไว้ใน Schema แล้วครับ)
    await prisma.dorm.delete({
      where: { id: dormId },
    });
  } catch (error) {
    console.error("Delete dorm error:", error);
    return { error: "ไม่สามารถลบหอพักได้ โปรดลองอีกครั้ง" };
  }

  // 🟢 เคลียร์ Cache และเด้งกลับไปหน้า Admin หลัก
  revalidatePath("/admin");
  redirect("/admin"); 
}