"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import FooterBottom from "@/components/firstPage/footerBottom";
import PostContent from "@/components/contentInfo/PostContent";
import CommentSection from "@/components/CommentSection";
import LikeButton from "@/components/LikeButton";
import SharePost from "@/components/contentInfo/SharePost";
import { usePost } from "@/lib/usePost";
import { useComments } from "@/lib/useComments";
import { useLikes } from "@/lib/useLikes";
import { createClient } from "@/utils/supabase/client";
import { Post } from "@/types";

const supabase = createClient();

export default function PostPage() {
  const { id } = useParams();
  const router = useRouter();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  if (!id) return <div className="text-white">Invalid post</div>;
  const postId = Array.isArray(id) ? id[0] : id;

  const { post, authorName, loading } = usePost(postId);
  const { comments, addComment, editComment, deleteComment } =
    useComments(postId);
  const { liked, count, toggleLike } = useLikes(postId);

  // Fetch current user ID
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    fetchUser();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-[#010414]">
        <div className="animate-pulse text-yellow-400 text-lg sm:text-xl font-bold">
          Loading post...
        </div>
      </div>
    );

  return (
    <main className="w-full px-3 sm:px-6 py-6 sm:py-10 bg-[#010414] text-white font-poppins min-h-screen">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-sm sm:text-base text-white font-semibold hover:underline"
      >
        ← Back
      </button>

      {/* Post Content */}
      <div className="w-full max-w-4xl mx-auto">
        <PostContent post={post as Post} />

        {/* Share Post */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <SharePost postId={postId} postTitle={post?.title} />
        </div>

        {/* Like Section */}
        <div className="mt-6 flex justify-center">
          {currentUserId ? (
            <LikeButton liked={liked} count={count} toggleLike={toggleLike} />
          ) : (
            <button
              onClick={() => router.push("/login")}
              className="px-4 py-2 rounded-lg bg-blue-600 text-sm sm:text-base text-white hover:bg-blue-700 transition"
            >
              Log in to like
            </button>
          )}
        </div>

        {/* Comment Section */}
        <div className="mt-8">
          {currentUserId ? (
            <CommentSection
              comments={comments}
              addComment={addComment}
              editComment={editComment}
              deleteComment={deleteComment}
              currentUserId={currentUserId}
            />
          ) : (
            <div className="text-center text-gray-400 text-sm sm:text-base">
              <p>
                Log in to leave a comment{" "}
                <button
                  onClick={() => router.push("/login")}
                  className="underline text-blue-400 hover:text-blue-500"
                >
                  Login
                </button>
              </p>
            </div>
          )}
        </div>
      </div>

      <FooterBottom />
    </main>
  );
}
