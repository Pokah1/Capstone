'use client'

import { useEffect, useState } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";

interface ToastProps {
  message: string;
  type?: "success" | "error";
  duration?: number;
}

export default function ToastWrapper({
  message,
  type = "success",
  duration = 4000,
}: ToastProps) {
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (!message) return;

    setShowToast(true);
    const timer = setTimeout(() => setShowToast(false), duration);
    return () => clearTimeout(timer);
  }, [message, duration]);

  if (!showToast) return null;

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50">
      <div
        className={`px-6 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-fadeInOut border ${
          type === "success"
            ? "bg-green-500 text-white border-green-600"
            : "bg-red-600 text-white border-red-700"
        }`}
      >
        {type === "success" ? (
          <CheckCircle className="w-6 h-6 text-white" />
        ) : (
          <AlertCircle className="w-6 h-6 text-white" />
        )}
        <span className="font-semibold">{message}</span>
      </div>
    </div>
  );
}
