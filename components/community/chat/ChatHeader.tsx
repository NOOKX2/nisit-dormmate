import { User } from "lucide-react";

export function ChatHeader({ contactName }: { contactName: string }) {
  return (
    <div className="bg-emerald-600 p-4 text-white flex items-center gap-3 shadow-sm z-10">
      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
        <User size={20} className="text-white" />
      </div>
      <div>
        <h3 className="font-bold text-sm">{contactName}</h3>
        <p className="text-[10px] text-emerald-100 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> 
          ออนไลน์
        </p>
      </div>
    </div>
  );
}