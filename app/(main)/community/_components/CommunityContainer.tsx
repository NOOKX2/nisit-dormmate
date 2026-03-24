// components/community/CommunityContainer.tsx
"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Filter, Flame, RefreshCcw } from "lucide-react";
import { getPosts } from "@/app/action/feed";
import { CreatePostForm } from "./CreatePostForm";
import { PostItem } from "./PostItem";

type PostTag = "ทั้งหมด" | "ทั่วไป" | "หาเมท" | "รีวิวหอ" | "เตือนภัย";

interface CommunityContainerProps {
  initialPosts: any[];
  currentUserId: string;
  currentUserName: string;
}

export function CommunityContainer({ initialPosts, currentUserId, currentUserName }: CommunityContainerProps) {
  // 🟢 ใช้ข้อมูลตั้งต้นจาก Server แทนการเริ่มด้วย []
  const [posts, setPosts] = useState<any[]>(initialPosts);
  const [activeTag, setActiveTag] = useState<PostTag>("ทั้งหมด");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchPosts = async () => {
    setIsRefreshing(true);
    try {
      const data = await getPosts(currentUserId);
      setPosts(data);
    } finally {
      setIsRefreshing(false);
    }
  };

  const tagOptions: PostTag[] = ["ทั้งหมด", "เตือนภัย", "หาเมท", "รีวิวหอ", "ทั่วไป"];

  const filteredPosts = useMemo(() => {
    if (activeTag === "ทั้งหมด") return posts;
    return posts.filter((p) => p.tag === activeTag);
  }, [posts, activeTag]);

  const safetyAlertCount = useMemo(
    () => posts.filter((p) => p.tag === "เตือนภัย").length,
    [posts],
  );

  return (
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
      {/* 📱 ฝั่งซ้าย: Community Feed */}
      <div className="flex-1 space-y-6">
        <CreatePostForm 
          currentUserId={currentUserId} 
          currentUserName={currentUserName} 
          onPostCreated={fetchPosts} 
        />

        {/* Safety + filter bar */}
        <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Filter size={16} className="text-emerald-600" />
              กรองตามหมวด
            </div>
            <button
              type="button"
              onClick={fetchPosts}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-60"
            >
              <RefreshCcw size={14} className={isRefreshing ? "animate-spin" : ""} />
              รีเฟรชฟีด
            </button>
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            {tagOptions.map((tag) => {
              const isActive = tag === activeTag;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setActiveTag(tag)}
                  className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                    isActive
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
              <AlertTriangle size={16} />
              แจ้งเตือนภัยในฟีด: <strong>{safetyAlertCount}</strong>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              <Flame size={16} />
              โพสต์ทั้งหมด: <strong>{posts.length}</strong>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <PostItem 
              key={post.id} 
              post={post} 
              currentUserId={currentUserId} 
              onActionComplete={fetchPosts}
            />
          ))}
          {filteredPosts.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
              ยังไม่มีโพสต์ในหมวดนี้ ลองเปลี่ยนตัวกรองหรือสร้างโพสต์ใหม่ได้เลย
            </div>
          )}
        </div>
      </div>
    </div>
  );
}