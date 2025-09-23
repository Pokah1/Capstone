"use client";

import Link from "next/link";

type Props = {
  posts: any[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  currentUserId: string;
  onEdit: (post: any) => void;
};

export default function PostList({
  posts,
  currentPage,
  setCurrentPage,
  currentUserId,
  onEdit,
}: Props) {
  const postsPerPage = currentPage === 1 ? 6 : 9;
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <section>
      <h2 className="text-2xl font-playfair font-bold text-white mb-4">
        All Posts
      </h2>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentPosts.map((post) => (
          <li key={post.id} className="relative">
            <Link
              href={`/posts/${post.id}`}
              className="block bg-[#0b0d1f] rounded-xl border border-white/20 overflow-hidden shadow-md transition hover:shadow-xl cursor-pointer"
            >
              {post.cover_url && (
                <img
                  src={post.cover_url}
                  className="w-full h-56 object-cover"
                  alt={post.title}
                />
              )}

              <div className="m-3">
                <h3 className="font-playfair font-bold text-xl text-yellow-400">
                  {post.title}
                </h3>

                <div
                  className="prose prose-invert max-w-full text-gray-300 break-words overflow-hidden"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                  }}
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </div>
            </Link>

            {post.user_id === currentUserId && (
              <button
                onClick={() => onEdit(post)}
                className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-800"
              >
                Edit
              </button>
            )}
          </li>
        ))}
      </ul>

      {/* Pagination */}
      <div className="flex justify-between mt-4 flex-wrap gap-2">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-black cursor-pointer transition duration-300 hover:bg-blue-900 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage * postsPerPage >= posts.length}
          className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-black cursor-pointer transition duration-300 hover:bg-blue-900 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </section>
  );
}
