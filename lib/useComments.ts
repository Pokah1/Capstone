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

        const mapped = (data || []).map(c => ({
          ...c,
          author_name: c.author_name || "Anonymous",
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
    if (!text.trim()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("post_comments")
        .insert([{
          post_id: postId,
          user_id: user?.id || null,
          comment: text,
          author_name: user?.user_metadata?.full_name || "Anonymous"
        }])
        .select()
        .single();

      if (error || !data) throw error || new Error("Failed to insert comment");

      setComments(prev => [...prev, { ...data, author_name: data.author_name || "Anonymous" }]);
    } catch (err) {
      console.error("Add comment error:", err);
    }
  };

  // Delete a comment if the current user is the author
 const deleteComment = async (commentId: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const comment = comments.find(c => c.id === commentId);
    if (!comment || comment.user_id !== user.id) {
      console.warn("You can only delete your own comments");
      return;
    }

    // Confirmation dialog
    const confirmed = window.confirm("Are you sure you want to delete this comment?");
    if (!confirmed) return;

    const { error } = await supabase
      .from("post_comments")
      .delete()
      .eq("id", commentId);

    if (error) throw error;

    setComments(prev => prev.filter(c => c.id !== commentId));
  } catch (err) {
    console.error("Delete comment error:", err);
  }
};


  return { comments, addComment, deleteComment, loading };
}
