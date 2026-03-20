// components/community/CommunityContainer.tsx
"use client";

import { useState } from "react";
import { getPosts } from "@/app/action/feed";
import { CreatePostForm } from "./CreatePostForm";
import { PostItem } from "./PostItem";

interface CommunityContainerProps {
  initialPosts: any[];
  currentUserId: string;
  currentUserName: string;
}

export function CommunityContainer({ initialPosts, currentUserId, currentUserName }: CommunityContainerProps) {
  // 🟢 ใช้ข้อมูลตั้งต้นจาก Server แทนการเริ่มด้วย []
  const [posts, setPosts] = useState<any[]>(initialPosts);

  const fetchPosts = async () => {
    const data = await getPosts();
    setPosts(data);
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
      {/* 📱 ฝั่งซ้าย: Community Feed */}
      <div className="flex-1 space-y-6">
        <CreatePostForm 
          currentUserId={currentUserId} 
          currentUserName={currentUserName} 
          onPostCreated={fetchPosts} 
        />

        <div className="space-y-4">
          {posts.map((post) => (
            <PostItem 
              key={post.id} 
              post={post} 
              currentUserId={currentUserId} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}