interface AmenityOption {
  id: string;
  label: string;
}

interface AmenitiesSelectorProps {
  title: string;
  options: readonly AmenityOption[]; // รับ array ที่มาจาก config (as const)
  selected: string[];
  onToggle: (val: string) => void;
}

export function AmenitiesSelector({
  title,
  options,
  selected,
  onToggle,
}: AmenitiesSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-bold text-gray-700">{title}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isSelected = selected.includes(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onToggle(opt.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                isSelected
                  ? "bg-emerald-100 border-emerald-500 text-emerald-800 shadow-sm"
                  : "bg-white border-gray-200 text-gray-600 hover:border-emerald-300 hover:bg-emerald-50"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}