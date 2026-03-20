import { Banknote } from "lucide-react";
import { Input } from "@/components/ui/input";

interface PriceRangeProps {
  minPrice: string;
  maxPrice: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function PriceRangeCard({ minPrice, maxPrice, onChange }: PriceRangeProps) {
  return (
    <div className="grid grid-cols-2 gap-4 p-5 bg-emerald-50/40 rounded-3xl border border-emerald-100 shadow-sm">
      {/* ราคาเริ่มต้น */}
      <div className="space-y-2">
        <label className="text-xs font-bold flex items-center gap-2 text-emerald-700 uppercase tracking-wider">
          <Banknote size={14} /> ราคาเริ่มต้น
        </label>
        <Input
          name="minPrice"
          type="number"
          value={minPrice}
          onChange={onChange}
          placeholder="4000"
          required
          className="rounded-xl bg-white border-emerald-100 focus-visible:ring-emerald-500"
        />
      </div>

      {/* ราคาสูงสุด */}
      <div className="space-y-2">
        <label className="text-xs font-bold flex items-center gap-2 text-emerald-700 uppercase tracking-wider">
          <Banknote size={14} /> ราคาสูงสุด
        </label>
        <Input
          name="maxPrice"
          type="number"
          value={maxPrice}
          onChange={onChange}
          placeholder="8500"
          required
          className="rounded-xl bg-white border-emerald-100 focus-visible:ring-emerald-500"
        />
      </div>
    </div>
  );
}