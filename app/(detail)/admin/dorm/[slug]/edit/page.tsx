import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { EditDormForm } from "@/components/admin/dorm/edit/EditDormForm";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function AdminEditDormPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = decodeURIComponent(resolvedParams.slug);
  
  // ดึงข้อมูลหอพักเดิมเพื่อเอาไปใส่เป็นค่าเริ่มต้นในฟอร์ม
  const dorm = await prisma.dorm.findUnique({
    where: { slug: slug },
  });

  if (!dorm) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-6">
      
      {/* 🔙 Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href={`/admin/dorm/${dorm.slug}`} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft size={24} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">แก้ไขข้อมูลทั่วไป</h1>
          <p className="text-sm text-gray-500">{dorm.name}</p>
        </div>
      </div>

      {/* เรียกใช้งานฟอร์ม Client Component */}
      <EditDormForm dorm={dorm} />

    </div>
  );
}