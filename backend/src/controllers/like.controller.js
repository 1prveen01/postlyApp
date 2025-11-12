import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { Tweet } from "../models/tweets.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";

//  Get all tweets with likes count and isLiked
const getAllTweets = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  // Fetch all tweets
  const tweets = await Tweet.find()
    .populate("owner", "username fullName avatar")
    .sort({ createdAt: -1 });

  // Add likesCount + isLiked to each tweet
  const tweetsWithLikes = await Promise.all(
    tweets.map(async (tweet) => {
      const likesCount = await Like.countDocuments({ tweet: tweet._id });
       let isLiked = false;
      if (userId) {
        isLiked = await Like.exists({ tweet: tweet._id, likedBy: userId });
      }
      return {
        ...tweet.toObject(),
        likesCount,
        isLiked: !!isLiked,
      };
    })
  );

  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        { tweets: tweetsWithLikes },
        "All tweets fetched successfully"
      )
    );
});

// Toggle like/unlike a tweet
const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const userId = req.user?._id;

  if (!tweetId) throw new apiError(400, "Tweet Id is missing");

  const tweet = await Tweet.findById(tweetId);
  if (!tweet) throw new apiError(404, "Tweet not found");

  const alreadyLiked = await Like.findOne({ tweet: tweetId, likedBy: userId });

  if (alreadyLiked) {
    await alreadyLiked.deleteOne();
    const likesCount = await Like.countDocuments({ tweet: tweetId });
    return res
      .status(200)
      .json(
        new apiResponse(
          200,
          { isLiked: false, likesCount },
          "Tweet disliked successfully"
        )
      );
  } else {
    await Like.create({ tweet: tweetId, likedBy: userId });
    const likesCount = await Like.countDocuments({ tweet: tweetId });
    return res
      .status(200)
      .json(
        new apiResponse(
          200,
          { isLiked: true, likesCount },
          "Tweet liked successfully"
        )
      );
  }
});
// Get tweets liked by current user
const getLikedTweets = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { page = 1, limit = 10 } = req.query;

  if (!userId) throw new apiError(400, "User id is missing");

  const skip = (Number(page) - 1) * Number(limit);

  const likedTweets = await Like.find({
    likedBy: userId,
    tweet: { $exists: true, $ne: null },
  })
    .populate({
      path: "tweet",
      populate: {
        path: "owner",
        select: "username fullName avatar",
      },
    })
    .skip(skip)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  // Filter out null tweets (tweets that were deleted but likes still exist)
  const validLikedTweets = likedTweets
    .filter((like) => like.tweet !== null)
    .map((like) => like.tweet);

  // ✅ FIX: Count only the valid liked tweets, not all likes
  const totalLikedTweets = validLikedTweets.length;

  // ✅ ALTERNATIVE FIX: If you want the total count from database (more efficient for pagination)
  // const totalLikedTweets = await Like.countDocuments({
  //   likedBy: userId,
  //   tweet: { $exists: true, $ne: null },
  // }).populate('tweet').then(likes => likes.filter(like => like.tweet !== null).length);

  return res.status(200).json(
    new apiResponse(
      200,
      {
        tweets: validLikedTweets,
        page: Number(page),
        limit: Number(limit),
        totalLikedTweets, // This will now match the actual number of tweets returned
      },
      "Liked tweets fetched successfully"
    )
  );
});
//  Get likes count for a specific tweet
const getTweetLikesCount = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  if (!tweetId || !isValidObjectId(tweetId))
    throw new apiError(400, "Valid Tweet ID is required");

  const tweetExists = await Tweet.exists({ _id: tweetId });
  if (!tweetExists) throw new apiError(404, "Tweet not found");

  const likesCount = await Like.countDocuments({ tweet: tweetId });

  return res.status(200).json(
    new apiResponse(
      200,
      { tweetId, likesCount },
      "Likes count fetched successfully"
    )
  );
});

export {
  getAllTweets,
  toggleTweetLike,
  getLikedTweets,
  getTweetLikesCount,
};
