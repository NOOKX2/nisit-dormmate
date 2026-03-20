import { redirect } from "next/navigation";
import { Users, Inbox, Send } from "lucide-react";
import Link from "next/link";
import { getAuthUser } from "@/lib/auth";
import { getRoommateDashboardData } from "@/app/action/matching";

// 🟢 Import Components ที่เราเพิ่งหั่นแยกไว้
import { MatchedCard } from "./_components/MatchedCard";
import { SentCard } from "./_components/SentCard";
import { ReceivedCard } from "./_components/ReceiveCard";

export default async function MyRoommatePage() {
    const user = await getAuthUser();

    if (!user) {
        redirect('/login');
    }

    const currentUserId = user.id;
    const { matched, receivedRequests, sentRequests } = await getRoommateDashboardData(currentUserId);

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                <Users className="text-emerald-500" size={32} />
                จัดการรูมเมทของฉัน
            </h1>

            <div className="space-y-12">
                {/* 🌟 หมวดที่ 1: คำชวนที่ได้รับ */}
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
                                <ReceivedCard
                                    key={req.id}
                                    requestId={req.id}
                                    senderName={req.sender.firstName}
                                    senderImage={req.sender.image}
                                />
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
                                const partner = req.senderId === currentUserId ? req.receiver : req.sender;
                                return (
                                    <MatchedCard
                                        key={req.id}
                                        partnerId={partner.id}
                                        partnerName={partner.firstName}
                                        partnerImage={partner.image}
                                    />
                                )
                            })}
                        </div>
                    )}
                </section>

                {/* 🌟 หมวดที่ 3: คำชวนที่ส่งไปแล้ว */}
                <section>
                    <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2 mb-4">
                        <Send className="text-gray-400" size={24} />
                        คำชวนที่ส่งไป ({sentRequests.length})
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        {sentRequests.map(req => (
                            <SentCard
                                key={req.id}
                                requestId={req.id}
                                receiverName={req.receiver.firstName}
                                receiverImage={req.receiver.image}
                            />
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}