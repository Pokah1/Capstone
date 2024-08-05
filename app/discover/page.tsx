import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import FooterBottom from "@/components/firstPage/footerBottom";

export default async function Discover() {
    const supabase = createClient();
  
    const { data: { user }, error } = await supabase.auth.getUser();

    // Log the user session
    console.log("User Session:", user);

    if (error || !user) {
        redirect("/");
        return null; // To ensure no further rendering occurs
    }

    return (
        <div>
            <h1 className="text-white mt-3 font-bold">Discover</h1>
            <p className="text-white">Welcome, {user.email}</p>
            <FooterBottom />
        </div>
    );
}
