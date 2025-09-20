import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export function useLikes(postId: string) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);

  // Fetch likes for the post
  useEffect(() => {
    if (!postId) return;

    const fetchLikes = async () => {
      try {
        const { data, error } = await supabase
          .from("post_likes")
          .select("user_id")
          .eq("post_id", postId);

        if (error) throw error;

        setCount(data?.length || 0);

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setLiked(data?.some(like => like.user_id === user.id) || false);
        }
      } catch (err) {
        console.error("Fetch likes error:", err);
      }
    };

    fetchLikes();
  }, [postId]);

  // Toggle like/unlike (atomic + safe)
  const toggleLike = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      if (liked) {
        // Unlike (delete)
        const { error } = await supabase
          .from("post_likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", user.id);

        if (error) throw error;
        setLiked(false);
        setCount(c => Math.max(c - 1, 0));
      } else {
        // Like (insert, will fail if already exists)
        const { error } = await supabase
          .from("post_likes")
          .insert([{ post_id: postId, user_id: user.id }]);

        if (error) {
          // If unique constraint violation, just ignore
          if (error.code !== "23505") throw error;
        } else {
          setLiked(true);
          setCount(c => c + 1);
        }
      }
    } catch (err) {
      console.error("Toggle like error:", err);
    }
  };

  return { liked, count, toggleLike };
}
