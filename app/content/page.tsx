"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import editorStyles from "@/app/content/content.module.css";
import FooterBottom from "@/components/firstPage/footerBottom";
import Cover from "@/components/contentEditor/cover";
import { fetchUser } from "@/utils/fetchUser";
import { fetchPosts, savePost } from "@/utils/userService";
import { useRouter } from "next/navigation";
import DOMPurify from "dompurify";
import AuthWrapper from "@/components/AuthWrapper";
import Link from "next/link";

// Helper: remove HTML tags for preview
const stripHtml = (html: string) => html.replace(/<[^>]+>/g, "");

const EditorPage = () => {
  const [coverUrl, setCoverUrl] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [editorContent, setEditorContent] = useState<string>("");
  const [user, setUser] = useState<any | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [authorName, setAuthorName] = useState<string>("");

  const postsPerPage = currentPage === 1 ? 6 : 9;
  const router = useRouter();

  // Load user
  useEffect(() => {
    const loadUser = async () => {
      const user = await fetchUser(router);
      if (user) setUser(user);
    };
    loadUser();
  }, [router]);

  // Load posts
  useEffect(() => {
    const loadPosts = async () => {
      const postsData = await fetchPosts();
      setPosts(postsData);
    };
    loadPosts();
  }, []);

  const handleEditorChange = (updatedContent: string) => {
    setEditorContent(updatedContent);
  };

  const handleSave = async () => {
    if (!user?.id) return;
    await savePost(title, DOMPurify.sanitize(editorContent), coverUrl, user.id, authorName);
    window.alert("Post saved successfully!");
    window.location.reload();
  };

  const enableCover = () =>
    setCoverUrl(
      "https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?q=80&w=2071&auto=format&fit=crop"
    );

  const Editor = useMemo(
    () => dynamic(() => import("@/components/contentEditor/editor"), { ssr: false }),
    []
  );

  // Pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const handleNextPage = () => {
    if (indexOfLastPost < posts.length) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <AuthWrapper>
      <main className={editorStyles.container}>
        <header className={editorStyles.header}>
          <button className={editorStyles.navButton} onClick={() => router.push("/dashboard")}>
            Dashboard
          </button>
          <button className={editorStyles.publishButton} onClick={handleSave}>
            Publish
          </button>
        </header>

        {/* Cover Section */}
        <section className={editorStyles.coverSection}>
          <Cover url={coverUrl} setUrl={setCoverUrl} />
          {!coverUrl && (
            <button onClick={enableCover} className={editorStyles.addCoverButton}>
              📷 Add Cover
            </button>
          )}
        </section>

        {/* Title */}
        <section className={editorStyles.titleSection}>
          <textarea
            placeholder="Article Title..."
            className={editorStyles.textarea}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </section>

        {/* Editor */}
        <section>
          <Editor onChange={handleEditorChange} initialContent={editorContent} editable />
        </section>

        {/* Author Name */}
        <section className={editorStyles.authorSection}>
          <input
            type="text"
            placeholder="Author Name..."
            className={editorStyles.authorInput}
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
          />
        </section>

        {/* Posts List (Preview: plain text) */}
        <section>
          <h2 className={editorStyles.postsHeading}>Posts</h2>
          <ul className={editorStyles.postsList}>
            {currentPosts.map((post) => (
              <li key={post.id}>
                <Link href={`/posts/${post.id}`} className={editorStyles.postCard}>
                  {post.cover_url && (
                    <img src={post.cover_url} className={editorStyles.postImage} alt={post.title} />
                  )}
                  <h3 className={editorStyles.postTitle}>{post.title}</h3>
                  <p className={editorStyles.postExcerpt}>
                    {stripHtml(post.content).slice(0, 80)}...
                  </p>
                </Link>
              </li>
            ))}
          </ul>

          <div className={editorStyles.pagination}>
            {currentPage > 1 && (
              <button className={editorStyles.pageButton} onClick={handlePrevPage}>
                Previous
              </button>
            )}
            {indexOfLastPost < posts.length && (
              <button className={editorStyles.pageButton} onClick={handleNextPage}>
                Next
              </button>
            )}
          </div>
        </section>

        <FooterBottom className={editorStyles.footer} />
      </main>
    </AuthWrapper>
  );
};

export default EditorPage;
