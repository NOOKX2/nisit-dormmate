import Link from "next/link";

interface MatchedCardProps {
  partnerId: string;
  partnerName: string;
  partnerImage: string | null;
}

export function MatchedCard({ partnerId, partnerName, partnerImage }: MatchedCardProps) {
  return (
    <div className="bg-linear-to-r from-emerald-50 to-teal-50 p-5 rounded-2xl border border-emerald-100 shadow-sm flex justify-between items-center">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-gray-200 rounded-full border-2 border-emerald-400 p-0.5 shrink-0">
          <img src={partnerImage || "/default-avatar.png"} alt="avatar" className="rounded-full w-full h-full object-cover" />
        </div>
        <div>
          <h3 className="font-bold text-gray-800 text-lg">{partnerName}</h3>
          <p className="text-sm text-emerald-600 font-medium">เป็นรูมเมทกันแล้ว 🎉</p>
        </div>
      </div>
      <Link href={`/chat?userId=${partnerId}&name=${encodeURIComponent(partnerName)}`}>
        <button className="px-4 py-2 bg-white text-gray-600 rounded-xl text-sm font-bold border border-gray-200 hover:bg-gray-50 hover:border-emerald-200 transition-all shrink-0">
          แชทเลย
        </button>
      </Link>
    </div>
  );
}