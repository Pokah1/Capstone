

import { createClient } from "@/utils/supabase/client";


const supabase = createClient();

// Fetch Posts Function
export const fetchPosts = async () => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching posts:", error);
    return [];
  }

  return data || [];
};

// Toggle Like Function
export const toggleLike = async (postId: string, userId: string) => {
  try {
    const { data: like, error: selectError } = await supabase
    .from("post_likes")
    .select("*")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .single();

    if (selectError && selectError.code !== "PGRST116") {
      throw selectError;
    }


    if (like) {
      const { error: deleteError } = await supabase
        .from("post_likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", userId);

        if (deleteError) throw deleteError;
    } else {
      const { error: insertError } = await supabase
      .from("post_likes")
      .insert({ post_id: postId, user_id: userId });

    if (insertError) throw insertError;
  }
} catch (error) {
  console.error("Error toggling like:", error);
}
};

// Toggle Bookmark Function
export const toggleBookmark = async (postId: string, userId: string) => {
  try {
    const { data: bookmark, error } = await supabase
      .from("post_bookmarks")
      .select("*")
      .eq("post_id", postId)
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    if (bookmark) {
      await supabase
        .from("post_bookmarks")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", userId);
    } else {
      await supabase
        .from("post_bookmarks")
        .insert({ post_id: postId, user_id: userId });
    }
  } catch (error) {
    console.error("Error toggling bookmark:", error);
  }
};

// Add Comment Function
export const addComment = async (
  postId: string,
  userId: string,
  commentText: string
) => {
  try {
    const { error } = await supabase.from("post_comments").insert({
      post_id: postId,
      user_id: userId,
      comment: commentText,
    });

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Error adding comment:", error);
  }
};

// Fetch Post Data Function
export const fetchPostData = async (postId: string) => {
  try {
    const { data: post, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", postId)
      .single();

    if (error) {
      throw error;
    }

    return post;
  } catch (error) {
    console.error("Error fetching post data:", error);
    return null;
  }
};


export const savePost = async (title: string, content: string, coverUrl: string, userId: string, authorName:string) => {
  try {
    const response = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        content,
        cover_url: coverUrl,
        user_id: userId,
        author_name: authorName, 
      }),
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error("Error saving post");
    }
  } catch (error) {
    console.error("Error saving post:", error);
    throw error;
  }
};

export const fetchLikesAndBookmarks = async (userId: string) => {
  const { data: likes } = await supabase
    .from("post_likes")
    .select("post_id")
    .eq("user_id", userId);

  const { data: bookmarks } = await supabase
    .from("post_bookmarks")
    .select("post_id")
    .eq("user_id", userId);

  return {
    likes: new Set(likes?.map((like) => like.post_id)),
    bookmarks: new Set(bookmarks?.map((bookmark) => bookmark.post_id)),
  };
};
