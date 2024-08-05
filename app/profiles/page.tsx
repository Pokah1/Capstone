// // app/profile/page.tsx

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import FooterBottom from "@/components/firstPage/footerBottom";
import Image from "next/image";

import ProfileSetup from "@/components/ProfileForm";


export default async function ProfilePage() {
  const supabase = createClient();
  
      const { data: { user }, error } = await supabase.auth.getUser();
  
      // Log the user session
    console.log("User Session:", user);

    if (error || !user) {
              redirect("/");
              return null; 
          }
  return (
    <div>
      <h1 className="text-white">Setup Your Profile</h1>
      <p className="text-white">Welcome, {user.email}</p>
  <p className="text-white">User ID{user.id}</p>
     <ProfileSetup/>
     <FooterBottom/>
    </div>
  );
}





