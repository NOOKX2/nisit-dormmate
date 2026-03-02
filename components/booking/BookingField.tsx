export function BookingField({ label, icon: Icon, ...props }: any) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1">
        {Icon && <Icon size={12} />} {label}
      </label>
      <input {...props} className="w-full p-4 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500 transition-all outline-none font-medium" />
    </div>
  );
}