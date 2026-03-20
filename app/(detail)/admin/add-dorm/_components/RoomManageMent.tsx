import { Bed, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Room {
    name: string;
    price: string;
    description: string;
}

export function RoomManagement({ rooms, setRooms }: { rooms: Room[], setRooms: any }) {
    const addRoom = () => setRooms([...rooms, { name: '', price: '', description: '' }]);
    const removeRoom = (index: number) => setRooms(rooms.filter((_, i) => i !== index));

    const handleRoomChange = (index: number, field: string, value: string) => {
        const newRooms = [...rooms];
        newRooms[index] = { ...newRooms[index], [field]: value };
        setRooms(newRooms);
    };

    return (
        <div className="space-y-5 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                        <Bed className="text-emerald-600" /> ประเภทห้องพัก
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">เพิ่มรายละเอียดห้องพัก</p>
                </div>
                <Button type="button" variant="outline" onClick={addRoom} className="rounded-2xl border-emerald-200 text-emerald-600 font-bold">
                    <Plus size={18} className="mr-1" /> เพิ่มห้อง
                </Button>
            </div>

            <div className="grid gap-5">
                {rooms.map((room, index) => (
                    <div key={index} className="group p-6 bg-white border border-gray-200 rounded-[2rem] space-y-4 relative transition-all hover:border-emerald-100 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <RoomInput type="text" label="ชื่อประเภทห้อง" value={room.name} placeholder="เช่น ห้องแอร์" onChange={(v) => handleRoomChange(index, 'name', v)} />
                            <RoomInput  label="ราคาต่อเดือน" value={room.price} placeholder="5500" type="number" onChange={(v) => handleRoomChange(index, 'price', v)} />
                        </div>
                        <RoomInput label="รายละเอียด (Option)" value={room.description} placeholder="เช่น มีระเบียง" onChange={(v) => handleRoomChange(index, 'description', v)} />

                        {rooms.length > 1 && (
                            <button type="button" onClick={() => removeRoom(index)} className="absolute -top-2 -right-2 p-2 bg-red-50 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-all">
                                <X size={16} />
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

// 🟢 ตัวอย่างการแยกอะตอมย่อยๆ (Reusable Input)
function RoomInput({ label, value, onChange, placeholder, type = "text" }: {
    label: string;
    value: string;
    onChange: (v: string) => void; // กำหนดว่า v ต้องเป็น string และ function ไม่คืนค่าอะไร
    placeholder: string;
    type?: string;
}) {
    return (
        <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>
            <Input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required
                className="rounded-xl bg-gray-50/50 border-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            />
        </div>
    );
}