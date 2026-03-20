import { CheckCircle2 } from "lucide-react";

export function SuccessHeader({ roomName }: { roomName?: string }) {
  return (
    <div className="mt-12 mb-8 flex flex-col items-center text-center space-y-4">
      <div className="bg-emerald-100 p-4 rounded-full animate-bounce">
        <CheckCircle2 size={64} className="text-emerald-600" />
      </div>
      <h1 className="text-3xl font-black text-gray-900 tracking-tight">จองหอพักสำเร็จ!</h1>
      <p className="text-gray-500 max-w-70">
        ระบบล็อคห้อง {roomName || "มาตรฐาน"} ให้คุณเรียบร้อยแล้ว
      </p>
    </div>
  );
}