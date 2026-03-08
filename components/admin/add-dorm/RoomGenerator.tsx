"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { GeneratorInput } from "./GeneratorInput"; // 👈 Import มาจากไฟล์ที่แยกเมื่อกี้

interface RoomGeneratorProps {
  onGenerate: (rooms: any[]) => void;
  initialConfig?: any;
}

export function RoomGenerator({ onGenerate, initialConfig }: RoomGeneratorProps) {
  const [config, setConfig] = useState({
    startFloor: initialConfig?.startFloor ?? 1,
    endFloor: initialConfig?.endFloor ?? 5,
    roomsPerFloor: initialConfig?.roomsPerFloor ?? 10,
    price: initialConfig?.price ?? 5500,
    capacity: initialConfig?.capacity ?? 2,
    typeName: initialConfig?.typeName ?? "ห้องแอร์ Standard"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: name === "typeName" ? value : (parseInt(value) || 0)
    }));
  };

  const generateAction = () => {
    const batch = [];
    for (let f = config.startFloor; f <= config.endFloor; f++) {
      for (let r = 1; r <= config.roomsPerFloor; r++) {
        const roomNum = `${f}${r < 10 ? '0' + r : r}`;
        batch.push({
          name: `ห้อง ${roomNum}`,
          price: config.price.toString(),
          capacity: config.capacity,
          description: `${config.typeName} - ชั้น ${f}`,
          floor: f,
        });
      }
    }
    console.log('batch', batch);
    onGenerate(batch);
  };

return (
  <div className="bg-white p-8 rounded-[2.5rem] border-2 border-emerald-100 shadow-xl shadow-emerald-50/50 grid grid-cols-2 md:grid-cols-7 gap-4 items-end animate-in fade-in zoom-in duration-300 font-sans">
    
    {/* ช่องปกติ (กิน 1 ส่วน) */}
    <GeneratorInput label="ชั้นที่เริ่ม" name="startFloor" value={config.startFloor} onChange={handleChange} />
    <GeneratorInput label="ชั้นที่สิ้นสุด" name="endFloor" value={config.endFloor} onChange={handleChange} />
    <GeneratorInput label="ห้องต่อชั้น" name="roomsPerFloor" value={config.roomsPerFloor} onChange={handleChange} />

    {/* 🟢 ช่องราคา (กิน 2 ส่วนเพื่อให้ดูใหญ่โดดเด่น) */}
    <div className="md:col-span-2">
      <GeneratorInput 
        label="ราคา/เดือน (บาท)" 
        name="price" 
        value={config.price} 
        onChange={handleChange} 
        className="text-xl" // เพิ่มขนาดตัวเลขให้ใหญ่ขึ้นด้วย
      />
    </div>

    {/* ช่องปกติ (กิน 1 ส่วน) */}
    <GeneratorInput label="พักได้ (คน)" name="capacity" value={config.capacity} onChange={handleChange} />

    {/* ปุ่มสร้างห้อง (กิน 1 ส่วน) */}
    <Button
      type="button"
      onClick={generateAction}
      className="h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black shadow-lg shadow-emerald-200 flex gap-2 active:scale-95 transition-all w-20"
    >
      <Wand2 size={18} /> สร้างห้อง
    </Button>
  </div>
);
}