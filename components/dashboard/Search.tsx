"use client";

import React, { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react"; // ✅ adds a search icon

// Debounce hook
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

const SearchComponent: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<any[]>([]);
  const debouncedQuery = useDebounce(query, 300);
  const router = useRouter();
  const supabase = createClient();

  const fetchPosts = useCallback(
    async (searchQuery: string) => {
      if (searchQuery.trim() === "") {
        setResults([]);
        return;
      }

      const { data, error } = await supabase
        .from("posts")
        .select("id, title, content, author_name")
        .or(`title.ilike.%${searchQuery}%,author_name.ilike.%${searchQuery}%`);

      if (error) {
        console.error("Error fetching posts:", error);
        setResults([]);
      } else {
        setResults(data || []);
      }
    },
    [supabase]
  );

  useEffect(() => {
    fetchPosts(debouncedQuery);
  }, [debouncedQuery, fetchPosts]);

  const handlePostClick = (post: any) => {
    router.push(`/posts/${post.id}`);
  };

  return (
    <section className="w-full">
      {/* Input Field */}
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search content or authors..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 font-poppins"
        />
      </div>

      {/* Results */}
      <div className="mt-4">
        {results.length > 0 ? (
          <ul className="space-y-3">
            {results.map((post) => (
              <li
                key={post.id}
                onClick={() => handlePostClick(post)}
                className="p-4 rounded-lg bg-gray-800 border border-gray-700 cursor-pointer hover:bg-gray-700 hover:border-yellow-400 transition-colors"
              >
                <h3 className="font-semibold text-white text-sm sm:text-base truncate">
                  {post.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 line-clamp-2">
                  {post.content?.slice(0, 100)}...
                </p>
              </li>
            ))}
          </ul>
        ) : (
          query.trim() !== "" && (
            <p className="text-gray-500 text-sm mt-2">No results found.</p>
          )
        )}
      </div>
    </section>
  );
};

export default SearchComponent;
