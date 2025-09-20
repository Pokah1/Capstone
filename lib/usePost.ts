// lib/usePost.ts
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Post } from "@/types";

const supabase = createClient();

export function usePost(postId?: string) {
  const [post, setPost] = useState<Post | null>(null);
  const [authorName, setAuthorName] = useState<string>("Anonymous");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!postId) return;

    const fetchPost = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", postId)
        .single();

      if (!error && data) {
        setPost(data as Post);

        if (data.user_id) {
          const { data: profile } = await supabase
            .from("users")
            .select("full_name")
            .eq("id", data.user_id)
            .single();

          setAuthorName(profile?.full_name || "Anonymous");
        }
      }

      setLoading(false);
    };

    fetchPost();
  }, [postId]);

  return { post, authorName, loading };
}
