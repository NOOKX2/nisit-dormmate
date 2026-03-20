import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { redirect } from 'next/navigation';
import ProfileHeader from '@/app/(main)/profile/_components/ProfileHeader';
import ProfileStats from '@/app/(main)/profile/_components/ProfileStats';
import LifestyleCard from '@/app/(main)/profile/_components/LifeStyleCard';
import ActionMenu from '@/app/(main)/profile/_components/ActionMenu';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "");

export default async function ProfilePage() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) redirect('/login');

    let user = null;
    try {
        const { payload } = await jwtVerify(token, SECRET);
        user = await prisma.user.findUnique({
            where: { id: payload.userId as string }
        });
    } catch (error) {
        redirect('/login');
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24">
            {/* Banner Background */}
            <div className="bg-emerald-600 h-40 w-full shadow-inner" />
            
            <div className="max-w-md mx-auto px-6 -mt-16 space-y-6">
                {/* Profile Main Info Card */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 flex flex-col items-center">
                    <ProfileHeader name={`${user.firstName} ${user.lastName}`} email={user.email} />
                    <ProfileStats faculty={user.faculty} year={user.year} />
                </div>

                {/* Lifestyle Section */}
               <LifestyleCard user={user} />
               
                {/* Settings & History Menu */}
                <ActionMenu />
            </div>
        </div>
    );
}