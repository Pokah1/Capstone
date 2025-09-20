"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthWrapper from "@/components/AuthWrapper";
import FooterBottom from "@/components/firstPage/footerBottom";
import { createClient } from "@/utils/supabase/client";
import { fetchPosts, savePost, updatePost } from "@/utils/userService";
import { Post } from "@/types";
import AuthorInfo from "@/components/contentInfo/AuthorInfo";
import PostEditor from "@/components/contentInfo/PostEditor";
import PostList from "@/components/contentInfo/PostList";

const supabase = createClient();

export default function EditorPage() {
  const [user, setUser] = useState<any | null>(null);
  const [authorName, setAuthorName] = useState("Anonymous");
  const [posts, setPosts] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // for editing
  const [editingPost, setEditingPost] = useState<any | null>(null);

  const router = useRouter();

  // Load user
  useEffect(() => {
    const loadUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      setUser(authUser);

      const { data: profile } = await supabase
        .from("users")
        .select("full_name")
        .eq("id", authUser.id)
        .single();

      const name =
        profile?.full_name ||
        (authUser.user_metadata?.full_name as string) ||
        authUser.email ||
        "Anonymous";

      setAuthorName(name);
    };
    loadUser();
  }, []);

  // Load posts
  useEffect(() => {
    const loadPosts = async () => {
      const postsData = await fetchPosts();
      setPosts(postsData);
    };
    loadPosts();
  }, []);

  // Save or update post
 const handleSave = async (title: string, content: string, cover_url: string) => {
  if (!user?.id) return;

  let newPost: Post

  if (editingPost) {
    newPost = await updatePost(editingPost.id as string, title, content, cover_url);
    setPosts((prev) =>
    prev.map((p) => (p.id === editingPost.id ? newPost: p))
    );
    setEditingPost(null);
    alert("Post updated successfully");
  } else {
    newPost = await savePost(title, content, cover_url, user.id, authorName);
    if (newPost) {
      setPosts((prev) => [newPost, ...prev]);
      alert("Post saves successfully");
    }
  }
 };

  return (
    <AuthWrapper>
      <main className="w-full min-h-screen flex flex-col gap-6 p-6 bg-[#010414] text-white font-poppins">
        {/* Dashboard Button */}
        <header className="flex justify-between items-center flex-wrap gap-2">
          <button
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-black font-medium transition hover:bg-blue-900 hover:text-white"
            onClick={() => router.push("/dashboard")}
          >
            Dashboard
          </button>
        </header>

        {/* Editor */}
        <PostEditor
          onSave={handleSave}
          editingPost={editingPost}
          clearEditing={() => setEditingPost(null)}
        />

        {/* Author */}
        <AuthorInfo authorName={authorName} />

        {/* Posts List */}
        <PostList
          posts={posts}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          currentUserId={user?.id || ""}
          onEdit={(post) => setEditingPost(post)}
        />

        <FooterBottom />
      </main>
    </AuthWrapper>
  );
}
