import { Settings, History, ChevronRight, Bell } from 'lucide-react';
import Link from 'next/link';

export default function ActionMenu() {
    const menus = [
        { title: "แก้ไขโปรไฟล์", icon: Settings, color: "bg-blue-50 text-blue-600", href: "/profile/edit" },
        { title: "ประวัติการจอง", icon: History, color: "bg-purple-50 text-purple-600", href: "/booking" },
        { title: "การแจ้งเตือน", icon: Bell, color: "bg-amber-50 text-amber-600", href: "#" },
    ];

    return (
        <div className="space-y-3">
            {menus.map((menu, idx) => (
                <Link 
                    key={idx} 
                    href={menu.href}
                    className="flex items-center justify-between p-5 bg-white rounded-[1.8rem] border border-gray-100 shadow-sm active:scale-[0.97] transition-all hover:border-emerald-200"
                >
                    <div className="flex items-center gap-4">
                        <div className={`w-11 h-11 ${menu.color} rounded-2xl flex items-center justify-center`}>
                            <menu.icon size={22} />
                        </div>
                        <span className="font-bold text-gray-700">{menu.title}</span>
                    </div>
                    <ChevronRight className="text-gray-300" size={20} />
                </Link>
            ))}
        </div>
    );
}