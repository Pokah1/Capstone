"use client";

import DOMPurify from "dompurify";

interface PostContentProps {
  post: {
    title: string;
    cover_url?: string;
    content: string;
  } | null;
}

export default function PostContent({ post }: PostContentProps) {
  if (!post) return null;

  return (
    <article className="w-full max-w-4xl mx-auto flex flex-col gap-4 sm:gap-6 px-4">
  {post.cover_url && (
    <img
      src={post.cover_url}
      alt={post.title}
      className="w-full max-h-60 sm:max-h-96 object-cover rounded-lg shadow-md"
    />
  )}

  <h1 className="text-2xl sm:text-3xl md:text-4xl font-playfair font-extrabold text-yellow-400 text-center leading-snug">
    {post.title}
  </h1>

  <div
    className="prose prose-invert text-gray-200 max-w-none text-sm sm:text-base"
    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
  />
</article>

  );
}
