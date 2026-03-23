import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import { DashboardAuthSync } from "./dashboard-client";

export default async function DashboardPage() {
  const user = await getAuthUser();
  if (!user) {
    redirect("/login");
  }

  const { password: _, ...safeUser } = user;

  return (
    <div className="mx-auto min-h-[60vh] max-w-lg px-4 py-16">
      <DashboardAuthSync user={safeUser} />
      <h1 className="text-2xl font-bold text-gray-900">แดชบอร์ด</h1>
      <p className="mt-2 text-gray-600">
        สวัสดี {safeUser.firstName} — เข้าสู่ระบบด้วย Google สำเร็จแล้ว
      </p>
      <p className="mt-1 text-sm text-gray-500">{safeUser.email}</p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700"
      >
        กลับหน้าหลัก
      </Link>
    </div>
  );
}
