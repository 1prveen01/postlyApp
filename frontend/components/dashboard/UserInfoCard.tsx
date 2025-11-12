"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/axiosInstance";

interface User {
  _id: string;
  fullName: string;
  username: string;
  email: string;
  avatar: string;
}

const UserInfoCard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const router = useRouter();

  // Fetch current user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await getCurrentUser();
        console.log("User API Response:", response);
        
        // Extract user data from response.data
        const userData = response.data;
        console.log("User Data:", userData);
        
        if (!userData) {
          throw new Error("No user data found in response");
        }

        setUser(userData);
        
      } catch (error: any) {
        console.error("Failed to fetch user data:", error);
        setMessage({ 
          type: 'error', 
          text: error.response?.data?.message || error.message || 'Failed to load user data' 
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Navigate to update account page
  const handleUpdateAccount = () => {
    router.push("/update-account");
  };

  // Navigate to update avatar page
  const handleUpdateAvatar = () => {
    router.push("/update-avatar");
  };

  if (loading && !user) {
    return (
      <div>
        <h4 className="p-2 md:p-4 text-md font-semibold">Loading user data...</h4>
        <div className="flex px-2 md:px-4 justify-between items-center">
          <div className="h-16 w-16 rounded-lg bg-gray-200 animate-pulse"></div>
          <div className="flex flex-col items-start mr-4 justify-center space-y-2">
            <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-3 w-32 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <h4 className="p-2 md:p-4 text-md font-semibold text-red-500">
          Failed to load user data
        </h4>
        <div className="px-2 md:px-4">
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Success/Error Messages */}
      {message.text && (
        <div className={`mx-2 mb-3 p-2 rounded text-sm ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <h4 className="p-2 md:p-4 text-md font-semibold">
        Welcome, {user.username}
      </h4>
      
      <div className="flex px-2 md:px-4 justify-between items-center">
        {/* Avatar Section */}
        <div className="relative">
          <img
            src={user.avatar}
            className="h-16 w-16 rounded-lg object-cover border border-gray-300"
            alt={`${user.fullName}'s avatar`}
            onError={(e) => {
              // Fallback to a gradient background if avatar fails to load
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent) {
                const fallback = document.createElement('div');
                fallback.className = 'h-16 w-16 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold';
                fallback.textContent = user.fullName.charAt(0).toUpperCase();
                parent.appendChild(fallback);
              }
            }}
          />
        </div>

        {/* User Info Section */}
        <div className="flex flex-col items-start mr-4 justify-center">
          <h2 className="font-semibold">{user.fullName}</h2>
          <span className="text-sm text-gray-600">@{user.username}</span>
          <span className="text-sm text-gray-600">{user.email}</span>
        </div>
      </div>

      {/* Action Buttons - Fixed size */}
      <div className="flex my-1 mt-6">
        <button 
          onClick={handleUpdateAvatar}
          className="w-full transition-all bg-black duration-150 hover:bg-neutral-700 cursor-pointer hover:-translate-y-0.5 active:scale-95 text-white p-1 rounded font-regular mx-2"
        >
          Update Avatar
        </button>
        <button 
          onClick={handleUpdateAccount}
          className="w-full transition-all bg-black duration-150 hover:bg-neutral-700 cursor-pointer hover:-translate-y-0.5 active:scale-95 text-white p-1 rounded font-medium mx-2"
        >
          Update Account
        </button>
      </div>
    </div>
  );
};

export default UserInfoCard;