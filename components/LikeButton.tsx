export default function LikeButton({ liked, count, toggleLike }: { liked: boolean; count: number; toggleLike: () => void }) {
  return (
    <button
      onClick={toggleLike}
      className={`px-4 py-2 rounded-lg font-semibold ${liked ? "text-red-500" : "text-white"} bg-gray-800 hover:bg-gray-700`}
    >
      👍 {count} {count === 1 ? "Like" : "Likes"}
    </button>
  );
}
