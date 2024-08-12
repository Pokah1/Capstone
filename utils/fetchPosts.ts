import { createClient } from "@/utils/supabase/client";

export const fetchPosts = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.from("posts").select("*");
  if (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
  return data || [];
};
