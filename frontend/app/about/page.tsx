"use client";

import React from "react";
import { useRouter } from "next/navigation";

const AboutSection = () => {
  const router = useRouter();

  const features = [
    {
      icon: "💭",
      title: "Share Your Thoughts",
      description:
        "Express yourself freely and share what's on your mind with the world.",
    },
    {
      icon: "🔍",
      title: "Discover Perspectives",
      description:
        "Explore thoughts from people around you and discover new perspectives.",
    },
    {
      icon: "❤️",
      title: "Connect Through Engagement",
      description: "Like and interact with posts that resonate with you.",
    },
    {
      icon: "🛡️",
      title: "Safe Space",
      description:
        "A respectful community where your voice is valued and heard.",
    },
  ];

  const team = [
    {
      name: "Praveen Kumar",
      role: "Full Stack Developer",
      bio: "Passionate about creating meaningful digital experiences.",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-r from-blue-300 via-blue-100 to-blue-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header Section */}
        <div className="text-center mb-12 bg-white/90 rounded-lg p-6">
          <h1 className="text-4xl sm:text-3xl font-bold text-gray-90 mb-4">
            About POSTLY
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            A modern platform where thoughts flow freely, connections are made,
            and voices are heard.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white/90 rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Our Mission
            </h2>
            <p className="text-gray-700 leading-relaxed">
              To create a digital sanctuary where people can express their
              thoughts without judgment, discover diverse perspectives, and
              build meaningful connections through shared experiences.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-12">
          <h2 className="text-4xl sm:text-2xl font-bold text-center bg-linear-to-b from-blue-800 to-blue-400 bg-clip-text text-transparent mb-8">
            Why Choose POSTLY?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/90 rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white/90 rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-lg font-bold mx-auto mb-3">
                1
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Sign Up</h3>
              <p className="text-gray-600 text-sm">Join our community</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-lg font-bold mx-auto mb-3">
                2
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Share Thoughts
              </h3>
              <p className="text-gray-600 text-sm">Express yourself freely</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-lg font-bold mx-auto mb-3">
                3
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Connect</h3>
              <p className="text-gray-600 text-sm">Engage with others</p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white/90 rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
            Meet the Creator
          </h2>
          <div className="max-w-md mx-auto">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-blue-600 mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-black">
          <p className="text-sm">Made with ❤️ for meaningful conversations</p>
          <p className="text-xs mt-2">© 2025 POSTLY. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;