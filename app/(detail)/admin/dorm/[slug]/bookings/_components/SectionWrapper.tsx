export function SectionWrapper({ title, icon: Icon, children }: any) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600 shadow-sm"><Icon size={22} /></div>
        <h3 className="text-lg font-bold text-gray-900">{title} <span className="text-red-500">*</span></h3>
      </div>
      {children}
    </section>
  );
}