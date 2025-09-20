"use client";

import React, { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import { TextStyle } from "@tiptap/extension-text-style";
import ListItem from "@tiptap/extension-list-item";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common } from "lowlight";
import { createLowlight } from "lowlight";


const lowlight = createLowlight(common);

interface EditorProps {
  onChange: (updatedContent: string) => void;
  initialContent?: string;
  editable?: boolean;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  const colors = ["#f94144", "#f3722c", "#f9c74f", "#90be6d", "#577590", "#ffffff"];

  return (
    <div className="flex flex-wrap gap-2 mb-3">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`px-2 py-1 rounded border text-sm transition ${
          editor.isActive("bold")
            ? "bg-green-600 border-green-600 text-white"
            : "bg-[#161b22] border border-gray-700 text-gray-300 hover:bg-[#21262d] hover:border-blue-500"
        }`}
      >
        B
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`px-2 py-1 rounded border text-sm transition ${
          editor.isActive("italic")
            ? "bg-green-600 border-green-600 text-white"
            : "bg-[#161b22] border border-gray-700 text-gray-300 hover:bg-[#21262d] hover:border-blue-500"
        }`}
      >
        I
      </button>

      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`px-2 py-1 rounded border text-sm transition ${
          editor.isActive("underline")
            ? "bg-green-600 border-green-600 text-white"
            : "bg-[#161b22] border border-gray-700 text-gray-300 hover:bg-[#21262d] hover:border-blue-500"
        }`}
      >
        U
      </button>

      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`px-2 py-1 rounded border text-sm transition ${
          editor.isActive("strike")
            ? "bg-green-600 border-green-600 text-white"
            : "bg-[#161b22] border border-gray-700 text-gray-300 hover:bg-[#21262d] hover:border-blue-500"
        }`}
      >
        S
      </button>

      {/* Headings */}
      {[1, 2, 3].map((level) => (
        <button
          key={level}
          onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
          className={`px-2 py-1 rounded border text-sm transition ${
            editor.isActive("heading", { level })
              ? "bg-green-600 border-green-600 text-white"
              : "bg-[#161b22] border border-gray-700 text-gray-300 hover:bg-[#21262d] hover:border-blue-500"
          }`}
        >
          H{level}
        </button>
      ))}

      {/* Lists */}
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`px-2 py-1 rounded border text-sm transition ${
          editor.isActive("bulletList")
            ? "bg-green-600 border-green-600 text-white"
            : "bg-[#161b22] border border-gray-700 text-gray-300 hover:bg-[#21262d] hover:border-blue-500"
        }`}
      >
        • List
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`px-2 py-1 rounded border text-sm transition ${
          editor.isActive("orderedList")
            ? "bg-green-600 border-green-600 text-white"
            : "bg-[#161b22] border border-gray-700 text-gray-300 hover:bg-[#21262d] hover:border-blue-500"
        }`}
      >
        1. List
      </button>

      {/* Code & Highlight */}
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`px-2 py-1 rounded border text-sm transition ${
          editor.isActive("codeBlock")
            ? "bg-green-600 border-green-600 text-white"
            : "bg-[#161b22] border border-gray-700 text-gray-300 hover:bg-[#21262d] hover:border-blue-500"
        }`}
      >
        Code
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={`px-2 py-1 rounded border text-sm transition ${
          editor.isActive("highlight")
            ? "bg-green-600 border-green-600 text-white"
            : "bg-[#161b22] border border-gray-700 text-gray-300 hover:bg-[#21262d] hover:border-blue-500"
        }`}
      >
        Highlight
      </button>

      {/* Colors */}
      {colors.map((color) => (
        <button
          key={color}
          style={{ backgroundColor: color }}
          onClick={() => editor.chain().focus().setColor(color).run()}
          className={`w-6 h-6 rounded border transition ${
            editor.isActive("textStyle", { color })
              ? "ring-2 ring-offset-1 ring-blue-500"
              : "border-gray-700"
          }`}
        />
      ))}
    </div>
  );
};

const Editor: React.FC<EditorProps> = ({ onChange, initialContent = "", editable = true }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
        listItem: false,
        codeBlock: false, 
      }),
      TextStyle,
      Color,
      Highlight,
      Underline,
      Strike,
      BulletList,
      OrderedList,
      ListItem,
      CodeBlockLowlight.configure({
  lowlight,
}),


    ],
    content: initialContent || "",
    editable,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
         class:
      "prose prose-invert min-h-[250px] w-full outline-none p-3 rounded-lg bg-[#0d1117] text-gray-100 leading-relaxed break-words",
  },
    },
  });

  useEffect(() => {
    if (editor && initialContent && editor.getHTML() !== initialContent) {
      editor.commands.setContent(initialContent);
    }
  }, [initialContent, editor]);

  if (!editor) return null;

 return (
  <div
    className="border border-gray-700 rounded-xl p-3 bg-[#0d1117] text-gray-100 w-full max-w-3xl mx-auto cursor-text mt-10"
    onClick={() => editor.chain().focus().run()}
  >
    <MenuBar editor={editor} />
    
    {/* 👇 Wrap EditorContent with Tailwind Typography */}
    <div className="prose prose-invert max-w-none">
      <EditorContent editor={editor} />
    </div>
  </div>
);

};

export default Editor;
