import { redirect } from "next/navigation";
import { Users, Inbox, Send } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { getRoommateDashboardData } from "@/app/action/matching";

export default async function MyRoommatePage() {
    const user = await getAuthUser();

    if (!user) {
        redirect('/login');
    }

    const currentUserId = user.id;

    // 2. ดึงข้อมูล "คำชวนทั้งหมด" ที่เกี่ยวกับเรา (ทั้งส่งไปและรับมา)
    const { matched, receivedRequests, sentRequests } = await getRoommateDashboardData(currentUserId);
    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                <Users className="text-emerald-500" size={32} />
                จัดการรูมเมทของฉัน
            </h1>

            <div className="space-y-12">
                {/* 🌟 หมวดที่ 1: คำชวนที่ได้รับ (สำคัญสุด เอาไว้บนสุด) */}
                <section>
                    <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2 mb-4">
                        <Inbox className="text-blue-500" size={24} />
                        คำชวนที่รอคุณตอบรับ ({receivedRequests.length})
                    </h2>
                    {receivedRequests.length === 0 ? (
                        <p className="text-gray-500 bg-gray-50 p-6 rounded-2xl text-center border border-dashed border-gray-200">ไม่มีคำชวนใหม่ในขณะนี้</p>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2">
                            {receivedRequests.map(req => (
                                <div key={req.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                                            <img src={req.sender.image || "/default-avatar.png"} alt="avatar" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-800">{req.sender.firstName}</h3>
                                            <p className="text-sm text-gray-500">อยากเป็นรูมเมทกับคุณ</p>
                                        </div>
                                    </div>
                                    {/* 🟢 ตรงนี้เดี๋ยวเราเอา Client Component ปุ่มกดมาใส่ */}
                                    <div className="flex gap-2">
                                        <button className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-bold hover:bg-emerald-600">ยอมรับ</button>
                                        <button className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100">ปฏิเสธ</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* 🌟 หมวดที่ 2: รูมเมทปัจจุบัน */}
                <section>
                    <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2 mb-4">
                        <Users className="text-emerald-500" size={24} />
                        รูมเมทของคุณ ({matched.length})
                    </h2>
                    {matched.length === 0 ? (
                        <p className="text-gray-500 bg-gray-50 p-6 rounded-2xl text-center border border-dashed border-gray-200">
                            คุณยังไม่มีรูมเมท <Link href="/match" className="text-emerald-500 underline">ไปหาคู่รุมเมทกันเถอะ!</Link>
                        </p>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2">
                            {matched.map(req => {
                                // หาว่าใครคือคนที่เรา Match ด้วย (เพราะเราอาจจะเป็นคนส่ง หรือคนรับ ก็ได้)
                                const partner = req.senderId === currentUserId ? req.receiver : req.sender;
                                return (
                                    <div key={req.id} className="bg-linear-to-r from-emerald-50 to-teal-50 p-5 rounded-2xl border border-emerald-100 shadow-sm flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 bg-gray-200 rounded-full border-2 border-emerald-400 p-0.5">
                                                <img src={partner.image || "/default-avatar.png"} alt="avatar" className="rounded-full" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-800 text-lg">{partner.firstName}</h3>
                                                <p className="text-sm text-emerald-600 font-medium">เป็นรูมเมทกันแล้ว 🎉</p>
                                            </div>
                                        </div>
                                        <Link href={`/chat?userId=${partner.id}&name=${encodeURIComponent(partner.firstName)}`}>
                                            <button className="px-4 py-2 bg-white text-gray-600 rounded-xl text-sm font-bold border border-gray-200 hover:bg-gray-50 hover:border-emerald-200 transition-all">
                                                แชทเลย
                                            </button>
                                        </Link>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </section>

                {/* 🌟 หมวดที่ 3: คำชวนที่ส่งไปแล้ว (รอยืนยัน) */}
                <section>
                    <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2 mb-4">
                        <Send className="text-gray-400" size={24} />
                        คำชวนที่ส่งไป ({sentRequests.length})
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        {sentRequests.map(req => (
                            <div key={req.id} className="bg-white p-5 rounded-2xl border border-gray-100 flex justify-between items-center opacity-70">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full">
                                        <img src={req.receiver.image || "/default-avatar.png"} alt="avatar" className="rounded-full" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-700">{req.receiver.firstName}</h3>
                                        <p className="text-xs text-gray-500">รอการยืนยัน...</p>
                                    </div>
                                </div>
                                <button className="text-xs text-gray-400 underline hover:text-red-500">ยกเลิกคำชวน</button>
                            </div>
                        ))}
                    </div>
                </section>

            </div>
        </div>
    );
}