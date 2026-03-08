import Link from 'next/link';
import { Building2 } from 'lucide-react';

export function NavbarOnlyLogo() {
  return (
 
    <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="bg-emerald-500 text-white p-2 rounded-xl">
            <Building2 size={20} />
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">
            Nisit<span className="text-emerald-600"> Dormmate</span>
          </span>
        </Link>

      </div>
    </nav>
  );
}