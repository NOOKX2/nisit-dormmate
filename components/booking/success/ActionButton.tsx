import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ActionButtons() {
  return (
    <div className="w-full max-w-md mt-10 space-y-4">
      <Button asChild className="w-full py-8 text-lg font-black rounded-3xl bg-gray-900 hover:bg-black shadow-2xl transition-all active:scale-95">
        <Link href="/booking" className="flex items-center gap-2">
          ดูหอที่จองไว้ทั้งหมด <ArrowRight size={20} />
        </Link>
      </Button>
      <Button asChild variant="ghost" className="w-full py-6 text-gray-400 font-bold hover:text-gray-600">
        <Link href="/">กลับไปหน้าค้นหา</Link>
      </Button>
    </div>
  );
}