"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

const NotFound = () => {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        router.replace("/dashboard"); // logged in → dashboard
      } else {
        router.replace("/"); // not logged in → home
      }
    };
    checkUser();
  }, [router]);

  return (
    <main className="bg-cover bg-center flex justify-center items-center min-h-screen w-full text-white bg-[url('/assets/404.webp')]">
      <div className="text-center px-4 sm:px-6 md:px-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-bold mb-4">
          404 - Page Not Found
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-4 font-poppins">
          Sorry, the page you are looking for does not exist.
        </p>
        <p className="text-sm sm:text-base text-white underline font-poppins">
          Redirecting...
        </p>
      </div>
    </main>
  );
};

export default NotFound;
