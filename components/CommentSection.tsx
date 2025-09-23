"use client";

import { useState } from "react";
import { Comment } from "@/types";

export default function CommentSection({
  comments,
  addComment,
  deleteComment,
  editComment,
  currentUserId,
}: {
  comments: Comment[];
  addComment: (text: string) => void;
  deleteComment: (commentId: string) => void;
  editComment: (commentId: string, newText: string) => void;
  currentUserId: string | null;
}) {
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const handleSubmit = () => {
    if (!text.trim()) return;
    addComment(text);
    setText("");
  };

  const handleSaveEdit = (commentId: string) => {
    if (!editText.trim()) return;
    editComment(commentId, editText);
    setEditingId(null);
    setEditText("");
  };

  return (
    <section className="mt-8 max-w-3xl w-full mx-auto flex flex-col gap-4 px-2 sm:px-4">
      <h2 className="text-lg sm:text-xl font-playfair font-bold text-white border-b border-gray-700 pb-1">
        Comments
      </h2>

      {/* Comments List */}
      <div className="flex flex-col gap-3 max-h-96 overflow-y-auto">
        {comments.map((c) => {
          const commentedAt = new Date(c.commented_at ?? Date.now());
          const updatedAt = c.updated_at ? new Date(c.updated_at) : null;
          const isEdited =
            updatedAt && updatedAt.getTime() > commentedAt.getTime();

          return (
            <div
              key={c.id}
              className="px-3 sm:px-4 py-2 rounded-xl bg-gray-900 border border-gray-700 shadow-inner flex justify-between items-start"
            >
              <div className="flex-1 min-w-0">
                {editingId === c.id ? (
                  <>
                    <input
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full px-3 py-1 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleSaveEdit(c.id)}
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-400 text-xs sm:text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setEditText("");
                        }}
                        className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-500 text-xs sm:text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-300 break-words">
                      <span className="italic font-semibold text-yellow-400">
                        {c.author_name || "Anonymous"}:
                      </span>{" "}
                      <span className="text-gray-200">{c.comment}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Posted: {commentedAt.toLocaleString()}
                      {isEdited && (
                        <span className="ml-2 italic text-gray-400">
                          (Edited {updatedAt?.toLocaleString()})
                        </span>
                      )}
                    </p>
                  </>
                )}
              </div>

              {/* Action buttons */}
              {currentUserId &&
                c.user_id === currentUserId &&
                editingId !== c.id && (
                  <div className="flex gap-2 ml-2 flex-shrink-0">
                    <button
                      onClick={() => {
                        setEditingId(c.id);
                        setEditText(c.comment);
                      }}
                      className="text-blue-400 hover:text-blue-300 font-semibold text-xs sm:text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteComment(c.id)}
                      className="text-red-500 hover:text-red-400 font-semibold text-xs sm:text-sm"
                    >
                      Delete
                    </button>
                  </div>
                )}
            </div>
          );
        })}
      </div>

      {/* Add new comment */}
      <div className="flex flex-col sm:flex-row gap-2 mt-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
          placeholder="Add a comment..."
        />
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition text-sm"
        >
          Comment
        </button>
      </div>
    </section>
  );
}
