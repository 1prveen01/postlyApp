"use client";

import React, { useState, useEffect } from "react";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import { getUserTweets, toggleLikeTweet, getTweetLikesCount, getAllTweets, updateTweet, deleteTweet } from "@/lib/axiosInstance";

interface PostedCardProps {
  posts?: Array<{
    id: string;
    content: string;
    avatar: string;
    username: string;
    timestamp: string;
    likesCount: number;
  }>;
}

const PostedCard = ({ posts = [] }: PostedCardProps) => {
  const [tweets, setTweets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingTweetId, setEditingTweetId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [likingTweetId, setLikingTweetId] = useState<string | null>(null);

  useEffect(() => {
    fetchUserTweetsWithLikes();
  }, []);

  const fetchUserTweetsWithLikes = async () => {
    try {
      setLoading(true);
      
      // Get user tweets
      const tweetsResponse = await getUserTweets(1, 10);
      const tweetsData = tweetsResponse.data?.tweet || [];
      
      // Get all tweets with likes info to check which ones are liked
      const allTweetsResponse = await getAllTweets();
      const allTweetsData = allTweetsResponse.data?.tweets || allTweetsResponse.data || allTweetsResponse;
      
      console.log("All tweets with likes:", allTweetsData);

      // Combine user tweets with like information
      const tweetsWithLikes = tweetsData.map((tweet: any) => {
        // Find this tweet in allTweets to get like status
        const tweetWithLikes = Array.isArray(allTweetsData) 
          ? allTweetsData.find((t: any) => t._id === tweet._id)
          : null;
        
        return {
          ...tweet,
          likes: tweetWithLikes?.likesCount || 0,
          isLiked: tweetWithLikes?.isLiked || false
        };
      });

      console.log("Tweets with likes:", tweetsWithLikes);
      setTweets(tweetsWithLikes);
    } catch (err: any) {
      console.error("Error fetching tweets:", err);
      setError(err.response?.data?.message || "Failed to load tweets");
    } finally {
      setLoading(false);
    }
  };

  // Display real date and time without formatting
  const formatRealDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString(); // Shows full date and time
  };

  // Handle like/dislike
  const handleLikeToggle = async (tweetId: string, currentIsLiked: boolean) => {
    try {
      setLikingTweetId(tweetId);
      
      // Optimistically update UI
      setTweets(prevTweets =>
        prevTweets.map(tweet =>
          tweet._id === tweetId
            ? {
                ...tweet,
                likes: currentIsLiked ? (tweet.likes - 1) : (tweet.likes + 1),
                isLiked: !currentIsLiked
              }
            : tweet
        )
      );

      // Call API to toggle like
      const response = await toggleLikeTweet(tweetId);
      console.log("Like toggle response:", response);

      // Refresh likes count from API to ensure accuracy
      const likesCountResponse = await getTweetLikesCount(tweetId);
      console.log("Likes count response:", likesCountResponse);

      // Update with actual data from API
      setTweets(prevTweets =>
        prevTweets.map(tweet =>
          tweet._id === tweetId
            ? {
                ...tweet,
                likes: likesCountResponse.data?.likesCount || tweet.likes,
                isLiked: response.data?.isLiked !== undefined ? response.data.isLiked : !currentIsLiked
              }
            : tweet
        )
      );

    } catch (error) {
      console.error("Failed to toggle like:", error);
      
      // Revert optimistic update on error
      setTweets(prevTweets =>
        prevTweets.map(tweet =>
          tweet._id === tweetId
            ? {
                ...tweet,
                likes: currentIsLiked ? (tweet.likes + 1) : (tweet.likes - 1),
                isLiked: currentIsLiked
              }
            : tweet
        )
      );
      
      alert("Failed to update like");
    } finally {
      setLikingTweetId(null);
    }
  };

  // Handle edit start
  const handleEditStart = (tweet: any) => {
    setEditingTweetId(tweet._id);
    setEditContent(tweet.content);
  };

  // Handle edit save
  const handleEditSave = async (tweetId: string) => {
    try {
      await updateTweet(tweetId, editContent);
      setEditingTweetId(null);
      setEditContent("");
      // Refresh tweets after edit
      fetchUserTweetsWithLikes();
    } catch (error) {
      console.error("Failed to update tweet:", error);
      alert("Failed to update tweet");
    }
  };

  // Handle edit cancel
  const handleEditCancel = () => {
    setEditingTweetId(null);
    setEditContent("");
  };

  // Handle delete
  const handleDelete = async (tweetId: string) => {
    if (!confirm("Are you sure you want to delete this tweet?")) return;

    try {
      await deleteTweet(tweetId);
      // Refresh tweets after delete
      fetchUserTweetsWithLikes();
    } catch (error) {
      console.error("Failed to delete tweet:", error);
      alert("Failed to delete tweet");
    }
  };

  if (loading) {
    return (
      <div className="w-full">
        <h4 className="p-2 md:p-4 font-semibold text-gray-800">
          Your Recent Thoughts
        </h4>
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <h4 className="p-2 md:p-4 font-semibold text-gray-800">
          Your Recent Thoughts
        </h4>
        <div className="flex justify-center items-center h-40">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  // Use live data from backend, fallback to sample data if no tweets
  const displayPosts = tweets.length > 0 ? tweets : posts;

  return (
    <div className="w-full">
      <h4 className="p-2 md:p-4 font-semibold text-gray-800">
        Your Recent Thoughts
      </h4>

      {/* Scrollable container with max height */}
      <div className="max-h-[500px] overflow-y-auto space-y-3 px-2 md:px-4 pb-4">
        {displayPosts.length > 0 ? (
          displayPosts.map((post) => (
            <div
              key={post._id || post.id}
              className="border rounded-md hover:shadow-lg transition-all duration-200 flex flex-col sm:flex-row p-3 md:p-4 shadow-md border-gray-300 bg-white"
            >
              {/* Left section - Avatar & Timestamp */}
              <div className="flex sm:flex-col items-center sm:items-start gap-2 sm:gap-0 sm:w-24 mb-3 sm:mb-0">
                <div className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-linear-to-br from-amber-500 to-amber-600 shrink-0 overflow-hidden">
                  <img
                    src={post.owner?.avatar || post.avatar || "/default-avatar.png"}
                    alt={post.owner?.username || post.username}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/default-avatar.png";
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 sm:mt-2">
                  {formatRealDateTime(post.createdAt || post.timestamp)}
                </p>
              </div>

              {/* Right section - Content & Actions */}
              <div className="flex-1 sm:ml-3 md:ml-4 flex flex-col justify-between space-y-3">
                {/* Post Content - Editable when editing */}
                {editingTweetId === (post._id || post.id) ? (
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="text-sm md:text-base text-gray-700 border border-gray-300 rounded p-2 resize-none min-h-20 w-full"
                    maxLength={280}
                  />
                ) : (
                  <p className="text-sm md:text-base text-gray-700 line-clamp-3">
                    {post.content}
                  </p>
                )}

                {/* Actions - Likes & Edit/Delete Buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  {/* Like Button */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleLikeToggle(post._id || post.id, post.isLiked || false)}
                      disabled={likingTweetId === (post._id || post.id)}
                      className={`flex items-center gap-1 transition-all duration-200 ${
                        post.isLiked 
                          ? "text-red-600 hover:text-red-700" 
                          : "text-gray-600 hover:text-red-600"
                      } ${likingTweetId === (post._id || post.id) ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      {post.isLiked ? (
                        <IoIosHeart className="text-xl md:text-2xl hover:scale-110 active:scale-125 transition-transform" />
                      ) : (
                        <IoIosHeartEmpty className="text-xl md:text-2xl hover:scale-110 active:scale-125 transition-transform" />
                      )}
                      <span className="text-sm md:text-base font-semibold">
                        {post.likes || 0}
                      </span>
                    </button>
                  </div>

                  {/* Edit/Save & Delete Buttons */}
                  <div className="flex gap-2">
                    {editingTweetId === (post._id || post.id) ? (
                      <>
                        <button
                          onClick={() => handleEditSave(post._id || post.id)}
                          className="px-3 py-1.5 bg-green-600 text-white text-xs md:text-sm font-medium rounded hover:bg-green-700 hover:-translate-y-0.5 active:scale-95 transition-all duration-150"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleEditCancel}
                          className="px-3 py-1.5 bg-gray-500 text-white text-xs md:text-sm font-medium rounded hover:bg-gray-600 hover:-translate-y-0.5 active:scale-95 transition-all duration-150"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditStart(post)}
                          className="px-4 py-1.5 bg-black text-white text-xs md:text-sm font-medium rounded hover:bg-neutral-700 hover:-translate-y-0.5 active:scale-95 transition-all duration-150"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(post._id || post.id)}
                          className="px-4 py-1.5 bg-red-600 text-white text-xs md:text-sm font-medium rounded hover:bg-red-700 hover:-translate-y-0.5 active:scale-95 transition-all duration-150"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No thoughts yet. Share your first thought!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostedCard;