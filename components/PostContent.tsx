import DOMPurify from "dompurify";

export default function PostContent({ post }: { post: any }) {
  if (!post) return null;

  return (
    <article className="w-full max-w-4xl mx-auto flex flex-col gap-6">
      {post.cover_url && (
        <img
          src={post.cover_url}
          alt={post.title}
          className="w-full max-h-96 object-cover rounded-lg shadow-md"
        />
      )}
      <h1 className="text-4xl font-playfair font-extrabold text-yellow-400 text-center">{post.title}</h1>
      <div
        className="text-gray-200 leading-7"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
      />
    </article>
  );
}
