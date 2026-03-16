import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { BookingList } from "@/components/admin/dorm/booking/BookingList";
import { getDormBySlug } from "@/app/action/dorm";

export default async function AdminDormBookingsPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = decodeURIComponent(resolvedParams.slug);

  const dorm = await getDormBySlug(slug);

  if (!dorm) notFound();

  // รวบรวมการจองจากทุกห้องในหอนี้มาเป็น Array เดียว
  const allBookings = dorm.rooms.flatMap(room => room.bookings);
  console.log(allBookings);

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <Link href={`/admin/dorm/${dorm.slug}`} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft size={24} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">รายการจอง: {dorm.name}</h1>
          <p className="text-sm text-gray-500">จัดการการจองและตรวจสอบสลิปของนิสิต</p>
        </div>
      </div>

      <BookingList initialBookings={allBookings} slug={slug}/>
    </div>
  );
}