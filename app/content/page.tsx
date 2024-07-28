'use client'

import React, { useMemo, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import dynamic from 'next/dynamic';
import styles from '@/app/content/content.module.css';
import Cover from '@/components/contentEditor/cover';
import FooterBottom from '@/components/firstPage/footerBottom';

import Button from '@/components/NavButtons';
// import cameraIcom from '@/assets/camera.svg'


const EditorPage = () => {
const [coverUrl, setCoverUrl] = useState<string>();

const enableCover = async () => {
  const randomImage = await fetch('https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')
  setCoverUrl(randomImage.url);
}


  const Editor = useMemo(() => dynamic(() => import('@/components/contentEditor/editor'), { ssr: false }), []);
  return (
    <main className={styles.container}>
   
     <header className="flex items-center justify-between px-4 py-2 mt-5 mb-7 " >
     <Button text='Dashbord'/>
      <div className="flex-1"></div>
     
      {/* <h1 className="text-4xl mb-7 mt-2 text-white font-bold text-center flex-1">
        Create Your Content
      </h1> */}
      <div className="flex-1 flex justify-end">
        <Button text='Publish' />
      </div>
    </header>

      <Cover url={coverUrl} setUrl={setCoverUrl}/>
      <div>
     <div className={styles.group}>
      {!coverUrl && 
      <div className={styles.hiddenContent}>
        <button className={styles.button}
        onClick={enableCover}
        >     
         🖼️Add Image </button>
      </div>
      }

      
      <div className={styles.textareaContainer}>
      
           <TextareaAutosize
            placeholder='Article Title...'
            className={styles.textarea}
          />
      </div>
       </div>
       
       
        <Editor onChange={() => {}} />
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
<FooterBottom/>
    </main>
  );
};

export default EditorPage;