import { Send } from "lucide-react";

interface ChatInputProps {
  text: string;
  setText: (text: string) => void;
  handleSend: (e: React.FormEvent) => void;
}

export function ChatInput({ text, setText, handleSend }: ChatInputProps) {
  return (
    <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex gap-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="พิมพ์ข้อความ..."
        className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
      />
      <button 
        type="submit" 
        disabled={!text.trim()} 
        className="p-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 disabled:opacity-50 disabled:hover:bg-emerald-600 transition-colors"
      >
        <Send size={18} className="ml-0.5" />
      </button>
    </form>
  );
}