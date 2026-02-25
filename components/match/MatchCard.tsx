import { Badge } from '@/components/ui/badge'; 
import { Heart, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import { Button } from '../ui/button';

interface MatchCardProps {
  name: string;
  faculty: string;
  year: number;
  matchScore: number;
  tags: string[];
  imageUrl: string;
}

export function MatchCard({ name, faculty, year, matchScore, tags, imageUrl }: MatchCardProps) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4 mb-4">
      <div className="flex justify-between items-start">
        <div className="flex gap-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden">
             {/* Note: ใช้ src ชั่วคราว หรือรับ prop imageUrl */}
            <div className="w-full h-full bg-gray-200"></div> 
            <div className="absolute bottom-0 right-0 bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
              {matchScore}%
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">{name}</h3>
            <p className="text-sm text-gray-500 mb-2">คณะ{faculty} • ปี {year}</p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                // แก้ไขการเรียกใช้ Badge ให้ตรงกับ shadcn/ui (เอา text ไว้ตรงกลาง)
                <Badge key={index} variant="secondary" className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-none font-medium">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xl font-bold text-emerald-600">{matchScore}%</span>
          <p className="text-xs text-gray-400">Match Score</p>
        </div>
      </div>

      <div className="flex gap-3 mt-2">
        {/* แก้ไข Button: เปลี่ยน fullWidth เป็น w-full และใช้ class แทน variant primary */}
        <Button className="w-full py-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium">
          <Heart size={18} className="mr-2" /> Request Match
        </Button>
        <Button variant="outline" className="px-6 py-5 rounded-xl border-2 border-gray-200 text-gray-600 hover:bg-gray-50 font-medium">
          <MessageCircle size={18} className="mr-2" /> Chat
        </Button>
      </div>
    </div>
  );
}