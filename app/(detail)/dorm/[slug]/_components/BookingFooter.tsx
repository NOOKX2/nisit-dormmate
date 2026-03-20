import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface BookingFooterProps {
  hasBooked: boolean;
  dormSlug: string;
}

export function BookingFooter({ hasBooked, dormSlug }: BookingFooterProps) {
  return (
    <div className="fixed md:sticky md:bottom-6 bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur border-t border-gray-100 flex justify-center z-50">
      <div className="max-w-3xl w-full">
        {hasBooked ? (
          <Button disabled className="py-6 w-full text-lg rounded-2xl bg-gray-200 text-gray-500 cursor-not-allowed">
            จองหอพักเรียบร้อยแล้ว
          </Button>
        ) : (
          <Link href={`/dorm/${dormSlug}/booking`} className="w-full">
            <Button className="py-6 w-full text-lg rounded-2xl bg-gray-900 hover:bg-black text-white transition-all active:scale-[0.98]">
              จองหอพักนี้
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}