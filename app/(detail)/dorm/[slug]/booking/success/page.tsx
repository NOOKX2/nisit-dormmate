import { redirect } from "next/navigation";
import { getBookingData } from "@/app/action/booking";
import { SuccessHeader } from "@/components/booking/success/SuccessHeader";
import { DigitalReceipt } from "@/components/booking/success/DigitalReceipt";
import { ActionButtons } from "@/components/booking/success/ActionButton";


export default async function BookingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;

  if (!id) redirect("/");

  const booking = await getBookingData(id);

  if (!booking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <p className="text-gray-500 mb-4">ไม่พบข้อมูลการจอง หรือคำสั่งซื้อหมดอายุ</p>
        <button className="border p-2 rounded-xl">กลับหน้าหลัก</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50/30 flex flex-col items-center p-6 pb-20 font-sans antialiased">
      <SuccessHeader roomName={booking.room?.name} />
      <DigitalReceipt booking={booking} />
      <ActionButtons />
    </div>
  );
}