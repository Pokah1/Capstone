
import "./globals.css";
import { createClient } from "@/utils/supabase/server";
import Header from '@/components/firstPage/header'
import Footer from "@/components/firstPage/footer";

export default async function Index() {
  const canInitSupabaseClient = () => {
    // This function is just for the interactive tutorial.
    // Feel free to remove it once you have Supabase connected.
    try {
      createClient();
      return true;
    } catch (e) {
      return false;
    }
  };

  const isSupabaseConnected = canInitSupabaseClient();

  return (
  <div>
      <Header />
      <Footer/>
   
  </div>
  );
}
