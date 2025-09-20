"use client";

import { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import DOMPurify from "dompurify";
import Cover from "../contentEditor/cover";

type Props = {
  onSave: (title: string, content: string, coverUrl: string) => Promise<void>;
  editingPost?: any | null;
  clearEditing: () => void;
};

export default function PostEditor({
  onSave,
  editingPost,
  clearEditing,
}: Props) {
  const [coverUrl, setCoverUrl] = useState("");
  const [title, setTitle] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [saving, setSaving] = useState(false);

  const Editor = useMemo(
    () =>
      dynamic(() => import("@/components/contentEditor/editor"), {
        ssr: false,
      }),
    []
  );

  // preload data if editing, clear if not
  useEffect(() => {
    if (editingPost) {
      setTitle(editingPost.title);
      setEditorContent(editingPost.content);
      setCoverUrl(editingPost.cover_url || "");
    } else {
      // clear fields when editing is done
      setTitle("");
      setEditorContent("");
      setCoverUrl("");
    }
  }, [editingPost]);

  const handleSave = async () => {
  if (!title.trim() || !editorContent.trim()) return;
  if (saving) return;

  setSaving(true);
  await onSave(title, DOMPurify.sanitize(editorContent), coverUrl);
  setSaving(false);

  // reset everything after save
  setTitle("");
  setEditorContent("");
  setCoverUrl("");
  clearEditing();
};


  return (
    <section className="relative mb-12">
      <Cover url={coverUrl} setUrl={setCoverUrl} />

      {/* Title */}
      <textarea
        placeholder="Article Title..."
        className="w-full max-w-3xl text-center text-3xl md:text-4xl font-playfair font-bold bg-[#010414] border border-gray-600 rounded-lg p-3 text-white placeholder:text-gray-400 resize-none mx-auto block mt-6"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        rows={2}
      />

      {/* Editor */}
      <Editor
      key={editingPost ? editingPost.id : "new"}
        onChange={setEditorContent}
        initialContent={editorContent}
        editable
      />

      {/* Publish / Update Button */}
      <div className="fixed bottom-6 right-6 z-50 flex gap-2">
        {editingPost && (
          <button
            onClick={clearEditing}
            className="px-6 py-3 rounded-lg border border-gray-300 bg-gray-500 text-white font-medium shadow-lg hover:bg-gray-700"
          >
            Cancel
          </button>
        )}
        <button
          onClick={handleSave}
          disabled={saving}
          className={`px-6 py-3 rounded-lg border border-gray-300 bg-white text-black font-medium shadow-lg transition duration-300 ${
            saving
              ? "opacity-60 cursor-not-allowed"
              : "hover:bg-blue-900 hover:text-white"
          }`}
        >
          {saving ? "Saving..." : editingPost ? "Update" : "Publish"}
        </button>
      </div>
    </section>
  );
}
