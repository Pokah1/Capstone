"use client";


import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Post, User } from "@/types";
import AuthWrapper from "@/components/AuthWrapper";
import DOMPurify from "dompurify";
import styles from "./Profiles.module.css"



// Helper: strip tags for previews
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

      if (error || !user) {
        console.error("Error fetching current user:", error);
        return;
      }

      setUser(user);
      fetchPostsByUser(user.id);
    }

    async function fetchPostsByUser(userId: string) {
      const { data: posts, error } = await supabase
        .from("posts")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching posts:", error);
        return;
      }

      setPosts(posts || []);
    }

    fetchUser();
  }, []);

  const viewPost = (post: Post) => {
    setSelectedPost(post);
  };

  const deletePost = async (postId: string) => {
    const confirmed = confirm(
      "Are you sure you want to delete this post? This action cannot be undone."
    );

    if (confirmed) {
      const { error } = await supabase.from("posts").delete().eq("id", postId);

      if (error) {
        console.error("Error deleting post:", error);
        return;
      }

      setPosts(posts.filter((post) => post.id !== postId));
      setSelectedPost(null);
    }
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
    <AuthWrapper>
      <main className={styles.container}>
  <header className={styles.header}>
    <h1>Your Posts</h1>
  </header>

  {selectedPost ? (
    <article className={styles.selectedPost}>
      {selectedPost.cover_url && <img src={selectedPost.cover_url} alt={selectedPost.title} />}
      <h2>{selectedPost.title}</h2>
      <div className={styles.selectedPostContent} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedPost.content) }} />
      <div className={styles.actions}>
        <button className={styles.backButton} onClick={() => setSelectedPost(null)}>Back to Posts</button>
        <button className={styles.deleteButton} onClick={() => selectedPost?.id && deletePost(selectedPost.id)}>Delete Post</button>
      </div>
    </article>
  ) : (
    <>
      {user && (
        <section className={styles.welcome}>
          Welcome, <span>{user.user_metadata?.full_name || user.email || "Guest"}</span>
        </section>
      )}

      {currentPosts.length > 0 ? (
        <section className={styles.postsGrid}>
          {currentPosts.map((post) => (
            <article key={post.id} className={styles.postCard} onClick={() => viewPost(post)}>
              {post.cover_url && <img src={post.cover_url} alt={post.title} />}
              <div className={styles.postCardContent}>
                <h3>{post.title}</h3>
                <p>{getPreviewText(post.content, 120)}</p>

              </div>
            </article>
          ))}
        </section>
      ) : (
        <p className={styles.infoMessage}>You haven't created any posts yet.</p>
      )}

      {/* Pagination */}
      <div className={styles.pagination}>
        <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
        <button onClick={nextPage} disabled={indexOfLastPost >= posts.length}>Next</button>
      </div>
    </>
  )}
</main>

    </AuthWrapper>
  );
}
