import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';

// Debounce function to delay the fetchPosts call
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const SearchComponent: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<any[]>([]);
  const [selectedPost, setSelectedPost] = useState<any | null>(null); // State for selected post
  const debouncedQuery = useDebounce(query, 300); // Debounce search input

  const supabase = createClient();

  const fetchPosts = useCallback(async (searchQuery: string) => {
    if (searchQuery.trim() === '') {
      setResults([]); // Clear results if searchQuery is empty
      return;
    }

    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .ilike('title', `%${searchQuery}%`);

    if (error) {
      console.error('Error fetching posts:', error);
      setResults([]);
    } else {
      setResults(data);
    }
  }, []);

  useEffect(() => {
    fetchPosts(debouncedQuery);
  }, [debouncedQuery, fetchPosts]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setSelectedPost(null); // Reset selected post when search query changes
  };

  const handlePostClick = (post: any) => {
    setSelectedPost(post); // Set the selected post
  };

  return (
    <section className="mt-6">
      <h2 className="text-lg font-semibold mb-2">Search</h2>
      <input
        type="text"
        placeholder="Search content or users..."
        value={query}
        onChange={handleSearchChange}
        className="w-full p-2 border border-gray-300 rounded-md text-black placeholder-gray-500"
      />

      <div className="mt-4">
        {selectedPost ? (
          // Show only the selected post
          <div className="p-4 border border-gray-300 rounded-md">
            <h2 className="text-xl font-bold">{selectedPost.title}</h2>
            <p>{selectedPost.content}</p>
          </div>
        ) : results.length > 0 ? (
          <ul className="list-none">
            {results.map((post) => (
              <li
                key={post.id}
                className="cursor-pointer mb-2 p-3 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors duration-300 max-w-md"
                onClick={() => handlePostClick(post)}
              >
                <h3 className="font-semibold text-sm truncate">{post.title}</h3>
                <p className="text-xs text-gray-600">{post.content.slice(0, 80)}...</p>
              </li>
            ))}
          </ul>
        ) : (
          query.trim() !== '' && (
            <p className="text-gray-500">No results found.</p>
          )
        )}
      </div>
    </section>
  );
};

export default SearchComponent;
