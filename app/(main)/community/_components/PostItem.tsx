"use client";

import { useState } from "react";
import { Heart, MessageCircle, MessageSquare } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { createPostReply, togglePostLike } from "@/app/action/feed";

// 🟢 1. Import Component ย่อยเข้ามา
import { CommentItem } from "./CommentItem";
import { CommentInput } from "./CommentInput";

interface PostItemProps {
  post: any;
  currentUserId: string;
  onActionComplete: () => Promise<void>;
}

export function PostItem({ post, currentUserId, onActionComplete }: PostItemProps) {
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isReplyLoading, setIsReplyLoading] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState<{ id: string; name: string } | null>(null);

  const likedByMe = Array.isArray(post.likes) && post.likes.length > 0;
  const likeCount = post._count?.likes ?? 0;
  
  const totalReplies = post.replies?.reduce((total: number, r: any) => {
    return total + 1 + (r.replies?.length || 0);
  }, 0) || 0;

  const handleToggleLike = async () => {
    setIsLikeLoading(true);
    try {
      const result = await togglePostLike(post.id);
      if (!result.success) {
        toast.error(result.error || "ไม่สามารถกดถูกใจได้");
        return;
      }
      await onActionComplete();
    } finally {
      setIsLikeLoading(false);
    }
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setIsReplyLoading(true);
    try {
      const result = await createPostReply(post.id, replyText, replyingTo?.id);
      if (!result.success) {
        toast.error(result.error || "ตอบกลับไม่สำเร็จ");
        return;
      }
      setReplyText("");
      setReplyingTo(null);
      setShowReplies(true);
      await onActionComplete();
    } finally {
      setIsReplyLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
      {/* ส่วนหัวโพสต์ */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold">
            {post.authorName[0]}
          </div>
          <div>
            <p className="font-bold text-gray-900 leading-tight">{post.authorName}</p>
            <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString('th-TH')} เวลา {formatTime(post.createdAt)}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
          post.tag === 'หาเมท' ? 'bg-blue-100 text-blue-700' :
          post.tag === 'เตือนภัย' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
        }`}>
          {post.tag}
        </span>
      </div>
      
      {/* เนื้อหาโพสต์ */}
      <p className="text-gray-800 mb-4 whitespace-pre-wrap">{post.content}</p>

      {/* ปุ่ม Like & Comment */}
      <div className="mb-2 flex items-center gap-6 border-t border-gray-100 pt-3 pb-1">
        <button
          type="button"
          onClick={handleToggleLike}
          disabled={isLikeLoading}
          className={`inline-flex items-center gap-1.5 text-sm font-semibold transition ${
            likedByMe ? "text-rose-600" : "text-gray-500 hover:text-rose-600"
          } disabled:opacity-50`}
        >
          <Heart size={18} className={likedByMe ? "fill-rose-500" : ""} />
          ถูกใจ {likeCount > 0 && <span>({likeCount})</span>}
        </button>

        <button
          type="button"
          onClick={() => setShowReplies((v) => !v)}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-emerald-600"
        >
          <MessageCircle size={18} />
          คอมเมนต์ {totalReplies > 0 && <span>({totalReplies})</span>}
        </button>
      </div>

      {/* 🟢 โซนคอมเมนต์ (เรียกใช้ Component ย่อย) */}
      {showReplies && (
        <div className="mt-4 space-y-4 pt-4 border-t border-gray-50">
          {(post.replies || []).length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-2">เป็นคนแรกที่แสดงความคิดเห็นสิ</p>
          ) : (
            (post.replies || []).map((reply: any) => (
              <CommentItem 
                key={reply.id} 
                reply={reply} 
                onReplyClick={(id, name) => setReplyingTo({ id, name })} 
              />
            ))
          )}

          <CommentInput 
            replyText={replyText}
            setReplyText={setReplyText}
            replyingTo={replyingTo}
            setReplyingTo={setReplyingTo}
            onSubmit={handleReplySubmit}
            isLoading={isReplyLoading}
          />
        </div>
      )}
      
      {/* ปุ่มทักแชท */}
      {post.authorId !== currentUserId && (
        <div className="mt-4 pt-3 flex justify-end">
          <Link 
            href={`/chat?userId=${post.authorId}&name=${post.authorName}`}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 border border-emerald-100"
          >
            <MessageSquare size={14} /> ทักแชทส่วนตัว
          </Link>
        </div>
      )}
    </div>
  );
}