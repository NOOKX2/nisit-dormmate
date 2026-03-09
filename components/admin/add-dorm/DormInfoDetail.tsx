import { Building, MapPin, Bath, Image as ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface DormInfoProps {
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function DormInfoFields({ formData, onChange }: DormInfoProps) {
  return (
    <div className="grid gap-6">
      <FormField label="ชื่อหอพัก" icon={<Building size={16} />} name="name" value={formData.name} onChange={onChange} placeholder="เช่น หอพักนิสิตอินเตอร์" />
      <FormField label="พิกัด (ซอย/ถนน)" icon={<MapPin size={16} />} name="locationShort" value={formData.locationShort} onChange={onChange} placeholder="เช่น ซอยพหลโยธิน 45" />
      <FormField label="URL รูปภาพหน้าปก" icon={<ImageIcon size={16} />} name="imageUrl" value={formData.imageUrl} onChange={onChange} placeholder="https://..." />

      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700">รายละเอียดเพิ่มเติม</label>
        <Textarea
          name="description"
          value={formData.description}
          onChange={onChange}
          placeholder="บรรยายจุดเด่นของหอพัก..."
          rows={4}
          className="rounded-2xl focus-visible:ring-emerald-500"
        />
      </div>
    </div>
  );
}

// 🟢 Reusable FormField เพื่อลดการเขียนซ้ำ (Atomic Design)
function FormField({ label, icon, ...props }: any) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-bold flex items-center gap-2 text-gray-700">
        <span className="text-emerald-500">{icon}</span> {label}
      </label>
      <Input {...props} className="rounded-xl h-12 focus-visible:ring-emerald-500" />
    </div>
  );
}