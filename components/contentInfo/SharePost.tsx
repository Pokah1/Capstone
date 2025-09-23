"use client";

import { useState, useEffect } from "react";

interface SharePostProps {
  postId: string;
  postTitle?: string;
}

export default function SharePost({ postId, postTitle }: SharePostProps) {
  const [copied, setCopied] = useState(false);
  const [postUrl, setPostUrl] = useState("");

  // Set postUrl on client-side
  useEffect(() => {
    setPostUrl(`${window.location.origin}/posts/${postId}`);
  }, [postId]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const twitterShare = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    postTitle || "Check out this post!"
  )}&url=${encodeURIComponent(postUrl)}`;

  const facebookShare = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    postUrl
  )}`;

  const linkedInShare = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    postUrl
  )}`;

  return (
    <div className="flex flex-wrap gap-2 items-center mt-2">
      {/* Copy Link Button */}
      <button
        onClick={handleCopy}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
          copied ? "bg-green-600 text-white" : "bg-gray-700 text-white hover:bg-gray-800"
        }`}
      >
        {copied ? (
          <>
            <span>Copied!</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 111.414-1.414L8.414 12.586l7.879-7.879a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </>
        ) : (
          <>
            <span>Copy Link</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.59 13.41L12 17l7-7-7-7-3.41 3.41"
              />
            </svg>
          </>
        )}
      </button>

      {/* Social Share Buttons */}
      <a
        href={twitterShare}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
      >
        Twitter
      </a>
      <a
        href={facebookShare}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 rounded-lg bg-blue-700 text-white hover:bg-blue-800 transition"
      >
        Facebook
      </a>
      <a
        href={linkedInShare}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-900 transition"
      >
        LinkedIn
      </a>
    </div>
  );
}
