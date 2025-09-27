import { createClient } from "./supabase/client";
import { Post } from "@/types";

const supabase = createClient();

// Save new post
export const savePost = async (
  title: string,
  content: string,
  coverUrl: string,
  userId: string,
  authorName: string
): Promise<Post> => {
  const { data, error } = await supabase
    .from("posts")
    .insert({
      title,
      content,
      cover_url: coverUrl,
      user_id: userId,
      author_name: authorName,
    })
    .select()
    .single();

  if (error || !data) {
    console.error("Error saving post:", error);
    throw error || new Error("Failed to save post");
  }

  return data;
};

// Update existing post
export const updatePost = async (
  id: string,
  title: string,
  content: string,
  coverUrl: string
): Promise<Post> => {
  const { data, error } = await supabase
    .from("posts")
    .update({ title, content, cover_url: coverUrl })
    .eq("id", id)
    .select()
    .single();

  if (error || !data) {
    console.error("Error updating post:", error);
    throw error || new Error("Failed to update post");
  }

  return data;
};

// Fetch all posts
export const fetchPosts = async (): Promise<Post[]> => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Error fetching posts:", error);
    return [];
  }

  return data;
};
