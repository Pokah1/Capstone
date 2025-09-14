"use client";

import React, { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";


import styles from "./editor.module.css";

interface EditorProps {
  onChange: (updatedContent: string) => void;
  initialContent?: string;
  editable?: boolean;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  const colors = ["#f94144", "#f3722c", "#f9c74f", "#90be6d", "#577590", "#ffffff"];

  return (
    <div className={styles.menuBar}>
      <button onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive("bold") ? styles.activeButton : styles.button}>B</button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive("italic") ? styles.activeButton : styles.button}>I</button>
      <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive("underline") ? styles.activeButton : styles.button}>U</button>
      <button onClick={() => editor.chain().focus().toggleStrike().run()} className={editor.isActive("strike") ? styles.activeButton : styles.button}>S</button>

      <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive("heading", { level: 1 }) ? styles.activeButton : styles.button}>H1</button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive("heading", { level: 2 }) ? styles.activeButton : styles.button}>H2</button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor.isActive("heading", { level: 3 }) ? styles.activeButton : styles.button}>H3</button>

      <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive("bulletList") ? styles.activeButton : styles.button}>• List</button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive("orderedList") ? styles.activeButton : styles.button}>1. List</button>

      <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={editor.isActive("codeBlock") ? styles.activeButton : styles.button}>Code</button>
      <button onClick={() => editor.chain().focus().toggleHighlight({ color: "#ffd700" }).run()} className={editor.isActive("highlight") ? styles.activeButton : styles.button}>Highlight</button>

      {colors.map(color => (
        <button
          key={color}
          style={{ backgroundColor: color }}
          onClick={() => editor.chain().focus().setColor(color).run()}
          className={editor.isActive("color", { color }) ? styles.activeButton : styles.button}
        />
      ))}
    </div>
  );
};

const Editor: React.FC<EditorProps> = ({ onChange, initialContent = "", editable = true }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Color,
      Highlight,
      Underline,
      Strike,
      BulletList,
      OrderedList,
      ListItem,
    ],
    content: initialContent || "",
    editable,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: { attributes: { class: styles.editorContent } },
  });

  useEffect(() => {
    if (editor && initialContent && editor.getHTML() !== initialContent) {
      editor.commands.setContent(initialContent);
    }
  }, [initialContent, editor]);

  if (!editor) return null;

  return (
    <div className={styles.editorContainer} onClick={() => editor.chain().focus().run()}>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default Editor;
