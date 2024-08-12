// "use client";

// import React, { useState, useEffect, useMemo } from "react";
// import dynamic from "next/dynamic";
// import { supabase } from "@/lib/supabase";
// import styles from '@/components/contentEditor/CreateContent.module.css';
// import Cover from "@/components/contentEditor/cover";
// import FooterBottom from "@/components/firstPage/footerBottom";
// import { PartialBlock } from "@blocknote/core";
// import Button from "@/components/NavButtons";
// import DOMPurify from 'dompurify';

// const EditorPage = () => {
//   const [coverUrl, setCoverUrl] = useState<string>("");
//   const [title, setTitle] = useState<string>("");
//   const [editorContent, setEditorContent] = useState<string>(""); // State for editor content as string
//   const [plainTextContent, setPlainTextContent] = useState<string>(""); // State for plain text content
//   const [posts, setPosts] = useState<any[]>([]);
//   const [selectedPost, setSelectedPost] = useState<any | null>(null);
// const [isEditing, setIsEditing] = useState<boolean>(false)



//   useEffect(() => {
//     fetchPosts();
//   }, []);

//   // Utility function to extract text content from blocks
//   const extractTextContent = (blocks: PartialBlock[]): string => {
//     let textContent = '';
  
//     blocks.forEach(block => {
//       // Check if block.content is an array and iterate through it
//       if (Array.isArray(block.content)) {
//         block.content.forEach((contentBlock: any) => {
//           if (contentBlock.type === 'text') {
//             textContent += contentBlock.text;
//           }
//         });
//       }
  
//       // Check if the block has children and recursively extract text
//       if (block.children && Array.isArray(block.children)) {
//         textContent += extractTextContent(block.children);
//       }
//     });
  
//     return textContent;
//   };
  

//   const handleEditorChange = (updatedContent: string) => {
//     console.log('Editor content updated:', updatedContent);
    
//     try {
//       const blocks = JSON.parse(updatedContent) as PartialBlock[]; // Convert string to blocks
//       const plainTextContent = extractTextContent(blocks);
      
//       setEditorContent(updatedContent); // Save raw content if needed
//       setPlainTextContent(plainTextContent); // Save plain text content
//     } catch (error) {
//       console.error('Error parsing editor content:', error);
//     }
//   };
  

//   const enableCover = async () => {
//     const response = await fetch('https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
//     const imageUrl = await response.url;
//     setCoverUrl(imageUrl); 
//   }

//   const Editor = useMemo(
//     () =>
//       dynamic(() => import("@/components/contentEditor/editor"), {
//         ssr: false,
//       }),
//     []
//   );

//   const handleSave = async () => {
//     try {
//       console.log('Saving post with:', { title, content: plainTextContent, cover_url: coverUrl });
      
//       const response = await fetch('/api/posts', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           title,
//           content: DOMPurify.sanitize(plainTextContent), 
//           cover_url: coverUrl,
//         }),
//       });

//       if (response.ok) {
//         const result = await response.json();
//         console.log('Post saved:', result);

//         //Reset State after a successful Save
//         setCoverUrl('');
//         setTitle('');
//         setEditorContent('');
//         setPlainTextContent('');
//         setSelectedPost(null);
//         setIsEditing(false);

//         fetchPosts();

//         // Refresh the page and  keep the user on the same page
//         window.location.reload();

//       } else {
//         console.error('Error saving post:', response.statusText);
//       }
//     } catch (error) {
//       console.error('Error saving post:', error);
//     }
//   };

//   const handleUpdate = async () => {
//     if (!selectedPost) return;

//     const response = await fetch(`/api/posts/${selectedPost.id}`, {
//       method: 'PUT',
//       headers:{
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         title,
//         content: plainTextContent,
//         cover_url: coverUrl,
//       }),
//     });

//     if (response.ok){
//       const result = await response.json();
//       console.log('Post updated:', result);
//       fetchPosts();
//       setIsEditing(false);
//     } else {
//       console.error("Error updating post:", response.statusText);
//     }
//   };

//   const handleDelete = async () => {
//     if (!selectedPost) return;

