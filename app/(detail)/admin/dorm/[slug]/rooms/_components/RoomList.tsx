import { Trash2, BedDouble, Users, Tag, Loader2, CheckCircle2, XCircle } from "lucide-react";

interface RoomListProps {
    rooms: any[];
    deletingId: string | null;
    onDelete: (roomId: string) => void;
}

export function RoomList({ rooms, deletingId, onDelete }: RoomListProps) {

    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50">
                <h2 className="text-lg font-bold text-gray-900">ประเภทห้องพักทั้งหมด ({rooms.length})</h2>
            </div>

            {rooms.length === 0 ? (
                <div className="p-8 text-center text-gray-400">ยังไม่มีข้อมูลห้องพัก</div>
            ) : (
                <div className="divide-y divide-gray-50">
                    {rooms.map((room) => {
                        // 🟢 ดึงค่า isAvailable มาเช็ค
                        const isAvailable = room.isAvailable;

                        return (
                            <div key={room.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">

                                <div className="flex items-center gap-4">
                                    {/* เปลี่ยนสีไอคอนเตียงตามสถานะห้อง */}
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isAvailable ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                                        <BedDouble size={24} />
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-gray-900">{room.name}</h3>

                                            {/* 🟢 ส่วนที่เพิ่มเข้ามา: ป้ายกำกับสถานะห้อง */}
                                            {isAvailable ? (
                                                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-700 flex items-center gap-1">
                                                    <CheckCircle2 size={12} /> ว่าง
                                                </span>
                                            ) : (
                                                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-red-100 text-red-700 flex items-center gap-1">
                                                    <XCircle size={12} /> ไม่ว่าง {room.bookings?.[0] && `(คุณ ${room.bookings[0].customerName})`}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500">
                                            <span className="flex items-center gap-1"><Tag size={14} /> ฿{room.price.toLocaleString()}/เดือน</span>
                                            <span className="flex items-center gap-1"><Users size={14} /> พักได้ {room.capacity} คน</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => onDelete(room.id)}
                                    disabled={deletingId === room.id}
                                    className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors shrink-0"
                                    title="ลบประเภทห้องนี้"
                                >
                                    {deletingId === room.id ? <Loader2 size={20} className="animate-spin" /> : <Trash2 size={20} />}
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}