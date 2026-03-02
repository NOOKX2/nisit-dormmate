export function RoomOptionCard({ room, isSelected, onSelect }: any) {
  return (
    <label 
      className={`relative flex flex-col items-center justify-between p-5 bg-white border-2 rounded-[2.5rem] cursor-pointer transition-all duration-300 min-h-45 ${
        isSelected 
          ? "border-emerald-500 ring-4 ring-emerald-50/50 bg-emerald-50/5" 
          : "border-gray-100 hover:border-emerald-200 shadow-sm"
      }`}
    >
      <input type="radio" className="absolute opacity-0" onChange={onSelect} checked={isSelected} />
      
      {/* 1. ส่วนบน: วงกลมเลือก */}
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
        isSelected ? "border-emerald-500 bg-emerald-500" : "border-gray-300"
      }`}>
        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
      </div>

      {/* 2. ส่วนกลาง: ข้อมูลห้อง (จัดกึ่งกลาง) */}
      <div className="text-center my-2">
        <p className="font-black text-2xl text-gray-900 leading-tight">{room.name}</p>
        <p className="text-8 font-bold text-gray-400 uppercase tracking-tighter mt-1 line-clamp-2">
          {room.description || "ว่างพร้อมเข้าอยู่"}
        </p>
      </div>

      {/* 3. ส่วนล่าง: ราคา (ตัวโตๆ) */}
      <div className="text-center">
        <p className="text-xl font-black text-emerald-600 leading-none">฿{room.price.toLocaleString()}</p>
        <p className="text-[9px] font-bold text-gray-400 mt-0.5">/ เดือน</p>
      </div>
    </label>
  );
}