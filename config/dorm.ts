export const INDOOR_AMENITIES = [
    { id: "aircon", label: "แอร์" },
    { id: "waterHeater", label: "เครื่องทำน้ำอุ่น" },
    { id: "furniture", label: "เฟอร์นิเจอร์" },
    { id: "fridge", label: "ตู้เย็น" },
    { id: "tv", label: "ทีวี" },
    { id: "sink", label: "ซิงค์ล้างจาน" },
    { id: "balcony", label: "ระเบียง" },
] as const;

export const COMMON_AMENITIES = [
    { id: "elevator", label: "ลิฟต์" },
    { id: "security", label: "กล้องวงจรปิด / คีย์การ์ด" },
    { id: "washingMachine", label: "เครื่องซักผ้าหยอดเหรียญ" },
    { id: "wifi", label: "Wi‑Fi ส่วนกลาง" },
    { id: "fitness", label: "ฟิตเนส" },
    { id: "pool", label: "สระว่ายน้ำ" },
    { id: "carParking", label: "ที่จอดรถยนต์" },
    { id: "motorcycleParking", label: "ที่จอดมอเตอร์ไซค์" },
    { id: "coworking", label: "Co-working space" },
] as const;

export const ALL_AMENITIES = [...INDOOR_AMENITIES, ...COMMON_AMENITIES];

export function getAmenityLabel(id: string): string {
  const found = ALL_AMENITIES.find((amenity) => amenity.id === id);
  return found ? found.label : id; 
}