"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import AuthWrapper from "@/components/AuthWrapper";
import FooterBottom from "@/components/firstPage/footerBottom";
import DOMPurify from "dompurify";
import Link from "next/link";

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
        <div className="flex items-center justify-center h-screen">
          <div className="text-white">Loading...</div>
        </div>
      ) : (
        <main className="p-2">
          <section className="max-w-3xl mx-auto">
            {post.cover_url && (
              <img
                src={post.cover_url}
                alt={post.title}
                className="w-full h-60 object-cover rounded mb-4 mx-auto mt-3"
              />
            )}
            <h1 className="text-white text-2xl mb-4">{post.title}</h1>
            <div
              className="text-gray-300"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(post.content),
              }}
            />
            <p className="text-gray-400 font-bold font-playfair mt-3">
              Author:{" "}
              <span className="text-yellow-400 italic">
                {post.author_name || "Anonymous"}
              </span>
            </p>
            {/* Like, Bookmark, and Comment Section */}
            <div className="flex flex-col md:flex-row items-start mt-4">
              <button
                onClick={() => handleLike(post.id)}
                className={`mr-4 ${
                  likedPosts.has(post.id) ? "text-red-500" : "text-gray-500"
                }`}
              >
                👍 Like
              </button>
              <button
                onClick={() => handleBookmark(post.id)}
                className={`mr-4 ${
                  bookmarkedPosts.has(post.id)
                    ? "text-yellow-500"
                    : "text-gray-500"
                }`}
              >
                📌 Bookmark
              </button>
              <div className="flex-1 flex flex-col md:flex-row items-start">
                <input
                  type="text"
                  id={`comment-${post.id}`}
                  placeholder="Add a comment..."
                  className="mr-4 border border-gray-300 rounded px-2 py-1 mb-2 md:mb-0"
                />
                <button
                  onClick={() => handleCommentSubmit(post.id)}
                  className="bg-blue-500 text-white rounded px-4 py-1"
                >
                  Comment
                </button>
              </div>
            </div>
            <div className="mt-2">
              {comments[post.id]?.map((comment, index) => (
                <p key={index} className="text-gray-400">
                  {comment}
                </p>
              ))}
            </div>
          </section>

          <FooterBottom className="text-white" />
        </main>
      )}
    </AuthWrapper>
  );
};

export default PostPage;
