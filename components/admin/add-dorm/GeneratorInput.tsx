"use client";

import React from "react";

interface GeneratorInputProps {
  label: string;
  name: string;
  value: number | string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  placeholder?: string;
}

export function GeneratorInput({ 
  label, 
  name, 
  value, 
  onChange, 
  className = "", 
  placeholder 
}: GeneratorInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-wider">
        {label}
      </label>
      <input
        name={name}
        type="number"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full p-3 bg-gray-50 rounded-xl outline-none border border-transparent focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all  text-gray-700 ${className}`}
      />
    </div>
  );
}