'use client'

import React, { useMemo, useState, useEffect } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import dynamic from 'next/dynamic';
import { stringify } from 'flatted';
import { useRouter } from 'next/navigation';
import supabase from '@/utils/supabase/client'; // Ensure this import is correct
import styles from '@/app/content/content.module.css';
import Cover from '@/components/contentEditor/cover';
import FooterBottom from '@/components/firstPage/footerBottom';
import Button from '@/components/NavButtons';
import { PartialBlock } from '@blocknote/core';

const EditorPage = () => {
  const [coverUrl, setCoverUrl] = useState<string>();
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [postId, setPostId] = useState<string | null>(null); // For updating existing posts
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserId = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
  
      if (error) {
        console.error('Error fetching user:', error.message);
        return;
      }
  
      console.log('Fetched user:', user);
      setUserId(user?.id || null);
    };
  
    fetchUserId();
  }, []);
  
  const enableCover = async () => {
    const response = await fetch('https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
    const randomImage = await response.json();
    setCoverUrl(randomImage.url);
  };

  const handleSave = async () => {
    if (!userId) {
      alert('User is not authenticated');
      return;
    }

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, coverUrl, userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to save content');
      }

      alert('Content saved successfully!');
      router.push('/dashboard'); // Redirect after saving
    } catch (error) {
      console.error('Error saving content:', error);
      alert('Error saving content. Please try again.');
    }
  };

  const handleUpdate = async () => {
    if (!postId) {
      throw new Error('Post ID is required to update a post');
    }

    try {
      const response = await fetch('/api/posts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: postId, title, content, coverUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to update content');
      }

      alert('Content updated successfully!');
      router.push('/dashboard'); // Redirect after updating
    } catch (error) {
      console.error('Error updating content:', error);
      alert('Error updating content. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (!postId) {
      throw new Error('Post ID is required to delete a post');
    }

    try {
      const response = await fetch('/api/posts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: postId }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete content');
      }

      alert('Content deleted successfully!');
      router.push('/dashboard'); // Redirect after deleting
    } catch (error) {
      console.error('Error deleting content:', error);
      alert('Error deleting content. Please try again.');
    }
  };

  const handleEditorChange = (blocks: PartialBlock[]) => {
    // Convert blocks to a JSON string
    const contentString = stringify(blocks);
    setContent(contentString); // Save the string representation of blocks
  };

  const Editor = useMemo(() => dynamic(() => import('@/components/contentEditor/editor'), { ssr: false }), []);

  return (
    <main className={styles.container}>
      <header className="flex items-center justify-between px-4 py-2 mt-5 mb-7">
        <Button text='Dashboard' />
        <div className="flex-1"></div>
        <div className="flex-1 flex justify-end">
          <Button text='Save' onClick={handleSave} />
          <Button text='Update' onClick={handleUpdate} />
          <Button text='Delete' onClick={handleDelete} />
        </div>
      </header>

      <Cover url={coverUrl} setUrl={setCoverUrl} />
      <div>
        <div className={styles.group}>
          {!coverUrl && (
            <div className={styles.hiddenContent}>
              <button className={styles.button} onClick={enableCover}>     
                🖼️ Add Image
              </button>
            </div>
          )}
          <div className={styles.textareaContainer}>
            <TextareaAutosize
              placeholder='Article Title...'
              className={styles.textarea}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        </div>

        <Editor onChange={handleEditorChange} />
      </div>
      <div className={styles.aside}>
        <section className={`${styles.section} ${styles.toDoList}`}>
          <h2>To-Do List</h2>
          <input type="text" placeholder="New task..." />
          <button>Add</button>
          <ul className={styles.list}>
            <li className={styles.listItem}>Finish project</li>
            <li className={styles.listItem}>Review PR</li>
          </ul>
        </section>
        <section className={styles.section}>
          <h2>Statistics</h2>
          {/* Statistics content here */}
        </section>
        <section className={styles.section}>
          <h2>Calendar</h2>
          <ul className={styles.list}>
            <li className={styles.listItem}>Event 1: July 20</li>
            <li className={styles.listItem}>Event 2: July 21</li>
          </ul>
        </section>
      </div>
      <FooterBottom className='text-white'/>
    </main>
  );
};

export default EditorPage;
