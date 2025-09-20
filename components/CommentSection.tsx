"use client";

import { useState } from "react";
import { Comment } from "@/types";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export default function CommentSection({
  comments,
  addComment,
  deleteComment,
  currentUserId,
}: {
  comments: Comment[];
  addComment: (text: string) => void;
  deleteComment: (commentId: string) => void;
  currentUserId: string | null;
}) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!text.trim()) return;
    addComment(text);
    setText("");
  };

  return (
    <section className="mt-8 flex flex-col gap-4">
      <h2 className="text-lg font-playfair font-bold text-white border-b border-gray-700 pb-1">
        Comments
      </h2>

      <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
        {comments.map((c) => (
          <div
            key={c.id}
            className="px-4 py-2 rounded-xl bg-gray-900 border border-gray-700 shadow-inner flex justify-between items-start"
          >
            <div>
              <p className="text-sm text-gray-300">
                <span className="italic font-semibold text-yellow-400">
                  {c.author_name || "Anonymous"}:
                </span>{" "}
                <span className="text-gray-200">{c.comment}</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(c.commented_at ?? Date.now()).toLocaleString()}

              </p>
            </div>

            {/* Delete button only for comment owner */}
            {currentUserId && c.user_id === currentUserId && (
              <button
                onClick={() => deleteComment(c.id)}
                className="ml-2 text-red-500 hover:text-red-400 font-semibold text-sm"
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          placeholder="Add a comment..."
        />
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition"
        >
          Comment
        </button>
      </div>
    </section>
  );
}
