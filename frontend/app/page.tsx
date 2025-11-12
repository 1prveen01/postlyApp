"use client";
import React from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/dashboard");
  };

  return (
    <>
      <div className="w-full min-h-screen bg-linear-to-r from-blue-100 via-white to-blue-200 flex flex-col md:gap-20 sm:gap-8 gap-6 items-center justify-center">
        <h2 className="bg-linear-to-t from-blue-100 to-blue-500 bg-clip-text font-extrabold text-transparent text-6xl md:text-7xl">
          POSTLY
        </h2>
        <h2 className="text-md md:text-lg font-regular sm:w-3xl lg:w-4xl text-center">
          A modern web app that allows users to easily create, share, and
          explore text-based{" "}
          <span className="text-blue-400 font-semibold">posts</span> in real
          time. Users can express their their{" "}
          <span className="text-blue-400 font-semibold">thoughts</span> and
          ideas through clean, minimal posts, all withing a sleek, responsive
          and user-friendly interface.
        </h2>
        <div>
          <input
            type="text"
            onClick={handleClick}
            className="rounded-2xl max-w-3xl w-full px-2 py-1 border border-gray-400 cursor-pointer hover:border-blue-400 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            placeholder="✨ Start Posting Today →"
            readOnly
          />
        </div>
      </div>
    </>
  );
};

export default Page;