import { Room, User } from "@prisma/client";
import { RoommateStatus } from "./RoommateStatus";


// ปั้นโครงสร้างรูมเมทที่เราอยากได้
export interface RoommateInfo {
  name: string;
  major: string;
  matchPercent: number;
}

// สร้าง Type ใหม่ที่รวม Room เข้ากับรูมเมทที่ "ไม่มีอยู่จริงใน DB"
export interface ExtendedRoom extends Room {
  existingRoommate?: RoommateInfo | null; // ฟิลด์ที่เราปั้นขึ้นมาเอง
  floor: number; 
}

interface RoomOptionCardProps {
  room: ExtendedRoom;
  isSelected: boolean;
  onSelect: () => void;
  hasCompletedQuiz: boolean;
  disabled?: boolean;
  occupiedSlots?: number;
}

export function RoomOptionCard({ room, isSelected, onSelect, hasCompletedQuiz, disabled, occupiedSlots = 0 }: RoomOptionCardProps) {
  return (
    <label 
      className={`relative flex flex-col p-5 bg-white border-2 rounded-[2.5rem] transition-all duration-300 min-h-55 ${
        disabled
          ? "cursor-not-allowed border-gray-100 bg-gray-50 opacity-60"
          : isSelected
          ? "cursor-pointer border-emerald-500 ring-4 ring-emerald-50/50 bg-emerald-50/5 shadow-xl shadow-emerald-100"
          : "cursor-pointer border-gray-100 hover:border-emerald-200 shadow-sm"
      }`}
    >
      <input
        type="radio"
        className="absolute opacity-0"
        disabled={disabled}
        onChange={() => {
          if (!disabled) onSelect();
        }}
        checked={isSelected}
      />
      
      {/* Header: Circle & Floor */}
      <div className="flex justify-between items-start mb-4">
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
          isSelected ? "border-emerald-500 bg-emerald-500" : "border-gray-300"
        }`}>
          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
        </div>
        <span className="text-[10px] font-black bg-gray-100 text-gray-500 px-2 py-0.5 rounded-lg uppercase tracking-widest">
          Floor {room.floor || "1"}
        </span>
      </div>

      {/* Main Info */}
      <div className="mb-4">
        <p className="font-black text-2xl text-gray-900 leading-tight">{room.name}</p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <div className="flex items-baseline gap-1">
            <p className="text-xl font-black text-emerald-600">฿{room.price.toLocaleString()}</p>
            <p className="text-[10px] font-bold text-gray-400">/ เดือน</p>
          </div>
          <span className="text-[10px] font-bold text-gray-500">ความจุ {room.capacity} คน</span>
          {disabled && (
            <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-black text-red-700">
              เต็มแล้ว
            </span>
          )}
        </div>
      </div>

      {/* Roommate Section (เรียกใช้ Component ย่อยที่แยกออกมา) */}
      <div className="mt-auto pt-4 border-t border-gray-50">
        <RoommateStatus 
          roommate={room.existingRoommate} 
          hasCompletedQuiz={hasCompletedQuiz} 
          occupiedSlots={occupiedSlots}
          capacity={room.capacity}
        />
      </div>
    </label>
  );
}