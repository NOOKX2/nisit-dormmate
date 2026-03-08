import Navbar from "@/components/navbar/navbar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 🌟 เสียบ Navbar ไว้ตรงนี้ มันจะแสดงแค่ในกลุ่ม (main) */}
      < Navbar/>
      <main>{children}</main>
    </div>
  );
}