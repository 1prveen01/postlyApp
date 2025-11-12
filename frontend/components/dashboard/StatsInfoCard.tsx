"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MdOutlinePostAdd } from "react-icons/md";
import { TiHeart } from "react-icons/ti";
import { logout, getUserTweets, getLikedTweets } from "@/lib/axiosInstance";

const StatsInfoCard = () => {
  const router = useRouter();
  const [totalPosts, setTotalPosts] = useState(0);
  const [likedPosts, setLikedPosts] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        // ✅ Fetch user tweets (total posts)
        const tweetsResponse = await getUserTweets(1, 1);
        
        // ✅ FIX: Fetch liked tweets with a large limit to get all of them
        // Or use a separate API endpoint that just returns the count
        const likedResponse = await getLikedTweets(1, 100); // Increased limit to get all tweets

        console.log("📊 Tweets Response:", tweetsResponse);
        console.log("❤️ Liked Tweets Response:", likedResponse);

        // ✅ Extract total posts count from getUserTweets response
        const totalPostsCount =
          tweetsResponse?.data?.totalTweet ||
          tweetsResponse?.data?.totalTweets ||
          tweetsResponse?.totalTweet ||
          tweetsResponse?.totalTweets ||
          tweetsResponse?.data?.tweets?.length ||
          0;

        // ✅ Extract liked posts count from getLikedTweets response
        // Use totalLikedTweets from the response, not the array length
        const likedPostsCount =
          likedResponse?.data?.totalLikedTweets || 0;

        console.log("📈 Total Posts Count:", totalPostsCount);
        console.log("💖 Liked Posts Count:", likedPostsCount);

        setTotalPosts(totalPostsCount);
        setLikedPosts(likedPostsCount);
      } catch (error) {
        console.error("❌ Failed to fetch stats:", error);
        setTotalPosts(0);
        setLikedPosts(0);
      } finally {
        setLoading(false);
      }
    };

    // ✅ Fetch stats initially
    fetchStats();

    // ✅ Update on "updateStats" event (triggered from PostedCard)
    const handleUpdate = () => fetchStats();
    window.addEventListener("updateStats", handleUpdate);

    // ✅ Cleanup listener on unmount
    return () => window.removeEventListener("updateStats", handleUpdate);
  }, []);

  // ✅ Handle logout
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/");
      router.refresh();
    }
  };

  // ✅ Skeleton loading UI
  if (loading) {
    return (
      <div>
        <h2 className="p-2 md:p-4 text-md font-semibold">Quick Stats</h2>

        <div className="flex px-2 md:px-4 py-2 justify-between items-center">
          <div className="flex gap-4 items-center">
            <MdOutlinePostAdd className="size-6 text-neutral-700" />
            <h4 className="text-md text-neutral-700">Total Posts:</h4>
          </div>
          <div className="h-4 w-6 bg-gray-200 animate-pulse rounded mr-4"></div>
        </div>

        <div className="flex px-2 md:px-4 justify-between items-center">
          <div className="flex gap-4 items-center">
            <TiHeart className="size-6 text-neutral-700" />
            <h4 className="text-md text-neutral-700">Liked Posts:</h4>
          </div>
          <div className="h-4 w-6 bg-gray-200 animate-pulse rounded mr-4"></div>
        </div>

        <div className="flex my-1 mt-6">
          <button className="w-full transition-all bg-black duration-150 hover:bg-neutral-700 cursor-pointer hover:-translate-y-0.5 active:scale-95 text-white p-1 rounded font-regular mx-2">
            Change Password
          </button>
          <button className="w-full transition-all bg-red-900 duration-150 hover:bg-red-700 cursor-pointer hover:-translate-y-0.5 active:scale-95 text-white p-1 rounded font-medium mx-2">
            Logout
          </button>
        </div>
      </div>
    );
  }

  // ✅ Main UI (after loading)
  return (
    <div>
      <h2 className="p-2 md:p-4 text-md font-semibold">Quick Stats</h2>

      {/* Total Posts */}
      <div className="flex px-2 md:px-4 py-2 justify-between items-center">
        <div className="flex gap-4 items-center">
          <MdOutlinePostAdd className="size-6 text-neutral-700" />
          <h4 className="text-md text-neutral-700">Total Posts:</h4>
        </div>
        <h4 className="mr-4 font-semibold">{totalPosts}</h4>
      </div>

      {/* Liked Posts */}
      <div className="flex px-2 md:px-4 justify-between items-center">
        <div className="flex gap-4 items-center">
          <TiHeart className="size-6 text-neutral-700" />
          <h4 className="text-md text-neutral-700">Liked Posts:</h4>
        </div>
        <h4 className="mr-4 font-semibold">{likedPosts}</h4>
      </div>

      {/* Buttons */}
      <div className="flex my-1 mt-6">
        <button
          onClick={() => router.push("/change-password")}
          className="w-full transition-all bg-black duration-150 hover:bg-neutral-700 cursor-pointer hover:-translate-y-0.5 active:scale-95 text-white p-1 rounded font-regular mx-2"
        >
          Change Password
        </button>
        <button
          onClick={handleLogout}
          className="w-full transition-all bg-red-900 duration-150 hover:bg-red-700 cursor-pointer hover:-translate-y-0.5 active:scale-95 text-white p-1 rounded font-medium mx-2"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default StatsInfoCard;