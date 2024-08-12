'use client'
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client'
import { Post, User } from '@/types';

const supabase = createClient();



export default function UserPosts() {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5); // Number of posts per page

  useEffect(() => {
    async function fetchUser() {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        console.error('Error fetching current user:', error);
        return;
      }

      setUser(user);
      fetchPostsByUser(user.id);
    }

    async function fetchPostsByUser(userId: string) {
      const { data: posts, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error);
        return;
      }

      setPosts(posts || []);
    }

    fetchUser();
  }, []);

  const viewPost = (post: Post) => {
    setSelectedPost(post);
  };

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const nextPage = () => {
    if (indexOfLastPost < posts.length) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-100">Your Posts</h1>

      {selectedPost ? (
        <div className="max-w-4xl mx-auto bg-gray-800 shadow-md rounded-lg p-6">
          {selectedPost.cover_url && (
            <img
              src={selectedPost.cover_url}
              alt={selectedPost.title}
              className="w-full h-64 object-cover rounded-md mb-4"
            />
          )}
          <h2 className="text-2xl font-bold mb-2 text-gray-100">{selectedPost.title}</h2>
          <p className="text-gray-300 mb-4">{selectedPost.content}</p>
          <button
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            onClick={() => setSelectedPost(null)}
          >
            Back to Posts
          </button>
        </div>
      ) : (
        <>
          {user ? (
            <>
              <h2 className="text-xl font-semibold mb-4 text-gray-300">
                Welcome, <h2 className='text-yellow-200'>{user.user_metadata?.full_name || user.email || 'Guest'}</h2>
              </h2>

              {currentPosts.length > 0 ? (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentPosts.map((post) => (
                      <div
                        key={post.id}
                        className="bg-gray-800 shadow-md rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition"
                        onClick={() => viewPost(post)}
                      >
                        {post.cover_url && (
                          <img
                            src={post.cover_url}
                            alt={post.title}
                            className="w-full h-48 object-cover"
                          />
                        )}
                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-gray-100">{post.title}</h3>
                          <p className="text-gray-400 mt-2 text-sm line-clamp-2">
                            {post.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex justify-between">
                    <button
                      className={`px-4 py-2 bg-blue-500 text-white rounded ${
                        currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
                      }`}
                      onClick={prevPage}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                    <button
                      className={`px-4 py-2 bg-blue-500 text-white rounded ${
                        indexOfLastPost >= posts.length
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:bg-blue-600'
                      }`}
                      onClick={nextPage}
                      disabled={indexOfLastPost >= posts.length}
                    >
                      Next
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 text-center">You haven't created any posts yet.</p>
              )}
            </>
          ) : (
            <p className="text-gray-400 text-center">Loading user information...</p>
          )}
        </>
      )}
    </div>
  );
}