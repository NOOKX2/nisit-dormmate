import { getPosts } from "@/app/action/feed";
import { CommunityContainer } from "@/app/(main)/community/_components/CommunityContainer";
import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function CommunityPage() {
    const user = await getAuthUser();

    if (!user) {
        redirect("/login");
    }

    const fullName = `${user.firstName} ${user.lastName}`;

    const initialPosts = await getPosts(user.id);

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <CommunityContainer
                initialPosts={initialPosts}
                currentUserId={user.id}
                currentUserName={fullName}
            />
        </div>
    );
}