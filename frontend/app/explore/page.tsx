"use client";

import React, { useEffect, useState } from "react";
import { IoSearch, IoClose } from "react-icons/io5";
import {
  getAllTweet,
} from "@/lib/axiosInstance";

interface Tweet {
  _id: string;
  content: string;
  owner: {
    _id: string;
    username: string;
    fullName: string;
    avatar: string;
  };
  createdAt: string;
  likesCount?: number;
  isLiked?: boolean;
}

const PostedCard = () => {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [filteredTweets, setFilteredTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Fetch tweets
  useEffect(() => {
    const fetchTweets = async () => {
      try {
        setLoading(true);
        const response = await getAllTweet();
        console.log("API Response:", response);
        
        // Extract tweets from the correct structure
        const tweetsData = response?.data?.tweets || [];
        console.log("Tweets data:", tweetsData);
        
        setTweets(tweetsData);
        setFilteredTweets(tweetsData); // Initialize filtered tweets with all tweets
      } catch (err: any) {
        console.error("Failed to fetch tweets:", err);
        setError(err.response?.data?.message || "Failed to load tweets");
      } finally {
        setLoading(false);
      }
    };
    
    fetchTweets();
  }, []);

  // ✅ Filter tweets based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredTweets(tweets);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = tweets.filter(tweet => 
      tweet.content.toLowerCase().includes(query) ||
      tweet.owner.fullName.toLowerCase().includes(query) ||
      tweet.owner.username.toLowerCase().includes(query)
    );
    
    setFilteredTweets(filtered);
  }, [searchQuery, tweets]);

  // ✅ Format date & time in readable form
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // ✅ Clear search
  const clearSearch = () => {
    setSearchQuery("");
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-linear-to-r from-blue-200 via-blue-50 to-blue-200 py-8">
        <div className="max-w-4xl mx-auto">
          <h4 className="p-2 md:p-4 font-semibold text-gray-800 text-center text-xl">ALL POSTS</h4>
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-linear-to-r from-blue-200 via-blue-50 to-blue-200 py-8">
        <div className="max-w-4xl mx-auto">
          <h4 className="p-2 md:p-4 font-semibold text-gray-800 text-center text-xl">ALL POSTS</h4>
          <div className="flex justify-center items-center h-40">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-linear-to-r from-blue-200 via-blue-50 to-blue-200 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with Search */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 px-2 md:px-4">
          <h4 className="p-2 md:p-4 font-semibold text-gray-800 text-center text-xl">
            ALL POSTS ({filteredTweets.length})
            {searchQuery && (
              <span className="text-sm font-normal text-gray-600 ml-2">
                (Search: "{searchQuery}")
              </span>
            )}
          </h4>
          
          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <div className="relative">
              <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                placeholder="Search tweets, users, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <IoClose className="text-lg" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="max-h-[600px] overflow-y-auto space-y-4 px-2 md:px-4 pb-4">
          {filteredTweets.length > 0 ? (
            filteredTweets.map((tweet) => (
              <div
                key={tweet._id}
                className="border rounded-lg hover:shadow-lg transition-all duration-200 flex flex-col sm:flex-row p-4 md:p-6 shadow-md border-gray-300 bg-white"
              >
                {/* Avatar & User Info */}
                <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2 sm:w-36 mb-3 sm:mb-0">
                  <div className="h-14 w-14 md:h-16 md:w-16 rounded-full bg-linear-to-br from-amber-500 to-amber-600 overflow-hidden shrink-0">
                    <img
                      src={tweet.owner?.avatar || "/default-avatar.png"}
                      alt={tweet.owner?.username || "User"}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/default-avatar.png";
                      }}
                    />
                  </div>
                  <div className="text-sm text-gray-600 sm:mt-2">
                    <p className="font-semibold text-gray-800 text-base">
                      {tweet.owner?.fullName || "Unknown User"}
                    </p>
                    <p className="text-xs text-gray-500">@{tweet.owner?.username || "user"}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {formatDateTime(tweet.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Tweet Content */}
                <div className="flex-1 sm:ml-4 md:ml-6 flex flex-col justify-between">
                  <p className="text-base md:text-lg text-gray-800 wrap-break-words leading-relaxed">
                    {tweet.content}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow-sm">
              {searchQuery ? (
                <>
                  <p className="text-xl mb-2">No matching tweets found</p>
                  <p className="text-gray-600">
                    No results for "<span className="font-semibold">{searchQuery}</span>"
                  </p>
                  <button
                    onClick={clearSearch}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Clear Search
                  </button>
                </>
              ) : (
                <>
                  <p className="text-xl mb-2">No tweets yet</p>
                  <p className="text-gray-600">Be the first to share your thoughts!</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostedCard;