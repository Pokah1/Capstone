"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Post, User } from "@/types";
import AuthWrapper from "@/components/AuthWrapper";
import ToastWrapper from "@/components/ToastWrapper";
import DOMPurify from "dompurify";

const supabase = createClient();
const POSTS_PER_PAGE = 6;

function getPreviewText(html: string, maxLength = 120): string {
  if (!html) return "";
  const text = html.replace(/<[^>]+>/g, "");
  return text.length <= maxLength ? text : text.slice(0, maxLength).trim() + "...";
}

export default function UserPosts() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<{ full_name?: string; avatar_url?: string } | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [toast, setToast] = useState<{ message: string; type?: "success" | "error" } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  // Fetch user and posts
  useEffect(() => {
    async function fetchData() {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) return;

      setUser(user);

      const { data: dbProfile } = await supabase
        .from("users")
        .select("id, full_name, avatar_url")
        .eq("id", user.id)
        .single();

      if (dbProfile) setProfile(dbProfile);

      const { data: userPosts } = await supabase
        .from("posts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setPosts(userPosts || []);
    }

    fetchData();
  }, []);

  const displayName =
    profile?.full_name || (user?.user_metadata?.full_name as string) || "Anonymous";

  const indexOfLastPost = currentPage * POSTS_PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const viewPost = (post: Post) => setSelectedPost(post);

  // Request deletion (opens confirm modal)
  const requestDelete = (postId: string) => {
    setDeleteTarget(postId);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await supabase.from("posts").delete().eq("id", deleteTarget);
      setPosts(posts.filter((p) => p.id !== deleteTarget));
      setSelectedPost(null);
      setToast({ message: "Post deleted successfully!", type: "success" });
    } catch {
      setToast({ message: "Failed to delete post.", type: "error" });
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <AuthWrapper>
      {/* Greeting */}
      <div className="max-w-full overflow-hidden pl-12 sm:pl-6 pr-4">
        <p className="text-xl sm:text-2xl md:text-3xl font-playfair font-bold text-white">
          Welcome, <span className="text-yellow-400">{displayName}</span>
        </p>
        <div className="bg-gray-800 rounded-lg p-2 sm:p-3 px-4 sm:px-5 shadow-md inline-block mt-2">
          <p className="text-gray-400 text-xs sm:text-sm md:text-base">My Posts: {posts.length}</p>
        </div>
      </div>

      {/* Selected Post */}
      {selectedPost ? (
        <article className="max-w-4xl w-full mx-auto px-4 bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-6 text-white mt-6">
          {selectedPost.cover_url && (
            <img
              src={selectedPost.cover_url}
              alt={selectedPost.title}
              className="w-full max-h-[300px] sm:max-h-[400px] object-cover rounded-lg shadow-md"
            />
          )}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-playfair font-bold text-yellow-400 text-center">
            {selectedPost.title}
          </h2>
          <div
            className="prose prose-invert text-gray-300 max-w-none overflow-auto"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedPost.content) }}
          />
          <div className="flex flex-col sm:flex-row justify-between gap-4 mt-4">
            <button
              onClick={() => setSelectedPost(null)}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-black hover:bg-blue-900 hover:text-white transition"
            >
              Back to Posts
            </button>
            <button
              onClick={() => selectedPost?.id && requestDelete(selectedPost.id)}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold"
            >
              Delete Post
            </button>
          </div>
        </article>
      ) : (
        <>
          {/* Posts Grid */}
          {currentPosts.length > 0 ? (
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-6 mt-6">
              {currentPosts.map((post) => (
                <article
                  key={post.id}
                  onClick={() => viewPost(post)}
                  className="bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 cursor-pointer overflow-hidden"
                >
                  {post.cover_url && (
                    <img
                      src={post.cover_url}
                      alt={post.title}
                      className="w-full h-40 sm:h-44 md:h-48 object-cover"
                    />
                  )}
                  <div className="p-3 sm:p-4">
                    <h3 className="text-lg sm:text-xl font-playfair font-bold text-yellow-400 mb-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-300 text-sm sm:text-base line-clamp-4">
                      {getPreviewText(post.content)}
                    </p>
                  </div>
                </article>
              ))}
            </section>
          ) : (
            <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400 text-center px-4">
              <p>You haven’t created any posts yet.</p>
            </div>
          )}

          {/* Pagination */}
          {currentPosts.length > 0 && (
            <div className="flex justify-between mt-8 w-full px-4 sm:px-6">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-black hover:bg-blue-900 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <button
                onClick={() =>
                  setCurrentPage((prev) => (indexOfLastPost < posts.length ? prev + 1 : prev))
                }
                disabled={indexOfLastPost >= posts.length}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-black hover:bg-blue-900 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg text-white space-y-4 text-center">
            <p>Are you sure you want to delete this post?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 bg-gray-500 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && <ToastWrapper message={toast.message} type={toast.type} />}
    </AuthWrapper>
  );
}
