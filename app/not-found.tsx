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
        router.replace("/dashboard"); //logged in
      } else {
        router.replace("/"); // home for not logged in
      }
    };
    checkUser();
  }, [router]);

  return (
    <main className="bg-cover bg-center flex justify-center items-center min-h-screen w-full text-white bg-[url('/assets/404.webp')]">
      <div className="text-center">
        <h1 className="text-4xl mb-4">404 - Page Not Found</h1>
        <p className="mb-4">
          Sorry, the page you are looking for does not exist.
        </p>
        <p className="text-white underline">Redirecting...</p>
      </div>
    </main>
  );
};

export default NotFound;
