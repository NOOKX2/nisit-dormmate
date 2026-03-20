"use client";

import { MessageSquare } from "lucide-react";
import Link from "next/link";

interface PostItemProps {
  post: any;
  currentUserId: string;
  // onChatClick ไม่จำเป็นต้องใช้แล้วถ้าเราจะเด้งไปหน้าอื่น (แต่เก็บไว้เป็น props ได้ถ้าคอมโพเนนต์แม่ยังส่งมาอยู่)
}

export function PostItem({ post, currentUserId }: PostItemProps) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold">
            {post.authorName[0]}
          </div>
          <div>
            <p className="font-bold text-gray-900">{post.authorName}</p>
            <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString('th-TH')}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
          post.tag === 'หาเมท' ? 'bg-blue-100 text-blue-700' :
          post.tag === 'เตือนภัย' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
        }`}>
          {post.tag}
        </span>
      </div>
      
      <p className="text-gray-800 mb-4 whitespace-pre-wrap">{post.content}</p>
      
      {/* 🟢 ปุ่มพระเอก: กดเพื่อเด้งไปหน้าแชท พร้อมส่งข้อมูลผ่าน URL */}
      {post.authorId !== currentUserId && (
        <div className="mt-4 pt-4 border-t border-gray-50 flex justify-end">
          <Link 
            // 🎯 จุดสำคัญ: แนบ ID และ ชื่อ ไปกับ URL (เช่น /chat?userId=123&name=John)
            href={`/chat?userId=${post.authorId}&name=${post.authorName}`}
            className="text-sm font-bold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 px-4 py-2 rounded-full transition-all flex items-center gap-2"
          >
            <MessageSquare size={16} /> ทักแชทส่วนตัว
          </Link>
        </div>
      )}
    </div>
  );
}