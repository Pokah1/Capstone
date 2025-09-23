import { Heart } from "lucide-react";

interface LikeButtonProps {
  liked: boolean;
  count: number;
  toggleLike: () => void;
}

export default function LikeButton({ liked, count, toggleLike }: LikeButtonProps) {
  return (
    <button
      onClick={toggleLike}
      className="flex items-center gap-2 px-4 py-2 rounded-lg font-poppins font-semibold bg-gray-800 hover:bg-gray-700 transition-colors"
    >
      <Heart
        className={`w-5 h-5 ${liked ? "fill-red-500 text-red-500" : "text-gray-300"}`}
      />
      <span className={liked ? "text-red-500" : "text-gray-200"}>
        {count} {count === 1 ? "Like" : "Likes"}
      </span>
    </button>
  );
}
