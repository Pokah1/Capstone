"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import AuthWrapper from "@/components/AuthWrapper";
import FooterBottom from "@/components/firstPage/footerBottom";
import DOMPurify from "dompurify";
import postStyle from "./PostPage.module.css"

const PostPage = () => {
  const { id } = useParams(); // Get the post ID from the URL parameters
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Set<string>>(
    new Set()
  );
  const [comments, setComments] = useState<{ [key: string]: string[] }>({});

  const supabase = createClient();

  useEffect(() => {
    const fetchPost = async () => {
      if (id) {
        const { data: postData, error } = await supabase
          .from("posts")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          console.error("Error fetching post:", error);
        } else {
          setPost(postData);
        }
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, supabase]);

  useEffect(() => {
    const loadLikesAndBookmarks = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: likesData, error: likesError } = await supabase
          .from("post_likes")
          .select("post_id")
          .eq("user_id", user.id);

        if (likesError) {
          console.error("Error fetching likes:", likesError);
        } else {
          setLikedPosts(new Set(likesData.map((like) => like.post_id)));
        }

        const { data: bookmarksData, error: bookmarksError } = await supabase
          .from("post_bookmarks")
          .select("post_id")
          .eq("user_id", user.id);

        if (bookmarksError) {
          console.error("Error fetching bookmarks:", bookmarksError);
        } else {
          setBookmarkedPosts(
            new Set(bookmarksData.map((bookmark) => bookmark.post_id))
          );
        }
      }
    };

    loadLikesAndBookmarks();
  }, [supabase]);

  const handleLike = async (postId: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      try {
        const { error } = await supabase
          .from("post_likes")
          .upsert({ post_id: postId, user_id: user.id });

        if (error) {
          console.error("Error toggling like:", error);
        } else {
          setLikedPosts((prev) => {
            const newLikes = new Set(prev);
            newLikes.has(postId)
              ? newLikes.delete(postId)
              : newLikes.add(postId);
            return newLikes;
          });
        }
      } catch (error) {
        console.error("Error toggling like:", error);
        window.alert("Unable to toggle like. Please try again.");
      }
    }
  };

  const handleBookmark = async (postId: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      try {
        const { error } = await supabase
          .from("post_bookmarks")
          .upsert({ post_id: postId, user_id: user.id });

        if (error) {
          console.error("Error bookmarking:", error);
        } else {
          setBookmarkedPosts((prev) => {
            const newBookmarks = new Set(prev);
            newBookmarks.has(postId)
              ? newBookmarks.delete(postId)
              : newBookmarks.add(postId);
            return newBookmarks;
          });
        }
      } catch (error) {
        console.error("Error bookmarking:", error);
        window.alert("Unable to bookmark. Please try again.");
      }
    }
  };

  const handleCommentSubmit = async (postId: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const commentText = (
        document.getElementById(`comment-${postId}`) as HTMLInputElement
      )?.value;

      await supabase
        .from("post_comments")
        .insert([
          { post_id: postId, user_id: user.id, comment: commentText || "" },
        ]);

      setComments((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), commentText || ""],
      }));
      (document.getElementById(`comment-${postId}`) as HTMLInputElement).value =
        "";
    }
  };

  return (
    <AuthWrapper>
      {loading ? (
        <div className={postStyle.loadingContainer}>
    <div className={postStyle.loadingText}>Loading...</div>
  </div>
      ) : (
        <main className={postStyle.postContainer}>
  <section className={postStyle.postContent}>
    {post.cover_url && (
      <img src={post.cover_url} alt={post.title} className={postStyle.postCover} />
    )}
    <h1 className={postStyle.postTitle}>{post.title}</h1>
    <p className={postStyle.postAuthor}>
      Author: <span>{post.author_name || "Anonymous"}</span>
    </p>
    <div
      className={postStyle.postBody}
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
    />

    <div className={postStyle.interactionBar}>
      <button
        onClick={() => handleLike(post.id)}
        className={likedPosts.has(post.id) ? postStyle.liked : ""}
      >
        👍 Like
      </button>
      <button
        onClick={() => handleBookmark(post.id)}
        className={bookmarkedPosts.has(post.id) ? postStyle.bookmarked : ""}
      >
        📌 Bookmark
      </button>
    </div>

    <div className={postStyle.commentSection}>
      <input id={`comment-${post.id}`} placeholder="Add a comment..." />
      <button onClick={() => handleCommentSubmit(post.id)}>Comment</button>
    </div>

    <div className={postStyle.commentsList}>
      {comments[post.id]?.map((comment, idx) => (
        <p key={idx}>{comment}</p>
      ))}
    </div>
  </section>

  <FooterBottom className="text-white mt-6" />
</main>


      )}
    </AuthWrapper>
  );
};

export default PostPage;
