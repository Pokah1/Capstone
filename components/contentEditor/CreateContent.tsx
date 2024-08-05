// components/CreateContent.tsx
import { useState, FormEvent } from 'react';

export default function CreateContent() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [coverUrl, setCoverUrl] = useState('');

  const handleCreateContent = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch('/api/content/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, content, cover_url: coverUrl }),
    });

    const data = await res.json();
    console.log(data);
  };

  return (
    <form onSubmit={handleCreateContent}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
      ></textarea>
      <input
        type="text"
        value={coverUrl}
        onChange={(e) => setCoverUrl(e.target.value)}
        placeholder="Cover URL"
      />
      <button type="submit">Create Content</button>
    </form>
  );
}
