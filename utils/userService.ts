// lib/posts.ts
import { Post } from "@/types";

// Fetch all posts
export const fetchPosts = async (): Promise<Post[]> => {
  try {
    const response = await fetch("/api/posts");
    if (!response.ok) throw new Error("Error fetching posts");
    return await response.json();
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
};

// Fetch single post by ID
export const fetchPostData = async (postId: string): Promise<Post | null> => {
  try {
    const response = await fetch(`/api/posts/${postId}`);
    if (!response.ok) throw new Error("Error fetching post");
    return await response.json();
  } catch (error) {
    console.error("Error fetching post data:", error);
    return null;
  }
};

// Save new post
export const savePost = async (
  title: string,
  content: string,
  coverUrl: string,
  userId: string,
  authorName: string
): Promise<Post> => {
  try {
    const response = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, cover_url: coverUrl, user_id: userId, author_name: authorName }),
    });
    if (!response.ok) throw new Error("Error saving post");
    return await response.json();
  } catch (error) {
    console.error("Error saving post:", error);
    throw error;
  }
};

// Update existing post
export const updatePost = async (
  id: string,
  title: string,
  content: string,
  coverUrl: string
): Promise<Post> => {
  try {
    const response = await fetch(`/api/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, cover_url: coverUrl }),
    });
    if (!response.ok) throw new Error("Error updating post");
    return await response.json();
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
};

// Delete a post
export const deletePost = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`/api/posts/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Error deleting post");
    return true;
  } catch (error) {
    console.error("Error deleting post:", error);
    return false;
  }
};
