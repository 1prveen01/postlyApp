"use client";
import { useAuth } from '@/context/AuthContext';
import PostedCard from "@/components/dashboard/PostedCard";
import PostInputCard from "@/components/dashboard/PostInputCard";
import StatsInfoCard from "@/components/dashboard/StatsInfoCard";
import UserInfoCard from "@/components/dashboard/UserInfoCard";
import { useEffect } from 'react';

const Page = () => {
  const { user, isLoggedIn, logout, isLoading } = useAuth();

  // Check authentication status
  useEffect(() => {
    console.log("🔍 [Dashboard] Auth state:", { 
      user: user?.username, 
      isLoggedIn,
      isLoading 
    });
  }, [user, isLoggedIn, isLoading]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-r from-blue-100 via-white to-blue-200 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isLoggedIn) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-r from-blue-100 via-white to-blue-200 flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">Please log in to access the dashboard</p>
          <button 
            onClick={() => window.location.href = "/login"}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-r from-blue-100 via-white to-blue-200">
      {/* Logout Button */}
      <div className="w-full flex justify-end p-4">
        <button 
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md transition-colors flex items-center space-x-2"
        >
          <span>Logout</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>

      {/* Dashboard Content */}
      <div className="w-full max-w-4xl p-4 md:p-8 border-l-2 border-gray-400 shadow-lg shadow-gray-900 bg-transparent grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-min mx-auto">
       
        {/* Row 1 */}
        <div className="bg-gray-100 w-full border border-gray-400 shadow-md hover:scale-102 transition-all duration-200 shadow-gray-900/50 rounded-lg">
          <UserInfoCard />
        </div>
        <div className="bg-gray-100 w-full border border-gray-400 shadow-md shadow-gray-900/50 hover:scale-102 transition-all duration-200 rounded-lg">
          <StatsInfoCard />
        </div>

        {/* Row 2 */}
        <div className="bg-gray-100 w-full rounded-lg border hover:scale-102 transition-all duration-200 border-gray-400 shadow-md shadow-gray-900/50 md:col-span-2">
          <PostInputCard />
        </div>

        {/* Row 3 */}
        <div className="bg-gray-100 w-full border overflow-hidden border-gray-400 shadow-md shadow-gray-900/50 rounded-lg md:col-span-2">
          <PostedCard />
        </div>
      </div>
    </div>
  );
};

export default Page;