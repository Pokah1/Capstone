"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { createClient } from "@/utils/supabase/client";
import styles from "@/components/contentEditor/CreateContent.module.css";
import FooterBottom from "@/components/firstPage/footerBottom";
import { PartialBlock } from "@blocknote/core";
import Cover from "@/components/contentEditor/cover";
import { extractTextContent } from "@/utils/extractText";
import { fetchUser } from "@/utils/fetchUser";
import { fetchPosts } from "@/utils/fetchPosts";
import { useRouter } from "next/navigation";
import Button from "@/components/NavButtons";
import DOMPurify from "dompurify";

const EditorPage = () => {
  const [coverUrl, setCoverUrl] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [editorContent, setEditorContent] = useState<string>("");
  const [user, setUser] = useState<any | null>(null);
  const [plainTextContent, setPlainTextContent] = useState<string>("");
  const [posts, setPosts] = useState<any[]>([]);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [viewCount, setViewCount] = useState<number | null>(null);

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const loadUser = async () => {
      const user = await fetchUser(router);
      if (user) setUser(user);
      setLoading(false);
    };
    loadUser();
  }, [router]);



//a function to record users Views
  async function recordView(post_id: string, user_id: string) {
    try {
      const response = await fetch('/api/post-views', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ post_id, user_id }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to record view: ${errorText}`);
      }
  
      const data = await response.json();
      console.log('View recorded:', data);
    } catch (error) {
      console.error('Error recording view:', error);
    }
  }
  

  useEffect(() => {
    if (!loading) {
      fetchPosts();
    }
  }, [loading]);



  //A function to handle changes in the Markdown Editor
  const handleEditorChange = (updatedContent: string) => {
    try {
      const blocks = JSON.parse(updatedContent) as PartialBlock[];
      const plainTextContent = extractTextContent(blocks);

      setEditorContent(updatedContent);
      setPlainTextContent(plainTextContent);
    } catch (error) {
      console.error("Error parsing editor content:", error);
    }
  };
 

  //Default CoverUrl for a post
  const enableCover = async () => {
    const response = await fetch(
      "https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    );
    const imageUrl = await response.url;
    setCoverUrl(imageUrl);
  };


  //Markdown Editor imported dynamically
  const Editor = useMemo(
    () =>
      dynamic(() => import("@/components/contentEditor/editor"), {
        ssr: false,
      }),
    []
  );

  
//a function to handle svae after a content has been created
  const handleSave = async () => {
    try {
      console.log("User from supabase:", user);

      if (!user || !user.id) {
        console.error("User ID is not available");
        return;
      }

      console.log("User ID:", user.id);

      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content: DOMPurify.sanitize(plainTextContent),
          cover_url: coverUrl,
          user_id: user.id,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Post saved:", result);
        setPosts([...posts, result]);
        setCoverUrl("");
        setTitle("");
        setEditorContent("");
        setPlainTextContent("");
        setSelectedPost(null);
        setIsEditing(false);
        fetchPosts();
      } else {
        console.error("Error saving post:", response.statusText);
      }
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };

  

  // a function to handle events that will be triggerd when a post is clicked
  const handlePostClick = async (post: any) => {
    setSelectedPost(post.id === selectedPost?.id ? null : post);
  
    if (!isEditing) {
      setTitle("");
      setEditorContent("");
      setPlainTextContent("");
      setCoverUrl("");
  
      if (user && user.id) {
        await recordView(post.id, user.id);
        try {
          const response = await fetch(`/api/post-views/${post.id}/count`);
          if (response.ok) {
            const { viewCount } = await response.json();
            setViewCount(viewCount);
          } else {
            console.error("Error fetching view count");
          }
        } catch (error) {
          console.error("Error fetching view count:", error);
        }
      } else {
        console.error("User information is missing.");
      }
    } else {
      // Handle the case where the post is being edited
      setTitle(post.title || "");
      setEditorContent(post.content || "");
      setPlainTextContent(post.content || "");
      setCoverUrl(post.cover_url || "");
  
      // Fetch the view count for the selected post
      try {
        const response = await fetch(`/api/post-views/${post.id}/count`);
        if (response.ok) {
          const { viewCount } = await response.json();
          setViewCount(viewCount);
        } else {
          console.error("Error fetching view count");
        }
      } catch (error) {
        console.error("Error fetching view count:", error);
      }
    }
  };
  

  //a funtion to load fetchedPost/
  //fetchpost is coming from utils folder
  useEffect(() => {
    if (!loading) {
      const loadPosts = async () => {
        const postsData = await fetchPosts();
        setPosts(postsData);
      };
      loadPosts();
    }
  }, [loading]);

  return (
    <main className={styles.container}>
      <header className="flex items-center justify-between px-4 py-2 mt-5 mb-7">
        <Button text="Dashboard" />
        <div className="flex-1"></div>
        <div className="flex-1 flex justify-end">
          <Button text="Publish" onClick={handleSave} />

        </div>
      </header>

      <Cover url={coverUrl} setUrl={setCoverUrl} />
      <div>
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
      </div>
      <section>
        <h1 className="text-white text-2xl mb-4">Posts</h1>
        <ul className="space-y-4">
          {posts && posts.length > 0 ? (
            posts.map((post) => (
              <li
                key={post.id}
                onClick={() => handlePostClick(post)}
                className={`cursor-pointer p-4 border
 rounded-lg transition-all duration-300 ease-in-out ${
   selectedPost?.id === post.id
     ? "border-blue-500 bg-gray-800"
     : "border-gray-600 hover:border-blue-500 hover:bg-gray-700"
 }`}
              >
                {selectedPost?.id !== post.id ? (
                  <div className="flex items-center">
                    {post.cover_url && (
                      <img
                        src={post.cover_url}
                        alt={post.title}
                        className="w-16 h-16 object-cover rounded mr-4"
                      />
                    )}
                    <div>
                      <h1 className="font-bold text-lg text-white">
                        {post.title}
                      </h1>
                      <p className="text-gray-400">
                        {post.content ? post.content.slice(0, 80) : ""}...
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    {post.cover_url && (
                      <img
                        src={post.cover_url}
                        alt={post.title}
                        className="w-full max-w-md h-auto object-cover rounded mb-4 mx-auto"
                      />
                    )}
                    <h1 className="font-bold text-xl text-white mb-2">
                      {post.title}
                    </h1>
                    <div
                      className="text-gray-300"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(post.content),
                      }}
                    />
                    <div className="text-gray-600 mt-2 font-bold">
                      Views: {viewCount ?? 0}
                    </div>
                  </div>
                )}
              </li>
            ))
          ) : (
            <p className="text-gray-400">No posts available</p>
          )}
        </ul>
      </section>

      <FooterBottom className="text-white" />
    </main>
  );
};

export default EditorPage;
