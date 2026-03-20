"use client";

import { useState } from "react";
import { toggleLikeReview } from "@/app/action/review";

interface ReviewLikeButtonProps {
  reviewId: string;
  initialLikes: number;
}

export function ReviewLikeButton({ reviewId, initialLikes }: ReviewLikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLikeClick = async () => {
    if (isLoading) return;
    setIsLoading(true);

    const newLikedState = !hasLiked;
    setHasLiked(newLikedState);
    setLikes((prev) => newLikedState ? prev + 1 : prev - 1);

    await toggleLikeReview(reviewId, newLikedState);
    
    setIsLoading(false);
  };

  return (
    <button 
      onClick={handleLikeClick}
      disabled={isLoading}
      className={`text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all font-medium border mt-4 ${
        hasLiked 
          ? 'bg-blue-50 text-blue-600 border-blue-200' 
          : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50 hover:text-gray-700' 
      }`}
    >
      <span className={`text-sm transition-transform ${hasLiked ? 'scale-110' : ''}`}>
        {hasLiked ? '❤️' : '👍'} 
      </span> 
      {hasLiked ? 'ถูกใจแล้ว' : 'ถูกใจรีวิวนี้'} 
      {likes > 0 && <span className="ml-1 opacity-80">({likes})</span>}
    </button>
  );
}