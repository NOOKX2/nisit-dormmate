import { Plus, Loader2 } from "lucide-react";

interface AddRoomFormProps {
  formData: { name: string; price: number; capacity: number };
  isSubmitting: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function AddRoomForm({ formData, isSubmitting, onChange, onSubmit }: AddRoomFormProps) {
  return (
    <form onSubmit={onSubmit} className="p-6 rounded-3xl border border-emerald-100 shadow-sm bg-emerald-50/30">
      <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Plus size={20} className="text-emerald-600" /> เพิ่มประเภทห้องพักใหม่
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">ชื่อประเภทห้อง (เช่น ห้องแอร์)</label>
          <input type="text" name="name" required value={formData.name} onChange={onChange}
            className="w-full p-3 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none bg-white"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">ราคา (บาท/เดือน)</label>
          <input type="number" name="price" required min="0" value={formData.price} onChange={onChange}
            className="w-full p-3 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none bg-white"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">พักได้สูงสุด (คน)</label>
          <input type="number" name="capacity" required min="1" value={formData.capacity} onChange={onChange}
            className="w-full p-3 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none bg-white"
          />
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button type="submit" disabled={isSubmitting}
          className="px-6 py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
          บันทึกห้องใหม่
        </button>
      </div>
    </form>
  );
}