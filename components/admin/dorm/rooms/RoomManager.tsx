"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addRoomType, deleteRoomType } from "@/app/action/room";
import { toast } from "sonner";

// 🟢 Import Components ย่อยที่เราเพิ่งสร้าง
import { RoomList } from "./RoomList";
import { AddRoomForm } from "./AddDormForm";

interface RoomManagerProps {
  dormId: string;
  rooms: any[]; 
}

export function RoomManager({ dormId, rooms }: RoomManagerProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    capacity: 1,
    isAvailable: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      
      [name]: name === "isAvailable" 
                ? value === "true" 
                : ["price", "capacity", "floor"].includes(name) 
                  ? Number(value) 
                  : value,
    }));
  };

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = await addRoomType(dormId, formData);
    if (result.success) {
      toast.success("เพิ่มประเภทห้องสำเร็จ!");
      setFormData({ name: "", price: 0, capacity: 1 , isAvailable: true}); // เคลียร์ฟอร์ม
      router.refresh(); 
    } else {
      toast.error(result.error);
    }
    setIsSubmitting(false);
  };

  const handleDeleteRoom = async (roomId: string) => {
    if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบห้องพักประเภทนี้?")) return;
    
    setDeletingId(roomId);
    const result = await deleteRoomType(roomId);
    if (result.success) {
      toast.success("ลบข้อมูลสำเร็จ!");
      router.refresh();
    } else {
      toast.error(result.error);
    }
    setDeletingId(null);
  };

  return (
    <div className="space-y-8">
      {/* 📦 ส่วนที่ 1: เรียกใช้ Component ฟอร์มเพิ่มห้อง */}
      <AddRoomForm 
        formData={formData} 
        isSubmitting={isSubmitting} 
        onChange={handleChange} 
        onSubmit={handleAddRoom} 
      />

      {/* 📋 ส่วนที่ 2: เรียกใช้ Component รายการห้อง */}
      <RoomList 
        rooms={rooms} 
        deletingId={deletingId} 
        onDelete={handleDeleteRoom} 
      />
    </div>
  );
}