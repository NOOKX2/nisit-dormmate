import { lifestyleConfigs } from '@/config/lifestyle';

export function LifestyleSection({ user, translate }: { user: any, translate: any }) {
  // 🟢 ดึงทั้งหมดมาจาก Config เลยครับ ไม่ต้อง Filter แล้ว
  const items = lifestyleConfigs;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Lifestyle Profile</h2>
      
      {/* 🟢 ปรับ Grid เป็น 2 คอลัมน์ (และเป็น 1 คอลัมน์ในมือถือ) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => {
          const Icon = item.icon;
          const rawValue = user[item.key];
          
          return (
            <div 
              key={item.key} 
              className={`flex items-center gap-4 ${item.bgColor || 'bg-gray-50'} rounded-2xl p-4 transition-all duration-300 hover:shadow-md hover:scale-[1.01]`}
            >
              {/* Icon Container */}
              <div className={`w-12 h-12 shrink-0 rounded-xl bg-white flex items-center justify-center shadow-sm`}>
                <Icon size={24} className={item.color || 'text-gray-600'} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider mb-0.5 truncate">
                  {item.label}
                </p>
                <p className="text-sm font-black text-gray-900 leading-tight">
                  {translate(item.key, rawValue)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}