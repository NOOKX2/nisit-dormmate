import { Sparkles } from 'lucide-react';

export default function LifestyleCard({ cleanliness, sleepHabit, smoking }: any) {
    const items = [
        { label: "ความสะอาด", value: `${cleanliness || 0}/5`, color: "text-blue-600" },
        { label: "เวลานอน", value: sleepHabit || "ไม่ระบุ", color: "text-purple-600" },
        { label: "สูบบุหรี่", value: smoking ? "ใช่" : "ไม่", color: "text-orange-600" },
    ];

    return (
        <div className="bg-white rounded-[2rem] p-7 shadow-sm border border-gray-100">
            <h3 className="font-bold flex items-center gap-2 mb-6 text-gray-900 text-lg">
                <Sparkles size={20} className="text-amber-500 fill-amber-500" />
                Lifestyle ข้อมูลรูมเมท
            </h3>
            <div className="space-y-4">
                {items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center group">
                        <span className="text-sm text-gray-500 font-medium group-hover:text-gray-900 transition-colors">{item.label}</span>
                        <span className={`text-xs font-bold bg-gray-50 px-4 py-1.5 rounded-full border border-gray-100 ${item.color}`}>
                            {item.value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}