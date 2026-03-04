import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface DropdownItemProps {
  href?: string;
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  variant?: 'default' | 'danger';
}

export const DropdownItem = ({ href, icon: Icon, label, onClick, variant = 'default' }: DropdownItemProps) => {
  const baseStyles = "w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-200 first:rounded-t-lg last:rounded-b-lg";
  const variants = {
    default: "text-gray-600 hover:bg-gray-50 hover:text-emerald-600",
    danger: "text-red-500 hover:bg-red-50"
  };

  const content = (
    <>
      <Icon size={16} strokeWidth={2.5} />
      <span className="font-medium">{label}</span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={`${baseStyles} ${variants[variant]}`} onClick={onClick}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={`${baseStyles} ${variants[variant]}`}>
      {content}
    </button>
  );
};