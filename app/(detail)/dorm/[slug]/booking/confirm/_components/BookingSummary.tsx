import { CheckCircle2 } from "lucide-react";

interface SummaryProps {
  name: string;
  location: string;
  roomType: string;
  contract: string;
  startDate: string;
}

export const BookingSummary = ({ name, location, roomType, contract, startDate }: SummaryProps) => (
  <div className="bg-white p-5 rounded-2xl shadow-sm">
    <h2 className="text-xl font-bold text-gray-900">{name}</h2>
    <p className="text-sm text-gray-500">{location}</p>
    <div className="mt-4 space-y-3 border-t pt-4 text-sm">
      <div className="flex justify-between items-center">
        <span className="text-gray-600">ประเภทห้อง</span>
        <span className="font-medium flex items-center gap-1 text-emerald-600">
          <CheckCircle2 size={16} /> {roomType}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-600">ระยะเวลาสัญญา</span>
        <span className="font-medium">{contract}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-600">วันที่เข้าพัก</span>
        <span className="font-medium text-blue-600 underline cursor-pointer">{startDate}</span>
      </div>
    </div>
  </div>
);