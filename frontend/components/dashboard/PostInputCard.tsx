"use client";
import React, { useState } from "react";
import { createTweet } from "@/lib/axiosInstance";

const PostInputCard = () => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setMessage({ type: 'error', text: 'Please write something before posting' });
      return;
    }

    if (content.length > 280) {
      setMessage({ type: 'error', text: 'Tweet must be less than 280 characters' });
      return;
    }

    try {
      setLoading(true);
      setMessage({ type: '', text: '' });

      const response = await createTweet(content);
      console.log("Tweet created:", response);

      // Clear input on success
      setContent("");
      setMessage({ type: 'success', text: 'Tweet posted successfully!' });

      // Clear success message after 3 seconds
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);

      // Optional: Refresh the page or update parent component
      // window.location.reload(); // or use a callback prop to update parent

    } catch (error: any) {
      console.error("Failed to create tweet:", error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to post tweet. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div>
      <h4 className="p-2 md:p-4 text-md font-semibold ">Create New Post</h4>
      
      {/* Success/Error Messages */}
      {message.text && (
        <div className={`mx-2 md:mx-4 mb-3 p-2 rounded text-sm ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="p-2 md:p-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="what's on your mind today?"
            className={`w-full border border-gray-900 md:px-4 md:py-2 px-2 py-1 rounded-md placeholder:text-gray-500 resize-none min-h-20`}
            disabled={loading}
            maxLength={280}
          />
          {/* Character counter */}
          <div className="text-right text-xs text-gray-500 mt-1">
            {content.length}/280
          </div>
        </div>
        
        <div className="p-2 md:p-4 w-full flex justify-end items-center">
          <button 
            type="submit"
            disabled={loading || !content.trim()}
            className="w-full md:max-w-50 transition-all bg-black duration-150 hover:bg-neutral-700 cursor-pointer hover:-translate-y-0.5 active:scale-95 text-white p-1 rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-black disabled:hover:translate-y-0"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Posting...
              </span>
            ) : (
              "post-thought"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostInputCard;