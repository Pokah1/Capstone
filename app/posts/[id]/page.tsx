"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import AuthWrapper from "@/components/AuthWrapper";
import FooterBottom from "@/components/firstPage/footerBottom";
import DOMPurify from "dompurify";

const PostPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [authorName, setAuthorName] = useState<string>("Anonymous");
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Set<string>>(new Set());
  const [comments, setComments] = useState<{ [key: string]: string[] }>({});

  const supabase = createClient();

  // Fetch post + author
  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;

      const { data: postData, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && postData) {
        setPost(postData);

        if (postData.user_id) {
          const { data: profile } = await supabase
            .from("users")
            .select("full_name")
            .eq("id", postData.user_id)
            .single();

          setAuthorName(
            profile?.full_name || postData.author_name || "Anonymous"
          );
        }
      }
      setLoading(false);
    };
    fetchPost();
  }, [id, supabase]);

  // Likes + bookmarks
  useEffect(() => {
    const loadExtras = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: likesData } = await supabase
          .from("post_likes")
          .select("post_id")
          .eq("user_id", user.id);

        if (likesData) setLikedPosts(new Set(likesData.map((l) => l.post_id)));

        const { data: bookmarksData } = await supabase
          .from("post_bookmarks")
          .select("post_id")
          .eq("user_id", user.id);

        if (bookmarksData)
          setBookmarkedPosts(new Set(bookmarksData.map((b) => b.post_id)));
      }
    };
    loadExtras();
  }, [supabase]);

  const handleLike = async (postId: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("post_likes").upsert({ post_id: postId, user_id: user.id });

    setLikedPosts((prev) => {
      const updated = new Set(prev);
      updated.has(postId) ? updated.delete(postId) : updated.add(postId);
      return updated;
    });
  };

  const handleBookmark = async (postId: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("post_bookmarks").upsert({ post_id: postId, user_id: user.id });

    setBookmarkedPosts((prev) => {
      const updated = new Set(prev);
      updated.has(postId) ? updated.delete(postId) : updated.add(postId);
      return updated;
    });
  };

  const handleCommentSubmit = async (postId: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const input = document.getElementById(`comment-${postId}`) as HTMLInputElement;
    const text = input?.value.trim();
    if (!text) return;

    await supabase.from("post_comments").insert([
      { post_id: postId, user_id: user.id, comment: text },
    ]);

    setComments((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), text],
    }));

    input.value = "";
  };

  return (
    <AuthWrapper>
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <p className="text-2xl font-bold text-yellow-400 drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">
            Loading...
          </p>
        </div>
      ) : (
        <main className="max-w-[1200px] w-[95%] mx-auto py-8 flex flex-col gap-12 font-['Playfair_Display'] text-[#f9f9fb] bg-[#010414]">
          
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-yellow-400 font-semibold mb-4 hover:underline"
          >
            ← Back
          </button>

          <section className="flex flex-col gap-10 p-8 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.8)] bg-gradient-to-br from-[#0a0f2a] to-[#010414] hover:-translate-y-1.5 transition-transform duration-300">
            {/* Cover */}
            {post.cover_url && (
              <img
                src={post.cover_url}
                alt={post.title}
                className="w-full max-h-[500px] object-cover rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.7)] hover:scale-[1.03] hover:shadow-[0_20px_50px_rgba(0,0,0,0.9)] transition duration-500"
              />
            )}

            {/* Title */}
            <h1 className="text-4xl font-extrabold text-center text-yellow-400 tracking-wide mb-2 drop-shadow-[2px_2px_8px_rgba(255,215,0,0.4)]">
              {post.title}
            </h1>

            {/* Author */}
            <p className="text-center text-gray-400">
              Author: <span className="italic text-yellow-400">{authorName}</span>
            </p>

            {/* Body */}
            <div
              className="text-lg leading-8 text-gray-200 text-justify max-w-3xl mx-auto px-4"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(post.content),
              }}
            />

            {/* Interaction bar */}
            <div className="flex justify-center flex-wrap gap-4 mt-6">
              <button
                onClick={() => handleLike(post.id)}
                className={`flex items-center gap-2 px-6 py-2 font-bold rounded-2xl transition-all duration-300 ${
                  likedPosts.has(post.id)
                    ? "text-red-500"
                    : "text-white"
                } bg-gradient-to-tr from-[#1a1a2e] to-[#0b1a55] hover:from-[#0b1a55] hover:to-[#1a2b75] hover:-translate-y-1`}
              >
                👍 Like
              </button>

              <button
                onClick={() => handleBookmark(post.id)}
                className={`flex items-center gap-2 px-6 py-2 font-bold rounded-2xl transition-all duration-300 ${
                  bookmarkedPosts.has(post.id)
                    ? "text-yellow-400"
                    : "text-white"
                } bg-gradient-to-tr from-[#1a1a2e] to-[#0b1a55] hover:from-[#0b1a55] hover:to-[#1a2b75] hover:-translate-y-1`}
              >
                📌 Bookmark
              </button>
            </div>

            {/* Comments */}
            <div className="flex flex-col items-center gap-3 mt-8">
              <input
                id={`comment-${post.id}`}
                placeholder="Add a comment..."
                className="w-full max-w-lg px-4 py-3 rounded-2xl border border-gray-700 bg-[#010414] text-white"
              />
              <button
                onClick={() => handleCommentSubmit(post.id)}
                className="self-end bg-[#0b1a55] hover:bg-[#1a2b75] px-4 py-2 rounded-2xl font-bold transition-all duration-300 hover:-translate-y-0.5"
              >
                Comment
              </button>
            </div>

            <div className="flex flex-col gap-3 mt-6 max-w-2xl mx-auto">
              {comments[post.id]?.map((comment, idx) => (
                <p
                  key={idx}
                  className="bg-[#1a1a2e] px-4 py-3 rounded-2xl text-gray-300 shadow-inner shadow-black/40"
                >
                  {comment}
                </p>
              ))}
            </div>
          </section>

          <FooterBottom className="text-center text-white mt-12" />
        </main>
      )}
    </AuthWrapper>
  );
};

export default PostPage;
