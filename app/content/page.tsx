"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import dynamic from "next/dynamic";

import styles from "@/app/content/content.module.css";
import FooterBottom from "@/components/firstPage/footerBottom";
import { PartialBlock } from "@blocknote/core";
import Cover from "@/components/contentEditor/cover";
import { extractTextContent } from "@/utils/extractText";
import { fetchUser } from "@/utils/fetchUser";
import {
  fetchPosts,
  toggleLike,
  toggleBookmark,
  addComment,
  fetchLikesAndBookmarks,
  savePost,
} from "@/utils/userService";
import { useRouter } from "next/navigation";

import DOMPurify from "dompurify";
import AuthWrapper from "@/components/AuthWrapper";
import Link from "next/link";

const EditorPage = () => {
  const [coverUrl, setCoverUrl] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [editorContent, setEditorContent] = useState<string>("");
  const [user, setUser] = useState<any | null>(null);
  const [plainTextContent, setPlainTextContent] = useState<string>("");
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Set<string>>(
    new Set()
  );
  const [comments, setComments] = useState<{ [key: string]: string[] }>({});
  const [authorName, setAuthorName] = useState<string>("");
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);

  const postRef = useRef<HTMLLIElement | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const postsPerPage = currentPage === 1 ? 6 : 9;




  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      const user = await fetchUser(router);
      if (user) setUser(user);
      setLoading(false);
    };
    loadUser();
  }, [router]);

  useEffect(() => {
    const loadPosts = async () => {
      const postsData = await fetchPosts();
      setPosts(postsData);
    };
    loadPosts();
  }, []);

  useEffect(() => {
    if (!loading && user) {
      const loadLikesAndBookmarks = async () => {
        const { likes, bookmarks } = await fetchLikesAndBookmarks(user.id);
        setLikedPosts(likes);
        setBookmarkedPosts(bookmarks);
      };
      loadLikesAndBookmarks();
    }
  }, [loading, user]);

  const handleEditorChange = (updatedContent: string) => {
    try {
      const blocks = JSON.parse(updatedContent) as PartialBlock[];
      const plainTextContent = extractTextContent(blocks);

      // setEditorContent(updatedContent);
      setPlainTextContent(plainTextContent);
    } catch (error) {
      console.error("Error parsing editor content:", error);
    }
  };

  const handleSave = async () => {
    try {
      if (!user || !user.id) {
        console.error("User ID is not available");
        return;
      }
      console.log('Author Name:', authorName);

      const result = await savePost(
        title,
        DOMPurify.sanitize(plainTextContent),
        coverUrl,
        user.id,
        authorName
      );
      window.alert("Post saved successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };

  const enableCover = async () => {
    const response = await fetch(
      "https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    );
    const imageUrl = await response.url;
    setCoverUrl(imageUrl);
  };

  const Editor = useMemo(
    () =>
      dynamic(() => import("@/components/contentEditor/editor"), {
        ssr: false,
      }),
    []
  );

  const handlePostClick = (postId: string) => {
    setExpandedPostId(postId);
  };


  const handleClickOutside = (event: MouseEvent) => {
    if (postRef.current && !postRef.current.contains(event.target as Node)) {
      setExpandedPostId(null);
    }
  };

  useEffect(() => {
    if (expandedPostId) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [expandedPostId]);

  const handleLike = async (postId: string) => {
    if (user) {
      try {
        await toggleLike(postId, user.id);
        setLikedPosts((prev) => {
          const newLikes = new Set(prev);
          newLikes.has(postId) ? newLikes.delete(postId) : newLikes.add(postId);
          return newLikes;
        });
      } catch (error) {
        console.error("Error toggling like:", error);
        window.alert("Unable to toggle like. Please try again.");
      }
    }
  };

  const handleBookmark = async (postId: string) => {
    if (user) {
      try {
        await toggleBookmark(postId, user.id);
        setBookmarkedPosts((prev) => {
          const newBookmarks = new Set(prev);
          newBookmarks.has(postId)
            ? newBookmarks.delete(postId)
            : newBookmarks.add(postId);
          return newBookmarks;
        });
      } catch (error) {
        console.error("Error bookmarking:", error);
        window.alert("Unable to bookmark. Please try again.");
      }
    }
  };

  const handleCommentSubmit = async (postId: string) => {
    if (user) {
      const commentText = (
        document.getElementById(`comment-${postId}`) as HTMLInputElement
      )?.value;
      await addComment(postId, user.id, commentText || "");
      setComments((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), commentText || ""],
      }));
      (document.getElementById(`comment-${postId}`) as HTMLInputElement).value =
        "";
    }
  };


// Calculate the index of the first and last posts for the current page
const indexOfLastPost = currentPage * postsPerPage;
const indexOfFirstPost = indexOfLastPost - postsPerPage;
const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

// Function to handle page navigation
const handleNextPage = () => {
  if (indexOfLastPost < posts.length) {
    setCurrentPage(currentPage + 1);
  }
};

const handlePrevPage = () => {
  if (currentPage > 1) {
    setCurrentPage(currentPage - 1);
  }
};

  return (
    <AuthWrapper>
     
        <main className={styles.container}>
          <header className="flex items-center justify-between px-4 py-2 mt-5 mb-7">
            <nav className="flex items-center">
              <Link href="/dashboard">
                <p className="bg-white text-black py-2 px-4 rounded-lg border border-gray-300 hover:bg-blue-950 hover:text-white">
                  Dashboard
                </p>
              </Link>
            </nav>
            <button
              onClick={handleSave}
              className="bg-white text-black py-2 px-4 rounded-lg border border-gray-300 hover:bg-blue-950 hover:text-white"
            >
              Publish
            </button>
          </header>

          <section>
            <Cover url={coverUrl} setUrl={setCoverUrl} />
          </section>

          <section>
            <div className={styles.group}>
              {!coverUrl && (
                <div className={styles.hiddenContent}>
                  <button className={styles.button} onClick={enableCover}>
                    📷 Add Cover
                  </button>
                </div>
              )}
              <div className={styles.textareaContainer}>
                <textarea
                  placeholder="Article Title..."
                  className={styles.textarea}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                ></textarea>
              </div>
            </div>

            <Editor
              onChange={handleEditorChange}
              initialContent={JSON.stringify(editorContent)}
              editable={true}
            />
          </section>
          
          {/* Author Name Section */}
        <section className="flex justify-center my-6">
          <div className="w-full max-w-sm">
            <input
              type="text"
              placeholder="Author Name..."
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-center font-playfair font-semibold"
            />
          </div>
        </section>

          <section>
  <h1 className="text-yellow-500 text-2xl mb-4 font-bold mt-7">Posts</h1>
  <ul className="space-y-4">
    {currentPosts && currentPosts.length > 0 ? (
      currentPosts.map((post) => (
        <li
          key={post.id}
          ref={expandedPostId === post.id ? postRef : null}
          onClick={() => handlePostClick(post.id)}
          className={`cursor-pointer p-4 border rounded-lg transition-all duration-300 ease-in-out ${
            expandedPostId === post.id
              ? "border-blue-500 bg-gray-800"
              : "border-gray-600 hover:border-blue-500 hover:bg-gray-700"
          }`}
        >
          {/* The content for each post goes here */}
          {expandedPostId === post.id ? (
            <article>
              {post.cover_url && (
                <img
                  src={post.cover_url}
                  alt={post.title}
                  className="w-full max-w-md h-auto object-cover rounded mb-4 mx-auto"
                />
              )}
              <h2 className="font-bold text-xl text-gray-100 mb-2">
                {post.title}
              </h2>
              <div
                className="text-gray-300"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(post.content),
                }}
              />
              <p className="text-gray-400 font-bold font-playfair mt-3">
                Author: <span className="text-yellow-400 italic">{post.author_name || "Anonymous"}</span>
              </p>
              {/* Like, Bookmark, and Comment Section */}
              <div className="flex flex-col md:flex-row items-start mt-4">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`mr-4 ${
                    likedPosts.has(post.id)
                      ? "text-red-500"
                      : "text-gray-500"
                  }`}
                >
                  👍 Like
                </button>
                <button
                  onClick={() => handleBookmark(post.id)}
                  className={`mr-4 ${
                    bookmarkedPosts.has(post.id)
                      ? "text-yellow-500"
                      : "text-gray-500"
                  }`}
                >
                  📌 Bookmark
                </button>
                <div className="flex-1 flex flex-col md:flex-row items-start">
                  <input
                    type="text"
                    id={`comment-${post.id}`}
                    placeholder="Add a comment..."
                    className="mr-4 border border-gray-300 rounded px-2 py-1 mb-2 md:mb-0"
                  />
                  <button
                    onClick={() => handleCommentSubmit(post.id)}
                    className="bg-blue-500 text-white rounded px-4 py-1"
                  >
                    Comment
                  </button>
                </div>
              </div>
              <div className="mt-2">
                {comments[post.id]?.map((comment, index) => (
                  <p key={index} className="text-gray-400">
                    {comment}
                  </p>
                ))}
              </div>
            </article>
          ) : (
            <div className="flex items-center">
              {post.cover_url && (
                <img
                  src={post.cover_url}
                  alt={post.title}
                  className="w-16 h-16 object-cover rounded mr-4"
                />
              )}
              <div>
                <h2 className="font-bold text-lg text-white">
                  {post.title}
                </h2>
                <p className="text-gray-400">
                  {post.content ? post.content.slice(0, 80) : ""}...
                </p>
              </div>
            </div>
          )}
        </li>
      ))
    ) : (
      <p className="text-gray-400">No posts available</p>
    )}
  </ul>

  {/* Pagination Controls */}
  <div className="flex justify-between mt-6">
    {currentPage > 1 && (
      <button
        onClick={handlePrevPage}
        className="bg-white text-black py-2 px-4 rounded-lg border border-gray-300 hover:bg-blue-950 hover:text-white"
      >
        Previous
      </button>
    )}
    {indexOfLastPost < posts.length && (
      <button
        onClick={handleNextPage}
        className="bg-white text-black py-2 px-4 rounded-lg border border-gray-300 hover:bg-blue-950 hover:text-white"
      >
        Next
      </button>
    )}
  </div>
</section>

          <FooterBottom className="text-white mb-3" />
        </main>
      </AuthWrapper>
    
  );
};

export default EditorPage;
