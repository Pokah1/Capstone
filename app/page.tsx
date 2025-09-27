import "./globals.css";
import { createClient } from "@/utils/supabase/server";
import Header from "@/components/firstPage/header";
import Footer from "@/components/firstPage/footer";
import ToastWrapper from "@/components/LoginToastWrapper";

export default async function Index({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const code = typeof params.code === "string" ? params.code : undefined;

  const canInitSupabaseClient = () => {
    try {
      createClient();
      return true;
    } catch {
      return false;
    }
  };

  const isSupabaseConnected = canInitSupabaseClient();

  return (
    <div className="w-full flex flex-col">
      <Header />
      <ToastWrapper code={code} />
      <main className="w-full flex flex-col items-center justify-center">
        {/* Placeholder for page content */}
      </main>
      <Footer />
    </div>
  );
}