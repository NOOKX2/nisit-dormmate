import { Send, X, CornerDownRight } from "lucide-react";

export function CommentInput({ 
  replyText, 
  setReplyText, 
  replyingTo, 
  setReplyingTo, 
  onSubmit, 
  isLoading 
}: any) {
  return (
    <div className="mt-4 pt-2 flex gap-2 items-start">
      <div className="w-8 h-8 shrink-0 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xs mt-1">
        ฉัน
      </div>
      <div className="flex-1">
        {replyingTo && (
          <div className="flex justify-between items-center bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-t-xl ml-1 w-fit mb-1.25 relative z-0">
            <span className="flex items-center gap-1 font-medium">
              <CornerDownRight size={12} /> ตอบกลับ {replyingTo.name}
            </span>
            <button type="button" onClick={() => setReplyingTo(null)} className="ml-2 hover:text-red-500">
              <X size={12} />
            </button>
          </div>
        )}
        <form onSubmit={onSubmit} className="relative z-10">
          <input
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder={replyingTo ? `พิมพ์ข้อความ...` : "เขียนคอมเมนต์..."}
            className={`w-full bg-gray-100 text-sm px-4 py-2.5 outline-none focus:ring-1 focus:ring-emerald-500 transition-all ${replyingTo ? 'rounded-b-2xl rounded-tr-2xl' : 'rounded-full'}`}
            maxLength={500}
          />
          <button
            type="submit"
            disabled={isLoading || !replyText.trim()}
            className="absolute right-2 top-1.5 p-1.5 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 disabled:opacity-0 transition-opacity"
          >
            <Send size={14} className="ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
}