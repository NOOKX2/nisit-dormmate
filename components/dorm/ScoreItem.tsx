import { ReactNode } from 'react';

interface ScoreItemProps {
  icon: ReactNode;
  label: string;
  score: number;
  bgColorClass: string;
  textColorClass: string;
}

export function ScoreItem({ icon, label, score, bgColorClass, textColorClass }: ScoreItemProps) {
  return (
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${bgColorClass} ${textColorClass}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="font-bold">{score}</p>
      </div>
    </div>
  );
}