"use client";

import { useState } from "react";
import { Send, MessageSquare } from "lucide-react";
import { createPost } from "@/app/action/feed";

interface CreatePostFormProps {
  currentUserId: string;
  currentUserName: string;
  onPostCreated: () => void; // ฟังก์ชันเรียกให้ดึงฟีดใหม่หลังโพสต์เสร็จ
}

export function CreatePostForm({ currentUserId, currentUserName, onPostCreated }: CreatePostFormProps) {
  const [newPostText, setNewPostText] = useState("");
  const [selectedTag, setSelectedTag] = useState("ทั่วไป");

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;
    
    await createPost(newPostText, currentUserId, currentUserName, selectedTag);
    setNewPostText("");
    onPostCreated(); // สั่งให้หน้าหลักรีเฟรชฟีด
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
      <h1 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <MessageSquare className="text-emerald-600" /> Nisit Community
      </h1>
      
      <form onSubmit={handlePost} className="space-y-4">
        <textarea 
          value={newPostText}
          onChange={(e) => setNewPostText(e.target.value)}
          placeholder="มีอะไรอยากแชร์ให้เพื่อนๆ นิสิตรู้ไหม?"
          className="w-full bg-gray-50 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none h-24 text-gray-800"
        />
        <div className="flex justify-between items-center">
          <select 
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="bg-gray-100 px-4 py-2 rounded-full text-sm font-medium text-gray-700 outline-none"
          >
            <option value="ทั่วไป">📌 ทั่วไป</option>
            <option value="หาเมท">🤝 หาเมท</option>
            <option value="รีวิวหอ">🏢 รีวิวหอ</option>
            <option value="เตือนภัย">⚠️ เตือนภัย</option>
          </select>
          <button type="submit" disabled={!newPostText.trim()} className="px-6 py-2 bg-emerald-600 text-white font-bold rounded-full hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2 transition-all">
            <Send size={16} /> โพสต์เลย
          </button>
        </div>
      </form>
    </div>
  );
}