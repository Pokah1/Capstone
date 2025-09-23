import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Comment } from "@/types";

const supabase = createClient();

export function useComments(postId: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all comments for the post
  useEffect(() => {
    if (!postId) return;

    const fetchComments = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("post_comments")
          .select("*")
          .eq("post_id", postId)
          .order("commented_at", { ascending: true });

        if (error) throw error;

        const mapped = (data || []).map((c) => ({
          ...c,
          // Force "Anonymous" if author_name looks like an email or missing
          author_name:
            c.author_name && !c.author_name.includes("@")
              ? c.author_name
              : "Anonymous",
        }));

        setComments(mapped);
      } catch (err) {
        console.error("Fetch comments error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  // Add a new comment
  const addComment = async (text: string) => {
    if (!text.trim()) return false;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data: profile } = await supabase
        .from("users")
        .select("full_name")
        .eq("id", user.id)
        .single();

      const authorName =
        profile?.full_name?.trim() ||
        user.user_metadata?.full_name?.trim() ||
        "Anonymous";

      const { data, error } = await supabase
        .from("post_comments")
        .insert([
          {
            post_id: postId,
            user_id: user.id,
            comment: text,
            author_name: authorName,
          },
        ])
        .select()
        .single();

      if (error || !data) throw error || new Error("Failed to insert comment");

      setComments((prev) => [
        ...prev,
        { ...data, author_name: authorName || "Anonymous" },
      ]);

      return true;
    } catch (err) {
      console.error("Add comment error:", err);
      return false;
    }
  };

  // Edit a comment (only owner)
  const editComment = async (commentId: string, newText: string) => {
  if (!newText.trim()) return false;

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const existing = comments.find((c) => c.id === commentId);
    if (!existing || existing.user_id !== user.id) {
      console.warn("You can only edit your own comments");
      return false;
    }

    const { error } = await supabase
  .from("post_comments")
  .update({ comment: newText })
  .eq("id", commentId);

if (error) throw error;
   
    setComments((prev) =>
  prev.map((c) =>
    c.id === commentId
      ? { ...c, comment: newText, updated_at: new Date().toISOString() }
      : c
  )
);

    return true;
  } catch (err) {
    console.error("Edit comment error:", err);
    return false;
  }
};


  // Delete a comment if the current user is the author
  const deleteComment = async (commentId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const comment = comments.find((c) => c.id === commentId);
      if (!comment || comment.user_id !== user.id) {
        console.warn("You can only delete your own comments");
        return false;
      }

      const confirmed = window.confirm(
        "Are you sure you want to delete this comment?"
      );
      if (!confirmed) return false;

      const { error } = await supabase
        .from("post_comments")
        .delete()
        .eq("id", commentId);

      if (error) throw error;

      setComments((prev) => prev.filter((c) => c.id !== commentId));
      return true;
    } catch (err) {
      console.error("Delete comment error:", err);
      return false;
    }
  };

  return { comments, addComment, editComment, deleteComment, loading };
}
