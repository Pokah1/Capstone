'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";

export default function ToastWrapper({ code }: { code?: string }) {
  const [showToast, setShowToast] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (code) {
      setShowToast(true);

      // hide toast after 3s and redirect
      const timer = setTimeout(() => {
        setShowToast(false);
        router.push("/dashboard");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [code, router]);

  if (!showToast) return null;

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-yellow-400 text-black px-6 py-3 rounded-lg shadow-xl border border-yellow-500 animate-fadeInOut flex items-center gap-3">
        <CheckCircle className="w-6 h-6 text-black" />
        <span className="font-semibold">You’ve signed in successfully! Redirecting…</span>
      </div>
    </div>
  );
}
