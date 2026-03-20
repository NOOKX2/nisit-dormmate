import { Eye, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import Link from "next/link";

interface BookingItemProps {
    booking: any;
    slug: string;
    loadingId: string | null;
    onStatusChange: (id: string, status: string) => void;
}

export function BookingItem({ booking, slug, loadingId, onStatusChange }: BookingItemProps) {
    const isLoading = loadingId === booking.id;

    return (
        <div className="p-6 flex flex-col md:flex-row justify-between gap-6 hover:bg-gray-50/50 transition-colors">
            <div className="flex gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl font-bold text-gray-400">
                    {booking.customerName?.[0] || "U"}
                </div>
                <div>
                    <h3 className="font-bold text-gray-900">{booking.customerName || "ไม่ระบุชื่อ"}</h3>
                    <p className="text-sm text-gray-500">
                        จองห้อง: <span className="font-semibold text-gray-700">{booking.room?.name}</span>
                    </p>
                    <p className="text-xs text-gray-400">
                        วันที่จอง: {new Date(booking.createdAt).toLocaleDateString('th-TH')}
                    </p>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
                <StatusBadge status={booking.status} />

                <div className="flex items-center gap-2">
                    {booking.status === "PENDING" && (
                        <>
                            <button
                                onClick={() => onStatusChange(booking.id, "CONFIRMED")}
                                disabled={!!loadingId}
                                className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                            >
                                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                            </button>
                            <button
                                onClick={() => onStatusChange(booking.id, "CANCELLED")}
                                disabled={!!loadingId}
                                className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                            >
                                <XCircle size={18} />
                            </button>
                        </>
                    )}
                    <Link href={`/admin/dorm/${slug}/bookings/${booking.id}`}>
                        <button className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                            <Eye size={18} />
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}