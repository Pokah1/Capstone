import { signout } from "@/app/login/actions";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import Image from "next/image";
import profileIcon from "@/app/assets/profile-pic.jpg";
export default async function AuthButton() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <Link
        href="/"
        className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
      >
        Login
      </Link>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 text-white mt-7">
      <div className="flex items-center gap-2">
        <span>Hey, {user?.user_metadata?.full_name || user.email}</span>
        <Image
        src={user.user_metadata?.avatar_url || profileIcon}
        alt="Profile"
        width={50}
        height={50}
        className="rounded-full"
      />
   
      </div>
     
      <form action={signout} className="w-fit">
        <button className="bg-white text-black py-2 px-4 rounded-lg border border-gray-300 hover:bg-red-950 hover:text-white w-full text-left">
          Logout
        </button>
         
     
      </form>
     
    </div>
  );
}
