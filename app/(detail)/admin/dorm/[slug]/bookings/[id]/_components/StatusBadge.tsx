import { CheckCircle, Clock, XCircle } from "lucide-react";

export function StatusBadge({ status }: { status: string }) {
  const styles = {
    CONFIRMED: "bg-emerald-100 text-emerald-700",
    PENDING: "bg-orange-100 text-orange-700",
    CANCELLED: "bg-red-100 text-red-700",
  }[status] || "bg-gray-100 text-gray-700";

  const Icon = {
    CONFIRMED: CheckCircle,
    PENDING: Clock,
    CANCELLED: XCircle,
  }[status] || Clock;

  return (
    <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${styles}`}>
      <Icon size={14} />
      {status === "PENDING" ? "รอตรวจสอบ" : status === "CONFIRMED" ? "ยืนยันแล้ว" : "ยกเลิกแล้ว"}
    </div>
  );
}