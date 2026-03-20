interface DormHeroImageProps {
  imageUrl?: string;
  name?: string;
}

export function DormHeroImage({ imageUrl, name }: DormHeroImageProps) {
  return (
    <div className="w-full h-64 md:h-80 bg-gray-200 rounded-2xl overflow-hidden mb-6 relative shadow-sm">
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt={name || 'รูปภาพหอพัก'} 
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          ไม่มีรูปภาพ
        </div>
      )}
    </div>
  );
}