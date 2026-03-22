"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { CloudUpload, FileImage, ImageIcon } from "lucide-react";

const MAX_BYTES = 10 * 1024 * 1024;

export interface UploadDormImageProps {
  /** รูปเดิมจากฐานข้อมูล (โหมดแก้ไข) */
  initialUrl?: string;
  /** ส่งไฟล์ดิบ + preview จาก URL.createObjectURL ให้แม่ — ไม่มี network ตอนเลือกไฟล์ */
  onFileSelect: (file: File | null, previewUrl: string) => void;
}

export default function UploadDormImage({
  initialUrl,
  onFileSelect,
}: UploadDormImageProps) {
  const [fileName, setFileName] = useState("");
  const [blobPreviewUrl, setBlobPreviewUrl] = useState<string | null>(null);
  const blobRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (blobRef.current) {
        URL.revokeObjectURL(blobRef.current);
        blobRef.current = null;
      }
    };
  }, []);

  const revokeCurrentBlob = () => {
    if (blobRef.current) {
      URL.revokeObjectURL(blobRef.current);
      blobRef.current = null;
    }
  };

  const displayUrl = blobPreviewUrl || initialUrl;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("กรุณาเลือกไฟล์รูปภาพเท่านั้น");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("ไฟล์ต้องขนาดไม่เกิน 10MB");
      return;
    }

    revokeCurrentBlob();
    const previewUrl = URL.createObjectURL(file);
    blobRef.current = previewUrl;
    setBlobPreviewUrl(previewUrl);
    setFileName(file.name);
    onFileSelect(file, previewUrl);
  };

  return (
    <div className="w-full space-y-4">
      {displayUrl && (
        <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-sm transition-all">
          <img
            src={displayUrl}
            alt="Dorm Preview"
            className="aspect-video w-full object-cover"
          />
        </div>
      )}

      <div className="relative">
        <input
          id="upload-dorm-image-input"
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={handleFileChange}
        />

        <label
          htmlFor="upload-dorm-image-input"
          className={`
            flex items-center justify-center rounded-xl border-2 border-dashed transition-all duration-300
            ${
              displayUrl
                ? "h-16 cursor-pointer border-gray-200 bg-white hover:border-emerald-400 hover:bg-emerald-50/30"
                : "h-32 cursor-pointer border-gray-300 bg-gray-50 hover:border-emerald-400 hover:bg-emerald-50/50"
            }
          `}
        >
          {displayUrl ? (
            <div className="flex w-full items-center justify-between px-4">
              <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
                <FileImage className="h-5 w-5 shrink-0 text-emerald-500" />
                <span className="truncate text-sm font-medium text-gray-600">
                  {fileName || "รูปภาพปัจจุบัน"}
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-600 transition-colors hover:bg-emerald-100">
                <CloudUpload className="h-4 w-4" />
                เปลี่ยนรูป
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <ImageIcon className="mb-2 h-6 w-6 text-emerald-600" />
              <span className="text-sm font-medium text-gray-700">
                คลิกเพื่อเลือกรูปภาพ
              </span>
              <span className="mt-1 text-xs text-gray-400">
                PNG, JPG สูงสุด 10MB — อัปโหลดตอนกดบันทึก
              </span>
            </div>
          )}
        </label>
      </div>
    </div>
  );
}
