import { prisma } from "@/lib/db";
import { Users, Building2, Plus, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/admin/StatCard";
import { DormTable } from "@/components/admin/DormTable";

export default async function AdminDashboard() {
  const [userCount, dormCount, latestDorms] = await Promise.all([
    prisma.user.count(),
    prisma.dorm.count(),
    prisma.dorm.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    })
  ]);

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Admin Console</h1>
            <p className="text-gray-500">จัดการข้อมูลระบบ Nisit Dormmate</p>
          </div>
          <Link href="/admin/add-dorm">
            <Button className="bg-emerald-600 hover:bg-emerald-700 rounded-xl gap-2 shadow-lg shadow-emerald-100">
              <Plus size={18} /> เพิ่มหอพักใหม่
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="นิสิตทั้งหมด" value={userCount} icon={<Users className="text-blue-600" />} color="bg-blue-50" />
          <StatCard title="หอพักในระบบ" value={dormCount} icon={<Building2 className="text-emerald-600" />} color="bg-emerald-50" />
          <StatCard title="ความปลอดภัย" value="Active" icon={<ShieldCheck className="text-purple-600" />} color="bg-purple-50" />
        </div>

        <DormTable dorms={latestDorms} />
      </div>
    </div>
  );
}