import { School, BookOpen } from 'lucide-react';

export default function ProfileStats({ faculty, year }: { faculty: string | null; year: number | null }) {
    const stats = [
        { label: "คณะ", value: faculty || "ไม่ระบุ", icon: School },
        { label: "ชั้นปี", value: year ? `ปี ${year}` : "ไม่ระบุ", icon: BookOpen },
    ];

    return (
        <div className="grid grid-cols-2 gap-4 w-full mt-8">
            {stats.map((item, idx) => (
                <div key={idx} className="bg-gray-50/50 p-4 rounded-[2rem] flex flex-col items-center border border-gray-100 transition-hover hover:bg-white hover:shadow-sm">
                    <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm mb-2">
                        <item.icon size={20} />
                    </div>
                    <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{item.label}</span>
                    <span className="text-sm font-bold text-gray-800 mt-0.5">{item.value}</span>
                </div>
            ))}
        </div>
    );
}