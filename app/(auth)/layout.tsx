import { NavbarOnlyLogo } from "@/components/navbar/NavbarOnlyLogo";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      < NavbarOnlyLogo/>
      <main>{children}</main>
    </div>
  );
}