import { Inbox } from 'lucide-react';
import Link from 'next/link';

export function EmptyBookingState() {
    return (
        <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-gray-100 shadow-sm">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Inbox className="text-gray-300" size={48} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">ยังไม่มีการจอง</h3>
            <Link href="/dorm" className="inline-flex items-center justify-center bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold mt-6 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">
                หาหอพักที่ถูกใจ
            </Link>
        </div>
    );
}