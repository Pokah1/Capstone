"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from '@/utils/supabase/client';

export default function SocialLogin() {
  const router = useRouter();

  const handleSocialLogin = async (provider: 'facebook' | 'google' | 'github') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      console.error("Error logging in with provider:", error);
      // Handle the error appropriately, e.g., show a message to the user
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push("/dashboard");
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={() => handleSocialLogin("github")}
        className="bg-gray-800 rounded-md px-4 py-2 text-white"
      >
        Sign in with GitHub
      </button>
      <button
        onClick={() => handleSocialLogin("google")}
        className="bg-blue-600 rounded-md px-4 py-2 text-white"
      >
        Sign in with Google
      </button>
      <button
        onClick={() => handleSocialLogin("facebook")}
        className="bg-blue-800 rounded-md px-4 py-2 text-white"
      >
        Sign in with Facebook
      </button>
    </div>
  );
}
