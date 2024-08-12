import { createClient } from "@/utils/supabase/client";

export const fetchUser = async (router: any) => {
  const supabase = createClient();

  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      console.error("Error fetching user:", error);
      router.push("/");
      return null;
    }
    return user;
  } catch (error) {
    console.error("Error in fetchUser:", error);
    router.push("/");
    return null;
  }
};
