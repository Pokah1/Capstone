"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import AuthWrapper from "@/components/AuthWrapper";
import FooterBottom from "@/components/firstPage/footerBottom";
import PostContent from "@/components/PostContent";
import CommentSection from "@/components/CommentSection";
import LikeButton from "@/components/LikeButton";
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
  const { comments, addComment, deleteComment } = useComments(postId);
  const { liked, count, toggleLike } = useLikes(postId);

  // Fetch current user ID
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    fetchUser();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-pulse text-yellow-400 text-xl font-bold">
        Loading post...
      </div>
    </div>
  );

  return (
    <AuthWrapper>
      <main className="w-full px-4 py-8 bg-[#010414] text-white font-poppins min-h-screen">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-white font-semibold hover:underline"
        >
          ← Back
        </button>

        <PostContent post={post as Post} />

        <div className="mt-4 flex gap-4 justify-center">
          <LikeButton liked={liked} count={count} toggleLike={toggleLike} />
        </div>

        <CommentSection
          comments={comments}
          addComment={addComment}
          deleteComment={deleteComment}
          currentUserId={currentUserId}
        />

        <FooterBottom />
      </main>
    </AuthWrapper>
  );
}
