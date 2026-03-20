import React from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  containerClassName?: string;
}

export function FormInput({ label, containerClassName = "", ...props }: FormInputProps) {
  return (
    <div className={`space-y-2 ${containerClassName}`}>
      <label className="text-sm font-bold text-gray-700">{label}</label>
      <input
        {...props}
        className="w-full p-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
      />
    </div>
  );
}