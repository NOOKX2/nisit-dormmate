export function CommentItem({ reply, onReplyClick }: { reply: any; onReplyClick: (id: string, name: string) => void }) {
  // ฟังก์ชันแปลงเวลา
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex gap-2">
      <div className="w-8 h-8 shrink-0 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold text-xs mt-1">
        {reply.authorName[0]}
      </div>

      <div className="flex-1 space-y-1">
        {/* กล่องคอมเมนต์หลัก */}
        <div className="inline-block bg-gray-100 rounded-2xl px-3 py-2 max-w-full">
          <p className="text-sm font-bold text-gray-900">{reply.authorName}</p>
          <p className="text-sm text-gray-800 whitespace-pre-wrap leading-snug">{reply.content}</p>
        </div>
        
        <div className="flex items-center gap-4 px-2 text-xs font-semibold text-gray-500">
          <span>{formatTime(reply.createdAt)}</span>
          <button 
            onClick={() => onReplyClick(reply.id, reply.authorName)}
            className="hover:text-emerald-600 hover:underline"
          >
            ตอบกลับ
          </button>
        </div>

        {/* กล่องคอมเมนต์ย่อย */}
        {(reply.replies || []).length > 0 && (
          <div className="mt-2 space-y-3">
            {(reply.replies || []).map((subReply: any) => (
              <div key={subReply.id} className="flex gap-2">
                <div className="w-6 h-6 shrink-0 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-700 font-bold text-[10px] mt-1">
                  {subReply.authorName[0]}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="inline-block bg-gray-100 rounded-2xl px-3 py-2 max-w-full">
                    <p className="text-[13px] font-bold text-gray-900">{subReply.authorName}</p>
                    <p className="text-[13px] text-gray-800 whitespace-pre-wrap leading-snug">
                      <span className="text-emerald-600 font-medium mr-1">@{reply.authorName}</span>
                      {subReply.content}
                    </p>
                  </div>
                  <div className="px-2 text-[11px] font-semibold text-gray-400">
                    {formatTime(subReply.createdAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}