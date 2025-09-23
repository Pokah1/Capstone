"use client";

import { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import DOMPurify from "dompurify";
import Cover from "@/components/contentEditor/cover";

type Props = {
  onSave: (title: string, content: string, coverUrl: string) => Promise<void>;
  editingPost?: any | null;
  clearEditing: () => void;
};

export default function PostEditor({ onSave, editingPost, clearEditing }: Props) {
  const [coverUrl, setCoverUrl] = useState("");
  const [title, setTitle] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [saving, setSaving] = useState(false);

  // New state to force editor remount
  const [editorKey, setEditorKey] = useState("new");

  const Editor = useMemo(
    () => dynamic(() => import("@/components/contentEditor/editor"), { ssr: false }),
    []
  );

  // Preload data if editing
  useEffect(() => {
    if (editingPost) {
      setTitle(editingPost.title);
      setEditorContent(editingPost.content);
      setCoverUrl(editingPost.cover_url || "");
      setEditorKey(editingPost.id); // use post id to keep content
    } else {
      resetFields(false); // clear for new post
    }
  }, [editingPost]);

  // Reset function
  const resetFields = (resetEditing = true) => {
    setTitle("");
    setEditorContent("");
    setCoverUrl("");
    setEditorKey(Date.now().toString()); // force remount
    if (resetEditing) clearEditing();
  };

  // Default cover
  const enableCover = () => {
    setCoverUrl(
      "https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?q=80&w=2071&auto=format&fit=crop"
    );
  };

  const handleSave = async () => {
    if (!title.trim() || !editorContent.trim() || saving) return;

    setSaving(true);
    await onSave(title, DOMPurify.sanitize(editorContent), coverUrl);
    setSaving(false);

    resetFields(); // clears editor + title + cover
  };

  return (
    <section className="relative mb-12">
      <Cover url={coverUrl} setUrl={setCoverUrl} />

      {!coverUrl && (
        <div className="flex justify-center mb-4">
          <button
            onClick={enableCover}
            className="px-4 py-2 rounded bg-[#06093b] text-white hover:bg-[#131b3a] font-playfair"
          >
            Add Cover
          </button>
        </div>
      )}

      <textarea
        placeholder="Article Title..."
        className="w-full max-w-3xl text-center text-3xl md:text-4xl font-playfair font-bold bg-[#010414] border border-gray-600 rounded-lg p-3 text-white placeholder:text-gray-400 resize-none mx-auto block mt-6"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        rows={2}
      />

      <Editor
        key={editorKey} // dynamic key forces remount
        onChange={setEditorContent}
        initialContent={editorContent}
        editable
      />

      <div className="fixed bottom-6 right-6 z-50 flex gap-2">
        {editingPost && (
          <button
            onClick={() => resetFields()}
            className="px-6 py-3 rounded-lg border border-gray-300 bg-gray-500 text-white font-medium shadow-lg hover:bg-gray-700"
          >
            Cancel
          </button>
        )}
        <button
          onClick={handleSave}
          disabled={saving}
          className={`px-6 py-3 rounded-lg border border-gray-300 bg-white text-black font-medium shadow-lg transition duration-300 ${
            saving ? "opacity-60 cursor-not-allowed" : "hover:bg-[#06093b] hover:text-white"
          }`}
        >
          {saving ? "Saving..." : editingPost ? "Update" : "Publish"}
        </button>
      </div>
    </section>
  );
}
