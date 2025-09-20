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
  const [profile, setProfile] = useState<{ full_name?: string; avatar_url?: string } | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  // Fetch user, profile, and posts once AuthWrapper ensures authentication
  useEffect(() => {
    async function fetchData() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error || !user) return;

      setUser(user);

      // Fetch profile from "users" table
      const { data: dbProfile } = await supabase
        .from("users")
        .select("id, full_name, avatar_url")
        .eq("id", user.id)
        .single();

      if (dbProfile) setProfile(dbProfile);

      // Fetch posts by user
      const { data: posts } = await supabase
        .from("posts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setPosts(posts || []);
    }

    fetchData();
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

  // ✅ displayName logic same as SideNav
  const displayName =
    profile?.full_name ||
    (user?.user_metadata?.full_name as string) ||
    "Anonymous";

  return (
    <AuthWrapper>
      <div className="max-w-full overflow-hidden p-6 font-poppins">
        {/* Greeting */}
        <div className="flex flex-col items-center text-center gap-4 mb-6">
         <p className="text-xl md:text-2xl font-bold text-white font-playfair">
  Welcome, <span className="text-yellow-400">{displayName}</span>
</p>
          <div className="bg-gray-800 rounded-lg p-4 flex flex-col items-center shadow-md w-36">
            <div className="text-gray-400">My Posts {posts.length}</div>
          </div>
        </div>

        {selectedPost ? (
          <article className="max-w-4xl mx-auto bg-gray-800 rounded-2xl p-6 shadow-2xl space-y-6 text-white">
            {selectedPost.cover_url && (
              <img
                src={selectedPost.cover_url}
                alt={selectedPost.title}
                className="w-full max-h-[450px] object-cover rounded-lg shadow-md"
              />
            )}
           <h2 className="text-2xl md:text-3xl font-bold text-yellow-400 text-center font-playfair">
  {selectedPost.title}
</h2>
            <div
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedPost.content) }}
            />
            <div className="flex justify-between gap-4">
              <button
                onClick={() => setSelectedPost(null)}
               className={`
      px-4 py-2 rounded-lg border border-gray-300 
      bg-white text-black cursor-pointer transition 
      duration-300 ease-in-out hover:bg-blue-900 hover:text-white 
      disabled:opacity-50 disabled:cursor-not-allowed
    `}>
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
            {currentPosts.length > 0 ? (
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentPosts.map((post) => (
                  <article
                    key={post.id}
                    onClick={() => viewPost(post)}
                    className="bg-gray-800 rounded-2xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1 cursor-pointer overflow-hidden"
                  >
                    {post.cover_url && (
                      <img
                        src={post.cover_url}
                        alt={post.title}
                        className="w-full h-44 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <h3 className="text-xl font-bold text-yellow-400 mb-2 font-playfair">
  {post.title}
</h3>
                      <p className="text-gray-300 text-sm">{getPreviewText(post.content, 120)}</p>
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
    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
    disabled={currentPage === 1}
    className={`
      px-4 py-2 rounded-lg border border-gray-300 
      bg-white text-black cursor-pointer transition 
      duration-300 ease-in-out hover:bg-blue-900 hover:text-white 
      disabled:opacity-50 disabled:cursor-not-allowed
    `}
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
    className={`
      px-4 py-2 rounded-lg border border-gray-300 
      bg-white text-black cursor-pointer transition 
      duration-300 ease-in-out hover:bg-blue-900 hover:text-white 
      disabled:opacity-50 disabled:cursor-not-allowed
    `}
  >
    Next
  </button>
</div>

          </>
        )}
      </div>
    </AuthWrapper>
  );
}
