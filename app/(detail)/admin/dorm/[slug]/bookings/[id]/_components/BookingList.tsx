"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateBookingStatus } from "@/app/action/booking";
import { BookingItem } from "./BookingItem";

export function BookingList({ initialBookings, slug }: { initialBookings: any[], slug: string }) {
  const [filter, setFilter] = useState("ALL");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const router = useRouter();

  const filteredBookings = initialBookings.filter(b => 
    filter === "ALL" ? true : b.status === filter
  );

  const handleStatusChange = async (id: string, newStatus: string) => {
    setLoadingId(id);
    const res = await updateBookingStatus(id, newStatus as any);
    if (res.success) {
      toast.success("อัปเดตสถานะเรียบร้อย");
      router.refresh();
    } else {
      toast.error("เกิดข้อผิดพลาด");
    }
    setLoadingId(null);
  };

  const filterOptions = [
    { label: "ทั้งหมด", value: "ALL" },
    { label: "รอตรวจสอบ", value: "PENDING" },
    { label: "ยืนยันแล้ว", value: "CONFIRMED" },
    { label: "ยกเลิกแล้ว", value: "CANCELLED" },
  ];

  return (
    <div className="space-y-6">
      {/* 🔍 Filter Tabs */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-xl w-fit">
        {filterOptions.map((opt) => (
          <button 
            key={opt.value} 
            onClick={() => setFilter(opt.value)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              filter === opt.value ? "bg-white shadow-sm text-emerald-600" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* 📋 รายการการจอง */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-50">
          {filteredBookings.length === 0 ? (
            <div className="p-12 text-center text-gray-400 font-medium">
              ไม่พบรายการจองในหมวดหมู่นี้
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <BookingItem 
                key={booking.id}
                slug={slug}
                booking={booking}
                loadingId={loadingId}
                onStatusChange={handleStatusChange}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}