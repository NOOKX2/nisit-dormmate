import UploadDormImage from "@/app/(detail)/admin/add-dorm/_components/UploadDormImage";

interface DormImageSectionProps {
  imageUrl: string;
  onFileSelect: (file: File | null, previewUrl: string) => void;
}

export function DormImageSection({ imageUrl, onFileSelect }: DormImageSectionProps) {
  return (
    <div className="-mx-6 -mt-6 mb-6 space-y-3 border-b border-gray-100 bg-gray-50 md:-mx-8 md:-mt-8">
      <div className="space-y-4 p-4 sm:p-6">
        <label className="text-sm font-bold text-gray-700">
          แก้ไขรูปภาพหอพัก (Banner)
        </label>

        <UploadDormImage initialUrl={imageUrl} onFileSelect={onFileSelect} />
      </div>
    </div>
  );
}
