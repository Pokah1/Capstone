import { signout } from "@/app/login/actions";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";


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
    <div className="flex items-center gap-4 text-white">
      Hey, {user.email}!
      <form action={signout}>
        <button className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
        
          Logout
        </button>
  
      </form>
   
    </div>
  );
}
