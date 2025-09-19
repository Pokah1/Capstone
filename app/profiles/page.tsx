"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Post, User } from "@/types";
import AuthWrapper from "@/components/AuthWrapper";
import DOMPurify from "dompurify";

function getPreviewText(html: string, maxLength = 120): string {
  if (!html) return "";
  const text = html.replace(/<[^>]+>/g, ""); // strip HTML
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

const supabase = createClient();

export default function UserPosts() {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(6);

  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) return;
      setUser(user);
      fetchPostsByUser(user.id);
    }

    async function fetchPostsByUser(userId: string) {
      const { data: posts } = await supabase
        .from("posts")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      setPosts(posts || []);
    }

    fetchUser();
  }, []);

  const viewPost = (post: Post) => setSelectedPost(post);

  const deletePost = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    await supabase.from("posts").delete().eq("id", postId);
    setPosts(posts.filter((post) => post.id !== postId));
    setSelectedPost(null);
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <AuthWrapper>
      <main className="w-full max-w-6xl mx-auto p-6 min-h-screen bg-[#010414] text-white">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-yellow-400 drop-shadow-lg">
            Your Posts
          </h1>
        </header>

        {selectedPost ? (
          <article className="max-w-3xl mx-auto bg-gradient-to-br from-[#0a0f2a] to-[#010414] rounded-2xl p-6 shadow-2xl space-y-6">
            {selectedPost.cover_url && (
              <img
                src={selectedPost.cover_url}
                alt={selectedPost.title}
                className="w-full max-h-[450px] object-cover rounded-lg shadow-lg"
              />
            )}
            <h2 className="text-2xl font-bold text-yellow-400 text-center">
              {selectedPost.title}
            </h2>
            <div
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(selectedPost.content),
              }}
            />
            <div className="flex justify-between gap-4">
              <button
                onClick={() => setSelectedPost(null)}
                className="bg-blue-900 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold"
              >
                Back to Posts
              </button>
              <button
                onClick={() => selectedPost?.id && deletePost(selectedPost.id)}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold"
              >
                Delete Post
              </button>
            </div>
          </article>
        ) : (
          <>
            {user && (
              <p className="text-center text-lg mb-6">
                Welcome,{" "}
                <span className="font-bold text-yellow-400">
                  {user.user_metadata?.full_name || user.email || "Guest"}
                </span>
              </p>
            )}

            {currentPosts.length > 0 ? (
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentPosts.map((post) => (
                  <article
                    key={post.id}
                    onClick={() => viewPost(post)}
                    className="bg-gradient-to-br from-[#0a0f2a] to-[#010414] rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 cursor-pointer overflow-hidden"
                  >
                    {post.cover_url && (
                      <img
                        src={post.cover_url}
                        alt={post.title}
                        className="w-full h-44 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <h3 className="text-xl font-bold text-yellow-400 mb-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-300 text-sm">
                        {getPreviewText(post.content, 120)}
                      </p>
                    </div>
                  </article>
                ))}
              </section>
            ) : (
              <p className="text-center text-gray-400 mt-6">
                You haven’t created any posts yet.
              </p>
            )}

            {/* Pagination */}
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.max(1, prev - 1))
                }
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-blue-900 hover:bg-blue-700 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    indexOfLastPost < posts.length ? prev + 1 : prev
                  )
                }
                disabled={indexOfLastPost >= posts.length}
                className="px-4 py-2 rounded-lg bg-blue-900 hover:bg-blue-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </main>
    </AuthWrapper>
  );
}
