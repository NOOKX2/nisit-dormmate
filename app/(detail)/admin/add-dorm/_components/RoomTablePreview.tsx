// 📄 components/admin/RoomTablePreview.tsx
export function RoomTablePreview({ rooms, onDelete }: any) {
  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
      <div className="max-h-100 overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 sticky top-0 uppercase text-[10px] font-black text-gray-400">
            <tr>
              <th className="p-4">เลขห้อง</th>
              <th className="p-4">ประเภท</th>
              <th className="p-4">ราคา</th>
              <th className="p-4">จำนวนคน</th>
              <th className="p-4">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {rooms.map((room: any, idx: number) => (
              <tr key={idx} className="hover:bg-emerald-50/30 transition-colors">
                <td className="p-4 font-bold">{room.name}</td>
                <td className="p-4 text-xs text-gray-500">ห้องแอร์</td>
                <td className="p-4 font-bold text-emerald-600">฿{room.price}</td>
                <td className="p-4 font-medium">{room.capacity} คน</td>
                <td className="p-4"><button onClick={() => onDelete(idx)} className="text-red-400 hover:text-red-600">ลบ</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}