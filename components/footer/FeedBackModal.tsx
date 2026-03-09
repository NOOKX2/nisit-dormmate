"use client";

import { useState } from "react";
import { X, Loader2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { sendFeedbackAction } from "@/app/action/feedback";
import { FormError } from "../ui/FormError";
import { User } from "@prisma/client";

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User;
}

export function FeedbackModal({ isOpen, onClose, user }: FeedbackModalProps) {
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);


    if (!isOpen) return null; // ถ้า state ปิดอยู่ ไม่ต้องเรนเดอร์อะไรเลย

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsPending(true);

        const formData = new FormData(e.currentTarget);
        console.log(formData);
        const result = await sendFeedbackAction(formData);


        if (result?.success) {
            toast.success("ส่งข้อเสนอแนะเรียบร้อย ทีมงานจะรีบตรวจสอบครับ!");
            onClose(); // ส่งเสร็จแล้วปิดหน้าต่างอัตโนมัติ
        } else if (result?.error) {
            setError(result.error);
            toast.error(result.error);
        }

        setIsPending(false);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()} // ป้องกันการคลิกทะลุ
            >
                {/* Header ของ Modal */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-emerald-50/50">
                    <div className="flex items-center gap-2 text-emerald-700">
                        <MessageSquare size={20} strokeWidth={2.5} />
                        <h3 className="font-bold text-lg">แจ้งปัญหา / เสนอแนะ</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
                <FormError message={error} />

                {/* ฟอร์มส่งข้อมูล */}
                <form onSubmit={onSubmit} className="p-6">
                    <p className="text-sm text-gray-500 mb-4">
                        พบปัญหาการใช้งานระบบจองหอพัก หรือมีข้อเสนอแนะ พิมพ์บอกทีมงานได้เลยครับ ข้อความจะถูกส่งตรงถึงทีมดูแลระบบทันที
                    </p>

                    <input type="hidden" name="userName" value={user?.name || "บุคคลทั่วไป (ไม่ได้ล็อกอิน)"} />
                    <input type="hidden" name="userEmail" value={user?.email || "ไม่มีอีเมล"} />

                    <Textarea
                        name="message"
                        placeholder="อธิบายปัญหาที่คุณพบ เช่น หน้าเว็บโหลดช้า, กดจองไม่ได้..."
                        required
                        className="mb-6 rounded-2xl resize-none min-h-30 focus-visible:ring-emerald-500"
                    />

                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                            className="rounded-xl font-medium"
                        >
                            ยกเลิก
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-6 font-bold shadow-lg shadow-emerald-200"
                        >
                            {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> กำลังส่ง...</> : "ส่งข้อความ"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}