import { AlertCircle } from 'lucide-react';

interface FormErrorProps {
  message?: string | null;
}

export const FormError = ({ message }: FormErrorProps) => {
  // ถ้าไม่มี message ไม่ต้องแสดงผลอะไรเลย
  if (!message) return null;

  return (
    <div className="flex items-center gap-x-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl animate-in fade-in duration-300">
      <AlertCircle size={18} className="shrink-0" />
      <p>{message}</p>
    </div>
  );
};