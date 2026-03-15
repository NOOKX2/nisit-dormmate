import { Save, Loader2 } from "lucide-react";

interface FormActionsProps {
  isSubmitting: boolean;
  onCancel: () => void;
}

export function FormActions({ isSubmitting, onCancel }: FormActionsProps) {
  return (
    <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-3">
      <button
        type="button" onClick={onCancel} disabled={isSubmitting}
        className="px-6 py-3 rounded-xl font-semibold text-gray-500 hover:bg-gray-100 transition-colors"
      >
        ยกเลิก
      </button>
      <button
        type="submit" disabled={isSubmitting}
        className="px-8 py-3 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all flex items-center gap-2 disabled:opacity-50"
      >
        {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
        {isSubmitting ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
      </button>
    </div>
  );
}