//     try {
//       const response = await fetch(`/api/posts/${selectedPost.id}`, {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       if (response.ok) {
//         console.log('Post deleted');
//         fetchPosts();
//       } else {
//         console.error('Error deleting post:', response.statusText);
//       }
//     } catch (error) {
//       console.error('Error deleting post:', error);
//     }
//   };

//   const handlePostClick = (post: any) => {
//     setSelectedPost(post.id === selectedPost?.id ? null : post);
//     if (!isEditing) {
//       setTitle('');
//       setEditorContent('');
//       setPlainTextContent('');
//       setCoverUrl('');
//     } else {
//       setTitle(post.title || "");
//       setEditorContent(post.content || ""); 
//       setPlainTextContent(post.content || ""); 
//       setCoverUrl(post.cover_url || "");
//     }
//   };

//   const startEditing =() =>{
//     if (selectedPost){
//       setIsEditing(true);
//       setTitle(selectedPost.title || '');
//       setEditorContent(selectedPost.content || '');
//       setPlainTextContent(selectedPost.content || '');
//       setCoverUrl(selectedPost.cover_url || '');
//     }
//   };

//   const fetchPosts = async () => {
//     const { data, error } = await supabase.from('posts').select('*');
//     if (error) {
//       console.error('Error fetching posts:', error);
//     } else {
//       setPosts(data || []);
//     }
//   };

//   return (
//     <main className={styles.container}>
//       <header className="flex items-center justify-between px-4 py-2 mt-5 mb-7">
//         <Button text="Dashboard" />
//         <div className="flex-1"></div>
//         <div className="flex-1 flex justify-end">
//           <Button text="Publish" onClick={handleSave} />
//           <Button text="Update" onClick={handleUpdate} />
//           <Button text="Delete" onClick={handleDelete} />
//         </div>
//       </header>

//       <Cover url={coverUrl} setUrl={setCoverUrl} />
//       <div>
//         <div className={styles.group}>
//           {!coverUrl && (
//             <div className={styles.hiddenContent}>
//               <button className={styles.button} onClick={enableCover}>
//                 📷 Add Cover
//               </button>
//             </div>
//           )}
//           <div className={styles.textareaContainer}>
//             <textarea
//               placeholder="Article Title..."
//               className={styles.textarea}
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//             ></textarea>
//           </div>
//         </div>

//         <Editor
//           onChange={handleEditorChange}
//           initialContent={JSON.stringify(editorContent)} 
//           editable={true}
//         />
//       </div>
//       <section>
//   <h1 className="text-white text-2xl mb-4">Posts</h1>
//   <ul className="space-y-4">
//     {posts && posts.length > 0 ? (
//       posts.map((post) => (
//         <li
//           key={post.id}
//           onClick={() => handlePostClick(post)}
//           className={`cursor-pointer p-4 border rounded-lg transition-all duration-300 ease-in-out ${
//             selectedPost?.id === post.id ? 'border-blue-500 bg-gray-800' : 'border-gray-600 hover:border-blue-500 hover:bg-gray-700'
//           }`}
//         >
//           {selectedPost?.id !== post.id ? (
//             <div className="flex items-center">
//               {post.cover_url && (
//                 <img
//                   src={post.cover_url}
//                   alt={post.title}
//                   className="w-16 h-16 object-cover rounded mr-4"
//                 />
//               )}
//               <div>
//                 <h1 className="font-bold text-lg text-white">{post.title}</h1>
//                 <p className="text-gray-400">{post.content ? post.content.slice(0, 80) : ''}...</p>
//               </div>
//             </div>
//           ) : (
//             <div>
//               {post.cover_url && (
//                 <img
//                   src={post.cover_url}
//                   alt={post.title}
//                     className="w-full max-w-md h-auto object-cover rounded mb-4 mx-auto"
//                 />
//               )}
//               <h1 className="font-bold text-xl text-white mb-2">{post.title}</h1>
//               <div
//                 className="text-gray-300"
//                 dangerouslySetInnerHTML={{
//                   __html: DOMPurify.sanitize(post.content),
//                 }}
//               />
//             </div>
//           )}
//         </li>
//       ))
//     ) : (
//       <p className="text-gray-400">No posts available</p>
//     )}
//   </ul>
// </section>


//       <FooterBottom className="text-white" />
//     </main>
//   );
// };

// export default EditorPage;
