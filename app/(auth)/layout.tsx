import { NavbarOnlyLogo } from "@/components/Navbar/NavbarOnlyLogo";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      < NavbarOnlyLogo/>
      <main>{children}</main>
    </div>
  );
}