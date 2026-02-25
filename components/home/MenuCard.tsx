import Link from 'next/link';
import { ReactNode } from 'react';

interface MenuCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  linkText: string;
  href: string;
}

export function MenuCard({ title, description, icon, linkText, href }: MenuCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-start hover:shadow-md transition-shadow">
      <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-4 grow">{description}</p>
      <Link href={href} className="text-emerald-600 text-sm font-semibold hover:underline flex items-center gap-1 mt-auto">
        {linkText} <span className="text-lg">›</span>
      </Link>
    </div>
  );
}