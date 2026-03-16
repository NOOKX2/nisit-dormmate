import { MapPin } from 'lucide-react';

interface LocationSectionProps {
  dormName: string;
  address?: string | null;
  lat?: number | null; // 🟢 1. รับค่า lat เพิ่มเข้ามา
  lng?: number | null; // 🟢 2. รับค่า lng เพิ่มเข้ามา
}

export function LocationSection({ dormName, address, lat, lng }: LocationSectionProps) {
  
  // 🟢 3. อัปเกรด Logic การสร้างคำค้นหา
  // ถ้ามีพิกัด ให้ใช้พิกัดตรงๆ (เช่น "13.84786,100.56965") แต่ถ้าไม่มีให้ใช้ชื่อ+ที่อยู่
  const mapQuery = (lat && lng) 
    ? `${lat},${lng}` 
    : encodeURIComponent(address ? `${dormName} ${address}` : dormName);
  
  // ดึง API Key จากไฟล์ .env
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // 🟢 4. แก้ลิงก์ปุ่ม "เปิดแอปแผนที่" ให้เป็น Official URL ของ Google Maps
  const externalMapLink = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <MapPin className="text-emerald-500" size={20} />
          แผนที่ & ตำแหน่ง
        </h2>
        <a
          href={externalMapLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
        >
          เปิดแอปแผนที่
        </a>
      </div>

      {/* กรอบแสดงแผนที่ */}
      <div className="w-full h-62.5 md:h-87.5 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 relative group">
         {/* Overlay ป้องกันการซูมมั่วตอนไถจอ */}
        <div className="absolute inset-0 bg-transparent z-10 pointer-events-auto md:pointer-events-none"></div>
        <iframe
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          // 🟢 5. อัปเดต URL ของ iframe เป็นรูปแบบมาตรฐานที่รองรับทั้งพิกัดและชื่อ
          src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${mapQuery}`}
          className="absolute inset-0"
        ></iframe>
      </div>
    </div>
  );
}