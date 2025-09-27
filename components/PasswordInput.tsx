"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type PasswordInputProps = {
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
};

export default function PasswordInput({
  name,
  label,
  required,
  placeholder = "••••••••",
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <label className="block text-sm mb-1">{label}</label>
      <input
        type={showPassword ? "text" : "password"}
        name={name}
        required={required}
        placeholder={placeholder}
        className="w-full px-4 py-3 pr-10 rounded-lg bg-gray-800/70 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 outline-none"
      />
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-yellow-400"
        tabIndex={-1} // avoid focusing when tabbing through form
      >
        {showPassword ? (
          <EyeOff className="w-5 h-5 mt-5" />
        ) : (
          <Eye className="w-5 h-5 mt-5" />
        )}
      </button>
    </div>
  );
}
