import { User } from 'lucide-react';

export default function ProfileHeader({ name, email }: { name: string; email: string }) {
    return (
        <div className="flex flex-col items-center text-center">
            <div className="w-28 h-28 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 border-[6px] border-white shadow-xl -mt-20">
                <User size={56} strokeWidth={1.5} />
            </div>
            <h1 className="text-2xl font-black mt-4 text-gray-900 tracking-tight">{name}</h1>
            <p className="text-gray-400 text-sm font-medium">{email}</p>
        </div>
    );
}