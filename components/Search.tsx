import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation'; // Ensure you are using `next/navigation`

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
  const debouncedQuery = useDebounce(query, 300); // Debounce search input
  const router = useRouter(); // Router for navigation
  const supabase = createClient();

  const fetchPosts = useCallback(async (searchQuery: string) => {
    if (searchQuery.trim() === '') {
      setResults([]); // Clear results if searchQuery is empty
      return;
    }

    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .or(`title.ilike.%${searchQuery}%,author_name.ilike.%${searchQuery}%`);

    if (error) {
      console.error('Error fetching posts:', error);
      setResults([]);
    } else {
      setResults(data);
    }
  }, [supabase]);

  useEffect(() => {
    fetchPosts(debouncedQuery);
  }, [debouncedQuery, fetchPosts]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handlePostClick = (post: any) => {
    router.push(`/content/${post.id}`); // Adjust the path if needed
  };

  return (
    <section className="mt-6">
      <h2 className="text-lg font-semibold mb-2">Search</h2>
      <input
        type="text"
        placeholder="Search content or authors..."
        value={query}
        onChange={handleSearchChange}
        className="w-full p-2 border border-gray-300 rounded-md text-black placeholder-gray-500"
      />

      <div className="mt-4">
        {results.length > 0 ? (
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
