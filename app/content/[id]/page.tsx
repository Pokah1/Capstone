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
        <main className="p-4 max-w-full mx-auto">
          <section className="max-w-4xl mx-auto bg-gray-900 rounded-lg p-6">
            {post.cover_url && (
              <img
                src={post.cover_url}
                alt={post.title}
                className="w-full h-auto object-cover rounded mb-4"
              />
            )}
            <h1 className="text-white text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
            <div
              className="text-gray-300 mb-4"
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
            <div className="flex flex-col md:flex-row items-start mt-4 space-y-4 md:space-y-0 md:space-x-4">
              <button
                onClick={() => handleLike(post.id)}
                className={`flex items-center space-x-2 ${
                  likedPosts.has(post.id) ? "text-red-500" : "text-gray-500"
                }`}
              >
                <span>👍</span>
                <span>Like</span>
              </button>
              <button
                onClick={() => handleBookmark(post.id)}
                className={`flex items-center space-x-2 ${
                  bookmarkedPosts.has(post.id)
                    ? "text-yellow-500"
                    : "text-gray-500"
                }`}
              >
                <span>📌</span>
                <span>Bookmark</span>
              </button>
              <div className="flex-1 flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-4">
                <input
                  type="text"
                  id={`comment-${post.id}`}
                  placeholder="Add a comment..."
                  className="flex-1 border border-gray-300 rounded px-3 py-2"
                />
                <button
                  onClick={() => handleCommentSubmit(post.id)}
                  className="bg-blue-500 text-white rounded px-4 py-2"
                >
                  Comment
                </button>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {comments[post.id]?.map((comment, index) => (
                <p key={index} className="text-gray-400">
                  {comment}
                </p>
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
